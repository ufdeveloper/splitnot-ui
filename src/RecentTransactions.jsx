import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Header, Icon, Message, Table } from 'semantic-ui-react';
import config from './config';

const RecentTransactions = () => {
    const { authState, oktaAuth } = useOktaAuth();
    const [transactions, setTransactions] = useState(null);
    const [transactionsFetchFailed, setTransactionsFetchFailed] = useState(false);

    // fetch messages
    useEffect(() => {
        if (authState.isAuthenticated) {
            const accessToken = oktaAuth.getAccessToken();

            fetch(config.splitnot.newTransactionsUrl, {
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
                    console.error("error fetching new transactions" + err);
                });
        }
    }, [authState]);

    return (
        <div>
            <Header as="h1">
                <Icon name="credit card outline" />
                Recent Transactions
            </Header>
            {transactionsFetchFailed && <Message error header="Failed to fetch new transactions." />}
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
                            <th>Account</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((transaction) => (
                            <tr id={transaction.id} key={transaction.id}>
                                <td>{transaction.name}</td>
                                <td>${transaction.amount}</td>
                                <td>{transaction.date}</td>
                                <td>{transaction.accountName}</td>
                                <td><a href={'/addtosplitwise'}>Add to Splitwise</a></td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default RecentTransactions;
