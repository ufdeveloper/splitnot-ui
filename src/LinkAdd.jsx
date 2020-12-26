import React from 'react';
import { PlaidLink } from 'react-plaid-link';

const LinkAdd = props => {
  const onSuccess = (token, metadata) => {
    // send token to server
    console.log("received token=" + token + ", metadata=" + metadata);
  };

  return (
      <PlaidLink
          token='link-sandbox-ec659e4d-a978-4d37-86eb-6ace8f938d7c'
          onSuccess={onSuccess} >
        Connect a bank account
      </PlaidLink>
  );
};
export default LinkAdd;