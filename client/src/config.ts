// DONE: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'be8jel74wc'
const region = 'ap-southeast-1'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`
// export const apiEndpoint = `http://localhost:3003`

export const authConfig = {
  // DONE: Create an Auth0 application and copy values from it into this map
  domain: 'dev-qb-jumms.auth0.com',            // Auth0 domain
  clientId: 'ZiwKT4u9vJleFT5tyqaa4zvLcBs9iN11',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
