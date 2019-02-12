import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

export default function Signout() {
  return (
    <Mutation
      mutation={SIGNOUT_MUTATION}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {signout => <button onClick={signout}>Sign out</button>}
    </Mutation>
  );
}
