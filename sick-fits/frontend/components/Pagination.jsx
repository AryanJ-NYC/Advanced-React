import React from 'react';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import { Query } from 'react-apollo';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = ({ page }) => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      const { count } = data.itemsConnection.aggregate;
      const pagesCount = Math.ceil(count / perPage);
      return (
        <PaginationStyles>
          <Head>
            <title>
              Sick Fits! &mdash; Page {page} of {pagesCount}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page - 1 },
            }}
          >
            <a className="prev" aria-disabled={page === 1}>
              👈 prev
            </a>
          </Link>
          <p>
            Page {page} of {pagesCount}
          </p>
          <p>{count} Items Total</p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page + 1 },
            }}
          >
            <a className="prev" aria-disabled={page >= pagesCount}>
              next 👉
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
