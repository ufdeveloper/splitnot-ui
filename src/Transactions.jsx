import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Header, Icon, Message, Table } from 'semantic-ui-react';
import { useLocation } from "react-router-dom";
import config from './config';
import qs from 'qs';

const Accounts = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [transactions, setTransactions] = useState(null);
  const [transactionsFetchFailed, setTransactionsFetchFailed] = useState(false);
  const location = useLocation();

  // fetch messages
  useEffect(() => {
    if (authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();

      let parsedAccountId = qs.parse(location.search, { ignoreQueryPrefix: true }).accountId;
      console.log("accountId=" + parsedAccountId);

      fetch(config.splitnot.transactionsUrl + '?accountId=' + parsedAccountId, {
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
          setTransactions(data);
          setTransactionsFetchFailed(false);
        })
        .catch((err) => {
          setTransactionsFetchFailed(true);
          /* eslint-disable no-console */
          console.error(err);
        });
    }
  }, [authState]);

  return (
    <div>
      <Header as="h1">
        <Icon name="credit card outline" />
        Transactions
      </Header>
      {transactionsFetchFailed && <Message error header="Failed to fetch transactions." />}
      {!transactions && !transactionsFetchFailed && <p>Fetching Transactions..</p>}
      {transactions
      && (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr id={transaction.id} key={transaction.id}>
                <td>{transaction.name}</td>
                <td>${transaction.amount}</td>
                <td>{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      )}
    </div>
  );
};

export default Accounts;
