const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    input ProductInput {
        name: String
        price: Int
        description: String
    }
    type Product {
        id: ID!
        name: String
        price: Int
        description: String
    }
    type Query {
        getProduct(id: ID!): Product
    }
    type Mutation {
        addProduct(input: ProductInput): Product
        updateProduct(id: ID!, input: ProductInput!): Product
        deleteProduct(id: ID!): String
    }
`);

const products = [
  {
    id: 1,
    name: '첫번째 제품',
    price: 2000,
    description: '하하하',
  },
  {
    id: 2,
    name: '두번째 제품',
    price: 4000,
    description: '후호호',
  },
];

const root = {
  getProduct: ({ id }) =>
    products.find((product) => product.id === parseInt(id)),
  addProduct: ({ input }) => {
    input.id = parseInt(products.length + 1);
    products.push(input);
    return root.getProduct({ id: input.id });
  },
  updateProduct: ({ id, input }) => {
    const idx = products.findIndex((product) => product.id === parseInt(id));
    products[idx] = {
      id: parseInt(id),
      ...input,
    };

    return products[idx];
  },
  deleteProduct: ({ id }) => {
    const idx = products.findIndex((product) => product.id === parseInt(id));
    products.splice(idx, 1);
    return 'remove sucess';
  },
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

app.use('/static', express.static('static'));

app.listen(4000, () => {
  console.log('running server port 4000.');
});
