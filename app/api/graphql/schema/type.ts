import { gql } from "graphql-tag";

export const typeDefs = gql`
    # Queries
    type Query {
        users: [User!]!
    }

    # Types
    type User {
        uid: ID!
        email: String!
        name: String
        createdAt: String!
    }

    # Mutations
    # type Mutation {}
`