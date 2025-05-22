import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import { typeDefs } from './schema/type';
import { resolvers } from './schema/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error(error);
    return error;
  }
});

const handler = startServerAndCreateNextHandler(server);

export const GET = handler;
export const POST = handler;