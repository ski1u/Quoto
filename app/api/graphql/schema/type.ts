import { gql } from "graphql-tag";

export const typeDefs = gql`
    # Queries
    type Query {
        user: User # User Authentication
        quotos: [Quoto]!
    }

    # Types
    type User {
        id: ID!
        email: String!
        created_at: String!
    }
    type Quoto {
        id: ID!
        user_id: String!
        author: String!
        isUser: Boolean!
        quoto: String!
        likes: Int!
        tags: [String]!
        created_at: String!
    }

    type Mutation {
        createQuoto(quoto: String!, tags: [String]!): Quoto
        updateQuoto(quoto: String!, tags: [String]!): Quoto
        deleteQuoto(): Quoto
    }
`