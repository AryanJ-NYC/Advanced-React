import gql from 'graphql-tag';
import Router from 'next/router';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

export default class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  };

  handleChange = event => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async event => {
              event.preventDefault();
              const response = await createItem(this.state);
              Router.push({
                pathname: '/item',
                query: { id: response.data.createItem.id },
              });
            }}
          >
            <Error error={error} />
            <fieldset aria-busy={loading} disabled={loading}>
              <label htmlFor="title">
                Title
                <input
                  onChange={this.handleChange}
                  value={this.state.title}
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
                  value={this.state.price}
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
                  value={this.state.description}
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Description"
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}
