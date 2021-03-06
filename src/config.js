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
    // apiBaseUrl: 'http://localhost:8080',
    // accountsUrl: 'http://localhost:8080/accounts',
    // transactionsUrl: 'http://localhost:8080/transactions',
    // newTransactionsUrl: 'http://localhost:8080/transactions/new',
    // transactionsPollUrl: 'http://localhost:8080/transactions/poll',
    // accessTokenUrl: 'http://localhost:8080/accessToken',
    // linkTokenUrl: 'http://localhost:8080/getLinkToken',
    // fireSandboxWebhookUrl: 'http://localhost:8080/fireWebhook',

    // EC2 public DNS
    // apiBaseUrl: 'http://ec2-54-164-66-75.compute-1.amazonaws.com:8080',
    // accountsUrl: 'http://ec2-54-164-66-75.compute-1.amazonaws.com:8080/accounts',
    // transactionsUrl: 'http://ec2-54-164-66-75.compute-1.amazonaws.com:8080/transactions',
    // accessTokenUrl: 'http://ec2-54-164-66-75.compute-1.amazonaws.com:8080/accessToken',
    // linkTokenUrl: 'http://ec2-54-164-66-75.compute-1.amazonaws.com:8080/getLinkToken'

    // prod
    apiBaseUrl: 'https://api.splitnot.com',
    accountsUrl: 'https://api.splitnot.com/accounts',
    transactionsUrl: 'https://api.splitnot.com/transactions',
    newTransactionsUrl: 'https://api.splitnot.com/transactions/new',
    transactionsPollUrl: 'https://api.splitnot.com/transactions/poll',
    accessTokenUrl: 'https://api.splitnot.com/accessToken',
    linkTokenUrl: 'https://api.splitnot.com/getLinkToken',
    fireSandboxWebhookUrl: 'https://api.splitnot.com/fireWebhook',
  },
  googleTracking: {
    trackingKey: 'G-XLLP65LMRJ'
  }
};
