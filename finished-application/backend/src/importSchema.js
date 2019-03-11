const { importSchema } = require('graphql-import');
const fs = require('fs');

const text = importSchema(`${__dirname}/schema.graphql`);
fs.writeFileSync(`${__dirname}/schema_prep.graphql`, text);
