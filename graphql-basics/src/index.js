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

// Type definitions (schema)
const typeDefs = `
    type Query {
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        me: User!
        post: Post!
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