const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        hello: String,
        nodejs: Int
    }
`);

const root = {
  hello: () => 'hello',
  npdejs: () => 20,
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true, // GUI를 제공, 개발할때만 사용
  })
);

app.listen(4000, () => {
  console.log('running server port 4000.');
});
