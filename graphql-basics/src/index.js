import { GraphQLServer } from 'graphql-yoga'

// GraphQL's 5 Scalar types:
//  String
//  Boolean
//  Int
//  Float
//  ID

// Type definitions (schema)
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        title() {
            return 'Sakaba'
        },
        price() {
            return 100.20
        },
        releaseYear() {
            return 2020
        },
        rating() {
            return null
        },
        inStock() {
            return false
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