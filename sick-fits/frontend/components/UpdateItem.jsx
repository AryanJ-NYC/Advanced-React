import gql from 'graphql-tag';
import Router from 'next/router';
import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Form from './styles/Form';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

export default class UpdateItem extends Component {
  state = {};

  handleChange = event => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    await updateItemMutation({
      variables: { id: this.props.id, ...this.state },
    });
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No data found</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <Error error={error} />
                  <fieldset aria-busy={loading} disabled={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        onChange={this.handleChange}
                        defaultValue={data.item.title}
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        onChange={this.handleChange}
                        defaultValue={data.item.price}
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        onChange={this.handleChange}
                        defaultValue={data.item.description}
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Description"
                        required
                      />
                    </label>
                    <button type="submit">Save Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
