import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Header, Icon, Message, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import config from './config';
import {PlaidLink} from "react-plaid-link";

// TODO - Call the /getLinkToken API in the backend to get a link_token instead of hard-coding it here.
// TODO - figure out why onLinkSuccess() does not get the updated 'accounts' value?

const Accounts = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [accounts, setAccounts] = useState(null);
  const [accountsFetchFailed, setAccountsFetchFailed] = useState(false);

  // fetch accounts on page load only if user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      console.log("fetching accounts");
      const accessToken = oktaAuth.getAccessToken();
      fetch(config.splitnot.accountsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            return Promise.reject();
          }
          return response.json();
        })
        .then((data) => {
          setAccounts(data);
          setAccountsFetchFailed(false);
        })
        .catch((err) => {
          setAccountsFetchFailed(true);
          /* eslint-disable no-console */
          console.error(err);
        });
    }
  }, [authState]);

  // Re-render DOM when accounts are updated after adding a new account via PlaidLink
  useEffect(() => {
    console.log("re-rending DOM on accounts change");
  }, [accounts]);

  const onLinkSuccess = (token, metadata) => {
    // send token to server
    console.log("received token=" + token + ", metadata=" + JSON.stringify(metadata));
    const accessToken = oktaAuth.getAccessToken();
    console.log("accountId=" + metadata['accounts'][0].id);
    fetch(config.splitnot.accountsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        publicToken: token,
        accountId: metadata['accounts'][0].id,
        accountName: metadata['accounts'][0].name
      })
    })
        .then((response) => {
          if (!response.ok) {
            return Promise.reject();
          }
          return response.json();
        })
        .then((data) => {
          console.log("add account response=" + JSON.stringify(data));
          console.log("accounts=" + JSON.stringify(accounts));
          let existingAccounts = accounts ? [...accounts] : [];
          console.log("existingAccounts=" + JSON.stringify(existingAccounts));
          existingAccounts.push(data);
          setAccounts(existingAccounts);
        })
        .catch((err) => {
          /* eslint-disable no-console */
          console.error("error adding account" + err);
        });
  };

  const possibleErrors = [
    'You\'ve downloaded one of our resource server examples, and it\'s running on port 8000.',
    'Your resource server example is using the same Okta authorization server (issuer) that you have configured this React application to use.',
  ];

  return (
    <div>
      <Header as="h1">
        <Icon name="mail outline" />
        My Accounts
      </Header>
      {accountsFetchFailed && <Message error header="Failed to fetch accounts.  Please verify the following:" list={possibleErrors} />}
      {!accounts && !accountsFetchFailed && <p>Fetching Accounts..</p>}
      {accounts
      && (
      <div style={{ marginBottom: '2em' }}>
        <Table>
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Account Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr id={account.id} key={account.id}>
                <td>{account.id}</td>
                <td>{account.name}</td>
                <td><a href={'/transactions?accountId=' + account.id}>View Transactions</a></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      )}
      <PlaidLink
          token='link-sandbox-b7799350-0166-40d5-b67e-3ff7d754174e'
          onSuccess={onLinkSuccess} >
        Connect a Bank Account
      </PlaidLink>
    </div>
  );
};

export default Accounts;
