import React, {useRef, useState, useEffect} from 'react';
import Responsive from "semantic-ui-react/dist/commonjs/addons/Responsive";
import NavBarChildren from "./NavBarChildren";
import {Link, useHistory} from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";
import config from "./config";
import {Icon, Image, Menu, Popup, Sidebar} from "semantic-ui-react";

const Navbar = (props) => {
  const [visible, setVisible] = useState(false);

  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [newNotifications, setNewNotifications] = useState(0);

  const login = async () => history.push('/login');
  const logout = async () => oktaAuth.signOut();

  const onNotificationsClicked = () => {
    setNewNotifications(0);
  }

  const handlePusher = () => {
      console.log("leftItems=" + JSON.stringify(props.leftItems));
    if (visible) setVisible(false);
  };

  const handleToggle = () => {
      console.log("visibleBefore=" + visible + ", leftItems=" + props.leftItems);
      if (visible === true) {
          console.log("setting visible to false");
          setVisible(false);
      } else {
          console.log("setting visible to true");
          setVisible(true);
      }
      console.log("visibleAfter=" + visible + ", leftItems=" + props.leftItems);
  }

  // Polling logic as found here - https://overreacted.io/making-setinterval-declarative-with-react-hooks/
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
          <Responsive {...Responsive.onlyMobile}>
              <Sidebar.Pushable>
                  <Sidebar
                      as={Menu}
                      animation="overlay"
                      icon="labeled"
                      inverted
                      vertical
                      visible={visible}
                  >
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
                      {
                          <Menu.Item id={"about"}>
                              <Icon name="info circle" />
                              <Link to="/about">About</Link>
                          </Menu.Item>
                      }
                  </Sidebar>
                  <Sidebar.Pusher
                      dimmed={visible}
                      onClick={handlePusher}
                      style={{ minHeight: "100vh" }}
                  >
                      <Menu fixed="top" inverted>
                          <Menu.Item>
                              <Image size="mini" src="/logo_white.png" />
                              &nbsp;&nbsp;&nbsp;
                              <Link to="/">SPLITNOT</Link>
                          </Menu.Item>
                          <Menu.Item onClick={handleToggle}>
                              <Icon name="sidebar" />
                          </Menu.Item>
                          <Menu.Menu position="right">
                              {authState.isAuthenticated && (
                                  <Popup
                                      trigger={
                                          <Menu.Item id="notifications-button" as={Link} to="/newtransactions"
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
                          </Menu.Menu>
                      </Menu>
                      <NavBarChildren>{props.children}</NavBarChildren>
                  </Sidebar.Pusher>
              </Sidebar.Pushable>
          </Responsive>
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
              <Menu fixed="top" inverted>
                  <Menu.Item>
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
                  {
                      <Menu.Item id={"about"}>
                          <Icon name="info circle" />
                          <Link to="/about">About</Link>
                      </Menu.Item>
                  }
                  <Menu.Menu position="right">
                      {authState.isAuthenticated && (
                          <Popup
                              trigger={
                                  <Menu.Item id="notifications-button" as={Link} to="/newtransactions"
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
                  </Menu.Menu>
              </Menu>
            <NavBarChildren>{props.children}</NavBarChildren>
          </Responsive>
        </div>
    );
}

export default Navbar;