import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Demo user data
let users = [{
    id: '1',
    name: 'Jacob',
    email: 'jacob@example.com',
    age: 27
}, {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
}]

// Demo post data
let posts = [{
    id: '1',
    title: 'My first post!',
    body: 'I do not have much to say',
    published: true,
    author: '1'
}, {
    id: '2',
    title: 'What is a post?',
    body: 'Not this',
    published: false,
    author: '1'
}, {
    id: '3',
    title: 'SQL all the things!',
    body: 'select * from things;',
    published: true,
    author: '2'
}]

// Dummy comment data
let comments = [{
    id: '1',
    text: 'This is a nice comment!',
    author: '2',
    post: '1'
},
{
    id: '2',
    text: 'This sucks!',
    author: '2',
    post: '2'
},
{
    id: '3',
    text: "Can't we all be friends?!?",
    author: '3',
    post: '2'
},
{
    id: '4',
    text: 'I just want to sleep',
    author: '3',
    post: '3'
}]


// Resolvers
const resolvers = {
    Query: {
        posts(parent, { query }, ctx, info) {
            if (!query) {
                return posts
            }

            return posts.filter((post) => {
                let queryString = query.toLowerCase()
                return post.title.toLowerCase().includes(queryString) ||
                    post.body.toLowerCase().includes(queryString)
            })
        },
        users(parent, { query }, ctx, info) {
            if (!query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(query.toLowerCase())
            })
        },
        me() {
            return {
                id: 'abc123',
                name: 'Mike',
                email: 'mike@example.com'
            }
        },
        post() {
            return {
                id: 'post1',
                title: 'A lengthy discourse on databases',
                body: 'Some info',
                published: false
            }
        },
        comments(parents, args, ctx, info) {
            return comments
        }
    },
    Mutation: {
      createUser(parent, { data }, ctx, info) {
        const { name, email, age } = data
        const emailTaken = users.some((user) => {
          return user.email == email
        })

        if (emailTaken) {
          throw new Error('Email taken')
        }

        const user = {
          id: uuidv4(),
          ...data
        }

        users.push(user)

        return user
      },
      deleteUser(parent, { id }, ctx, info) {
        const userIndex = users.findIndex((user) => user.id == id)

        if (userIndex == -1) {
          throw new Error('User not found')
        }

        const [deletedUser] = users.splice(userIndex, 1)

        posts = posts.filter((post) => {
          const match = post.author == id

          if (match) {
            comments = comments.filter((comment) => comment.post !== post.id)
          }

          return !match
        })

        comments = comments.filter((comment) => comment.author !== id)

        return deletedUser
      },
      createPost(parent, { data }, ctx, info) {
        const { title, body, published, author} = data
        const userExists = users.some((user) => user.id == author)

        if (!userExists) {
          throw new Error('User not found')
        }

        const post = {
          id: uuidv4(),
          ...data
        }
        posts.push(post)

        return post
      },
      deletePost(parent, { id }, ctx, info) {
        const postIndex = posts.findIndex((post) => post.id == id)

        if (postIndex == -1) {
          throw new Error('Post not found')
        }

        comments = comments.filter((comment) => {
          const match = comment.post == id

          return !match
        })

        const [deletedPost] = posts.splice(postIndex, 1)

        return deletedPost
      },
      createComment(parent, { data }, ctx, info) {
        const { text, author, post } = data
        const userExists = users.some((user) => user.id == author)

        if (!userExists) {
          throw new Error('User not found')
        }

        const postValid = posts.some((p) => p.id == post && p.published == true)

        if (!postValid) {
          throw new Error('Post is not valid')
        }

        const comment = {
          id: uuidv4(),
          ...data
        }

        comments.push(comment)

        return comment
      },
      deleteComment(parent, { id }, ctx, info) {
        const commentIndex = comments.findIndex((comment) => comment.id == id)

        if (commentIndex === -1) {
          throw new Error('Comment not found')
        }

        const [deletedComment] = comments.splice(commentIndex, 1)

        return deletedComment
      }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id == parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post == parent.id
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author == parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author == parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id == parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id == parent.post
            })
        }
    }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(() => {
    console.log('The server is up!')
})
