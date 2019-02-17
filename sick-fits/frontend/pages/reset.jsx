import React from 'react';
import ResetComponent from '../components/Reset';

export default function Reset({ query }) {
  return <ResetComponent resetToken={query.resetToken} />;
}
