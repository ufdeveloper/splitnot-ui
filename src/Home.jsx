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
import { useHistory } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';

const Home = () => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  //TODO - add credit for backgroud image - https://www.pexels.com/photo/old-boat-on-grassy-field-in-overcast-4775481/
  useEffect(() => {
    document.body.style = "background-image: url('back19.jpg'); background-repeat: no-repeat;\n" +
        "  // background-attachment: fixed;\n" +
        "  // background-size: cover;";
    if (!authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }

    return function cleanup() {
      document.body.style = "background-image: linear-gradient(to bottom right, #edeff2, white); background-repeat: no-repeat; background-attachment: fixed; background-size: cover;";
    };
  }, [authState, oktaAuth]); // Update if authState changes

  const login = async () => {
    history.push('/login');
  };

  if (authState.isPending) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      <div>
        <Header as="h1">Splitnot - Makes splitting bills easier</Header>

        { authState.isAuthenticated && !userInfo
        && <div>Loading user information...</div>}

        {authState.isAuthenticated && userInfo
        && (
        <div>
          <p>
            Welcome back,&nbsp;
            {userInfo.name}
            !
          </p>
          <p>
            Now that you have logged in successfully, visit the
            {' '}
            <a href="/accounts">Accounts</a>
            {' '}
            page to view your configured bank accounts or add a new account.
          </p>
          <p>
            Once you have configured a bank account, you can simulate new transactions by visiting the
            {' '}
            <a href="/simulatenewtransactions">Simulate New Transactions</a>
            {' '}
            page. The app simulates new transactions on the demo account you added.
            Notice the notifications logo on the top right corner changes when the app realizes new transactions are available on your account.
            Click on the notifications icon to view the new transactions.
          </p>
        </div>
        )}

        {!authState.isAuthenticated
        && (
        <div>
          <p>Forgot to add your bills to Splitwise after a trip? Too lazy to dig through your bank transactions to add the right bills?</p>
          <p><b>SPLITNOT makes all this easy for you!</b></p>
          <p>Splitnot notifies you when new transactions are posted to your configured bank accounts. You can turn on notifications before setting out on your trip, or get notified only on transactions on certain categories or amounts.</p>
          <p><i>This is a prototype and uses a demo bank account</i> (<a href="/about#sandbox-creds">instructions on using demo account).</a> Click Login below to get started.</p>
          <Button id="login-button" primary onClick={login}>Login</Button>
        </div>
        )}

      </div>
    </div>
  );
};
export default Home;
