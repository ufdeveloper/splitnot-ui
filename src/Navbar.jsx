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
import React, {useRef, useEffect, useState} from 'react';
import { useHistory, Link } from 'react-router-dom';
import {Container, Icon, Image, Menu, Popup} from 'semantic-ui-react';
import config from "./config";

const Navbar = () => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [newNotifications, setNewNotifications] = useState(0);

  const login = async () => history.push('/login');
  const logout = async () => oktaAuth.signOut();

  const onNotificationsClicked = () => {
    setNewNotifications(0);
  }

  function TransactionsPoller () {

    useInterval(() => {

      if (authState.isAuthenticated) {
        const accessToken = oktaAuth.getAccessToken();

        // poll for new notifications
        fetch(config.splitnot.transactionsPollUrl, {
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
              console.log("poll response = " + JSON.stringify(data));
              console.log("poll response no json = " + data);
              if (data > 0) {
                console.log("setting new notifications");
                setNewNotifications(data);
              } else {
                setNewNotifications(0);
              }
              // alert("you have new transactions");
            })
            .catch((err) => {

              /* eslint-disable no-console */
              console.error("failed to poll for new transactions, error=" + err);
            });
      }
    }, 10000); // TODO - increase interval to 30 mins or 1 hour

    function useInterval(callback, delay) {
      const savedCallBack = useRef();
      useEffect(() => {
        savedCallBack.current = callback;
      }, [callback]);

      useEffect(() => {
        function tick() {
          savedCallBack.current();
        }
        if (delay !== null) {
          const id = setInterval(tick, delay);
          return () => {
            clearInterval(id);
          }
        }
      }, [callback, delay]);
    }
  };

  // trigger polling
  {TransactionsPoller()}

  return (
    <div>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>
            <Image size="mini" src="/logo_white.png" />
            &nbsp;&nbsp;&nbsp;
            <Link to="/">SPLITNOT</Link>
          </Menu.Item>
          {authState.isAuthenticated && (
              <Menu.Item id="accounts-button">
                <Icon name="building outline" />
                <Link to="/accounts">Accounts</Link>
              </Menu.Item>
          )}
          {authState.isAuthenticated && (
          <Menu.Item id="simulate-new-transactions">
            <Icon name="credit card" />
            <Link to="/simulatenewtransactions">Simulate new transactions</Link>
          </Menu.Item>
          )}
          {authState.isAuthenticated && (
            <Menu.Item id="profile-button">
              <Icon name="drivers license" />
              <Link to="/profile">Profile</Link>
            </Menu.Item>
          )}
          {!authState.isPending && !authState.isAuthenticated && <Menu.Item onClick={login}>Login</Menu.Item>}
          {authState.isAuthenticated && (
              <Popup
                trigger={
                  <Menu.Item id="notifications-button" position="right" as={Link} to="/newtransactions"
                             style={{marginTop: '5px'}} onClick={onNotificationsClicked}>
                    {(newNotifications < 1) && (<Icon name="bell large"/>)}
                    {(newNotifications > 0) && (<Icon name="bell large" color="red"/>)}
                    {(newNotifications > 0) &&
                    (<span style={{
                      zIndex: '100',
                      borderRadius: '25px',
                      background: '#14141f',
                      marginTop: '10px',
                      marginLeft: '-15px',
                      padding: '1px'
                    }}>{newNotifications}</span>)
                    }
                  </Menu.Item>
                }>You have {newNotifications > 0 ? newNotifications : 'no'} new transactions</Popup>
          )}
          {authState.isAuthenticated &&
            <Popup
                trigger={<Menu.Item id="logout-button" onClick={logout} style={{marginTop:'5px'}}><Icon name="sign-out large" /></Menu.Item>}
                position="bottom center"
            >Logout
            </Popup>
          }
        </Container>
      </Menu>
    </div>
  );
};
export default Navbar;
