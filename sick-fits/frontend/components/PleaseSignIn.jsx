import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

export default function PleaseSignIn({ children }) {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (!data.me) {
          return (
            <div>
              <p>Please Sign In to Continue</p>
              <Signin />
            </div>
          );
        }
        return children;
      }}
    </Query>
  );
}
