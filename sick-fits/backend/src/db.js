// this file connects to remote prisma DB and gives us ability to query it with JS
const { Prisma } = require('prisma-binding');

const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRIMSA_SECRET,
  debug: false,
});

module.exports = db;