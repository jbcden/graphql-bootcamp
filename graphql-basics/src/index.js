import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

import db from './db'

// Resolvers
const resolvers = {
    Query: {
        posts(parent, { query },  { db }, info) {
            if (!query) {
                return db.posts
            }

            return db.posts.filter((post) => {
                let queryString = query.toLowerCase()
                return post.title.toLowerCase().includes(queryString) ||
                    post.body.toLowerCase().includes(queryString)
            })
        },
        users(parent, { query }, { db }, info) {
            if (!query) {
                return db.users
            }

            return db.users.filter((user) => {
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
        comments(parents, args, { db }, info) {
            return db.comments
        }
    },
    Mutation: {
      createUser(parent, { data }, { db }, info) {
        const { name, email, age } = data
        const emailTaken = db.users.some((user) => {
          return user.email == email
        })

        if (emailTaken) {
          throw new Error('Email taken')
        }

        const user = {
          id: uuidv4(),
          ...data
        }

        db.users.push(user)

        return user
      },
      deleteUser(parent, { id }, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id == id)

        if (userIndex == -1) {
          throw new Error('User not found')
        }

        const [deletedUser] = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter((post) => {
          const match = post.author == id

          if (match) {
            db.comments = db.comments.filter((comment) => comment.post !== post.id)
          }

          return !match
        })

        db.comments = db.comments.filter((comment) => comment.author !== id)

        return deletedUser
      },
      createPost(parent, { data }, { db }, info) {
        const { title, body, published, author} = data
        const userExists = db.users.some((user) => user.id == author)

        if (!userExists) {
          throw new Error('User not found')
        }

        const post = {
          id: uuidv4(),
          ...data
        }
        db.posts.push(post)

        return post
      },
      deletePost(parent, { id }, { db }, info) {
        const postIndex = db.posts.findIndex((post) => post.id == id)

        if (postIndex == -1) {
          throw new Error('Post not found')
        }

        db.comments = db.comments.filter((comment) => {
          const match = comment.post == id

          return !match
        })

        const [deletedPost] = db.posts.splice(postIndex, 1)

        return deletedPost
      },
      createComment(parent, { data }, { db }, info) {
        const { text, author, post } = data
        const userExists = db.users.some((user) => user.id == author)

        if (!userExists) {
          throw new Error('User not found')
        }

        const postValid = db.posts.some((p) => p.id == post && p.published == true)

        if (!postValid) {
          throw new Error('Post is not valid')
        }

        const comment = {
          id: uuidv4(),
          ...data
        }

        db.comments.push(comment)

        return comment
      },
      deleteComment(parent, { id }, { db }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id == id)

        if (commentIndex === -1) {
          throw new Error('Comment not found')
        }

        const [deletedComment] = db.comments.splice(commentIndex, 1)

        return deletedComment
      }
    },
    Post: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => {
                return user.id == parent.author
            })
        },
        comments(parent, args, { db }, info) {
            return db.comments.filter((comment) => {
                return comment.post == parent.id
            })
        }
    },
    User: {
        posts(parent, args, { db }, info) {
            return db.posts.filter((post) => {
                return post.author == parent.id
            })
        },
        comments(parent, args, { db }, info) {
            return db.comments.filter((comment) => {
                return comment.author == parent.id
            })
        }
    },
    Comment: {
        author(parent, args, { db }, info) {
            return db.users.find((user) => {
                return user.id == parent.author
            })
        },
        post(parent, args, { db }, info) {
            return db.posts.find((post) => {
                return post.id == parent.post
            })
        }
    }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db
  }
})

server.start(() => {
    console.log('The server is up!')
})
