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

import React from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import { OktaAuth } from '@okta/okta-auth-js';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { Container } from 'semantic-ui-react';
import config from './config';
import Home from './Home';
import CustomLoginComponent from './Login';
import Messages from './Messages';
import Navbar from './Navbar';
import Profile from './Profile';
import LinkAdd from './LinkAdd';
import Accounts from "./Accounts";
import Transactions from "./Transactions";
import PrivacyPolicy from "./StaticContent/PrivacyPolicy";
import TermsOfService from "./StaticContent/TermsOfService";
import UserDataDeletionPolicy from "./StaticContent/UserDataDeletionPolicy";
import RecentTransactions from "./RecentTransactions";
import TransactionsPoller from "./TransactionsPoller";
import SimulateNewTransactions from "./SimulateNewTransactions";

const oktaAuth = new OktaAuth(config.oidc);

const App = () => {
  const history = useHistory(); // example from react-router

  const customAuthHandler = () => {
    // Redirect to the /login page that has a CustomLoginComponent
    history.push('/login');
  };

  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
    >
      <Navbar />
      <Container text style={{ marginTop: '7em' }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login/callback" component={LoginCallback} />
          <Route path="/login" component={CustomLoginComponent} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/tos" component={TermsOfService} />
          <Route path="/datadeletion" component={UserDataDeletionPolicy} />
          <SecureRoute path="/accounts" component={Accounts} />
          <SecureRoute path="/linkAdd" component={LinkAdd} />
          <SecureRoute path="/messages" component={Messages} />
          <SecureRoute path="/profile" component={Profile} />
          <SecureRoute path="/transactions" component={Transactions} />
          <SecureRoute path="/newtransactions" component={RecentTransactions} />
          <SecureRoute path="/simulatenewtransactions" component={SimulateNewTransactions} />
        </Switch>
      </Container>
    </Security>
  );
};

export default App;
