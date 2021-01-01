import React from 'react';
import { Header } from 'semantic-ui-react';

const About = () => {

  return (
    <div>
      <div>
        <Header as="h1">About Splitnot</Header>

          <div>
              <p>Splitnot is a demo project to showcase a fully functional and secure web application using a host of technologies.

              </p>

              <h3>Plaid</h3>
              <p>
                  The main component of the application is <a href="https://plaid.com/">Plaid</a>. Plaid is a service which lets you interact with your bank, and is used to get new transaction alerts for your bank account you configure in Splitnot.
                  <br />
                  <br />
                  <a name="sandbox-creds"><b>NOTE</b> - For the demo, Plaid works in the sandbox mode. Use the credentials <i>username : user_good, password : pass_good</i> to link a demo bank account.</a>
              </p>

              <h3>Okta</h3>
              <p>The app uses Okta for authentication. It uses the Okta Sign-in widget and Okta React library. I followed the <a href="https://developer.okta.com/code/react/okta_react_sign-in_widget/">Okta developer guide</a> for scaffolding the app.</p>


              <h3>Spring Security OAuth</h3>
              <p>The splitnot API is a resource server and uses Spring Security Oauth2. It uses Okta as the authorization server for validating tokens sent by the UI.</p>


              <h3>AWS</h3>
              <p>The app is deployed on an AWS EC2 t2.micro RHEL instance. Traffic is routed via Route53 to an ALB. Https is terminated at the ALB and http traffic is forwarded to the EC2 node from the ALB.</p>

              <h4>Checkout the github repo for the <a href="https://github.com/ufdeveloper/splitnot-ui">UI</a> and the <a href="https://github.com/ufdeveloper/splitnot-api">API</a>.</h4>
          </div>

      </div>
    </div>
  );
};
export default About;
