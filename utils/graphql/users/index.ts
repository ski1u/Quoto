import { gql } from "apollo-server-micro";
import { createClient } from "@/utils/supabase/server";

export const userTypeDefs = gql`
    type Query {
        users: [User!]!
    }

    type User {
        uid: ID!
        email: String!
        name: String
        createdAt: DateTime!
    }
`

export const userResolvers = {
    Query: {
        users: async () => {
            const supabase = await createClient();
            const { data, error } = await supabase.from("users").select("*");
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    }
}