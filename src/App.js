import React, { Component } from 'react';
import { withApollo, graphql } from 'react-apollo';
import { compose, withHandlers } from 'recompose';
import gql from 'graphql-tag';
import getLoggedIn, { setLoggedIn } from './loggedIn';

class App extends Component {
  render() {
    const {
      data: { loading, error, people },
      onSwitch,
    } = this.props;
    console.log(this.props);
    return (
      <main>
        {loading ? (
          <p>Loading…</p>
        ) : error ? (
          <p>Error</p>
        ) : (
          <ul>{people.map(person => <li key={person.id}>{person.name}</li>)}</ul>
        )}
        <button onClick={onSwitch}>switch logged-in-ness</button>
      </main>
    );
  }
}

const withQuery = graphql(
  gql`
    query ErrorTemplate {
      people {
        id
        name
      }
    }
  `,
  {
    options: {
      pollInterval: 3000,
      errorPolicy: 'all',
    },
  }
);

const withSwitch = compose(
  withApollo,
  withHandlers({
    onSwitch: ({ client }) => async () => {
      console.log('setting logged in to ', !getLoggedIn());
      setLoggedIn(!getLoggedIn());
      try {
        await client.resetStore();
      } catch (err) {
        console.log('caught error');
        console.log(err);
      }
    },
  })
);

export default compose(withQuery, withSwitch)(App);
