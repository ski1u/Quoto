import { gql } from "graphql-tag";
import { createClient } from "@/utils/supabase/server";

export const userTypeDefs = gql`
    # Queries
    type Query {
        users: [User!]!
    }

    # Types
    type User {
        uid: ID!
        email: String!
        name: String
        createdAt: DateTime!
    }

    # Mutations
    type Mutation {
        
    }
`

export const userResolvers = {
    Query: {

    },

    Mutation: {

    }
}