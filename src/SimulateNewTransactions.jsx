/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Header, Icon, Message, Table } from 'semantic-ui-react';

import config from './config';
import {Link} from "react-router-dom";

const SimulateNewTransactions = () => {
    const { authState, oktaAuth } = useOktaAuth();
    const [accounts, setAccounts] = useState(null);
    const [accountsFetchFailed, setAccountsFetchFailed] = useState(false);

    useEffect(() => {
        if (authState.isAuthenticated) {
            const accessToken = oktaAuth.getAccessToken();

            console.log("fetching accounts");
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
                    console.error("failed to fetch configured accounts, error=" + err);
                });
        }
    }, [authState]);

    // fire sandbox webhook
    const simulateNewTransactions = (accountId) => {
        console.log("simulating new transactions for accountId=" + accountId);
        const accessToken = oktaAuth.getAccessToken();
        fetch(config.splitnot.fireSandboxWebhookUrl + '?accountId=' + accountId, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
            .then((response) => {
                if (!response.ok) {
                    return Promise.reject();
                }
                console.log("successfully simulate new transactions for accountId=" + accountId);
            })
            .catch((err) => {
                /* eslint-disable no-console */
                console.error("error simulating new transactions for accountId" + accountId + ", error=" + err);
            });
    };

  return (
    <div>
      <Header as="h1">
        <Icon name="credit card outline" />
        Simulate New Transactions
      </Header>
      <p>This application used Plaid in sandbox mode, and Plaid does not push new transactions to an item in the sandbox mode.</p>
      <p>In order to get notified when new transactions are posted to your account, you can simulate new transactions being added to your account.</p>
        <p>Just click the <b>Simulate New Transactions</b> button against the account you want to add new transactions to and notice the notifications icon in the top right corner.</p>

        {accountsFetchFailed && <Message error header="Failed to fetch accounts." />}
        {!accounts && !accountsFetchFailed && <p>Fetching Accounts..</p>}
        {accounts
        && (
            <div style={{marginTop:'3em', marginBottom: '2em'}}>
                <Table>
                    <thead>
                    <tr>
                        {/*<th>Account ID</th>*/}
                        <th>Account Name</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {accounts.map((account) => (
                        <tr id={account.id} key={account.id}>
                            <td>{account.name}</td>
                            <td><button onClick={() => simulateNewTransactions(account.id)} style={{borderRadius:'10px'}}>Simulate New Transactions</button></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        )
        }
    </div>
  );
};

export default SimulateNewTransactions;
