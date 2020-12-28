const CLIENT_ID = process.env.CLIENT_ID || '{clientId}';
const ISSUER = process.env.ISSUER || 'https://{yourOktaDomain}.com/oauth2/default';
const OKTA_TESTING_DISABLEHTTPSCHECK = process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;
const REDIRECT_URI = `${window.location.origin}/login/callback`;

export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
    idps: [
      { type: 'FACEBOOK', id: '0oajc3cxuyawcWgNZ4x6' }
    ],
    idpDisplay: 'PRIMARY'
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
  splitnot: {
    apiBaseUrl: 'http://localhost:8080',
    accountsUrl: 'http://localhost:8080/accounts',
    transactionsUrl: 'http://localhost:8080/transactions',
    accessTokenUrl: 'http://localhost:8080/accessToken',
    linkTokenUrl: 'http://localhost:8080/getLinkToken'
    // apiBaseUrl: 'http://ec2-54-164-66-75.compute-1.amazonaws.com:8080',
    // accountsUrl: 'http://ec2-54-164-66-75.compute-1.amazonaws.com:8080/accounts',
    // transactionsUrl: 'http://ec2-54-164-66-75.compute-1.amazonaws.com:8080/transactions',
    // accessTokenUrl: 'http://ec2-54-164-66-75.compute-1.amazonaws.com:8080/accessToken',
    // linkTokenUrl: 'http://ec2-54-164-66-75.compute-1.amazonaws.com:8080/getLinkToken'
  }
};
