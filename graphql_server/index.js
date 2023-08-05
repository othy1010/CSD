import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { sequelize } from './db.js';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { sequelize },
});


sequelize.sync().then(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});