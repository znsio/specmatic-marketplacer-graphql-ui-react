const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the schema from a file
const schemaFilePath = path.join(__dirname, 'marketplacer.graphqls');
const schemaFileContent = fs.readFileSync(schemaFilePath, 'utf8');
const schema = buildSchema(schemaFileContent);

// Function to forward requests to the actual GraphQL server
const root = async (args, context, info) => {
  try {
    console.log('Forwarding request to actual GraphQL server...');
    console.log('Query:', context.body.query);
    console.log('Variables:', context.body.variables);

    const response = await axios.post('http://localhost:8080/graphql', {
      query: context.body.query,
      variables: context.body.variables,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Received response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error from GraphQL server:', error.response?.data || error.message);
    throw new Error(`Error from GraphQL server: ${error.message}`);
  }
};

const app = express();
app.use(express.json());
app.use('/graphql', graphqlHTTP((req, res) => ({
  schema: schema,
  rootValue: root,
  graphiql: true,
  context: { body: req.body },
})));

app.listen(4000, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});