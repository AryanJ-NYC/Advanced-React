import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import SickButton from './styles/SickButton';
import Table from './styles/Table';

const permissions = ['ADMIN', 'USER', 'ITEMCREATE', 'ITEMUPDATE', 'ITEMDELETE', 'PERMISSIONUPDATE'];

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

export default function Permissions() {
  return (
    <Query query={ALL_USERS_QUERY}>
      {({ data, loading, error }) =>
        console.log(data) || (
          <div>
            <Error error={error} />
            <div>
              <h2>Manage Permissions</h2>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {permissions.map(permission => (
                      <th>{permission}</th>
                    ))}
                    <th>👇</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(user => (
                    <User user={user} />
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )
      }
    </Query>
  );
}

class User extends Component {
  render() {
    const { user } = this.props;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {permissions.map(permission => (
          <td>
            <label>
              <input name={`${user.id}-permission-${permission}`} type="checkbox" />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}
