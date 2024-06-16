const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// Define your schema and resolvers
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { hello: () => 'Hello world!' };

// Serve GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: false, // Disable built-in GraphiQL
}));

// Serve GraphiQL interface
app.get('/graphiql', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>GraphiQL</title>
      <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
    </head>
    <body style="margin: 0;">
      <div id="graphiql" style="height: 100vh;"></div>
      <script
        crossorigin
        src="https://unpkg.com/react/umd/react.production.min.js"
      ></script>
      <script
        crossorigin
        src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
      ></script>
      <script
        crossorigin
        src="https://unpkg.com/graphiql/graphiql.min.js"
      ></script>
      <script>
        const graphQLFetcher = graphQLParams =>
          fetch('http://localhost:8080/graphql', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(graphQLParams),
          })
          .then(response => response.json())
          .catch(() => response.text());

        ReactDOM.render(
          React.createElement(GraphiQL, { fetcher: graphQLFetcher }),
          document.getElementById('graphiql'),
        );
      </script>
    </body>
    </html>
  `);
});

app.listen(4000, () => console.log('Now browse to http://localhost:4000/graphiql'));