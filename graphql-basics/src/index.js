import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schema)
const typeDefs = `
    type Query {
        add(a: Float!, b: Float!): Float!
        greeting(name: String, position: String): String!
        me: User!
        post: Post!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
`

// Resolvers
const resolvers = {
    Query: {
        add(_parent, { a, b }, _ctx, _info) {
            if (a && b) {
                return a + b
            } else {
                0.0
            }
        },
        greeting(parent, args, ctx, info) {
            if (args.name && args.position) {
                return `Hello, ${args.name}! You are my favorite ${args.position}.`
            } else {
                return 'Hello!'
            }
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
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})