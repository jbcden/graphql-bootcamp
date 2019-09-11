import { GraphQLServer } from 'graphql-yoga'

// Demo user data
const users = [{
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
const posts = [{
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
const comments = [{
    id: '1',
    text: 'This is a nice comment!',
    author: '1'
},
{
    id: '2',
    text: 'This sucks!',
    author: '2'
},
{
    id: '3',
    text: "Can't we all be friends?!?",
    author: '3'
},
{
    id: '4',
    text: 'I just want to sleep',
    author: '3'
}]

// Type definitions (schema)
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        me: User!
        post: Post!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
    }
`

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
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id == parent.author
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
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})