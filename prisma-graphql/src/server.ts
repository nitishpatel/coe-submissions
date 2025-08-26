import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { buildContext } from './context';

async function start() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => buildContext(),
  });

  console.log(`🚀 GraphQL ready at ${url}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
