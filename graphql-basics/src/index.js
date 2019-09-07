import { GraphQLServer } from 'graphql-yoga'

// location
// bio

// Type definitions (schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`

// Resolvers
const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!'
        },
        name() {
            return "Jacob"
        },
        location() {
            return 'Yokohama'
        },
        bio() {
            return 'I am an American software developer living in Japan!'
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