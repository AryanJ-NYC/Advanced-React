import React, { Component } from 'react';
import gql from 'graphql-tag';
import Head from 'next/head';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Error from './ErrorMessage';

const SingleItemStyles = styled.div`
  min-height: 800px;
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;

  img {
    height: 100%;
    object-fit: contain;
    width: 100%;
  }

  .details {
    font-size: 2rem;
    margin: 3rem;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

export default class SingleItem extends Component {
  render() {
    const { id } = this.props;
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ error, loading, data: { item } }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!item) return <p>No Item Found for {id}</p>;
          return (
            <SingleItemStyles>
              <Head>
                <title>Sick Fits | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          );
        }}
      </Query>
    );
  }
}
