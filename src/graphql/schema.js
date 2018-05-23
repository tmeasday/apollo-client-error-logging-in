import { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } from 'graphql';

import getLoggedIn from '../loggedIn';

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

const peopleData = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sara Smith' },
  { id: 3, name: 'Budd Deey' },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => {
        if (getLoggedIn()) {
          return peopleData;
        }
        throw new Error('not logged in');
      },
    },
  },
});

export const schema = new GraphQLSchema({ query: QueryType });
