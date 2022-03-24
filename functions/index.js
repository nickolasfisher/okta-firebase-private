const functions = require("firebase-functions");

const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./okta-firebase-7fe75-firebase-adminsdk-330wb-19ec40a6da.json");

const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const OktaJwtVerifier = require("@okta/jwt-verifier");

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-332742.okta.com/oauth2/default'
});

exports.exchangeOktaTokenForFirebaseToken = functions.https.onCall(
  async (data, context) => {
    console.log(process.env)
    const accessToken = data.accessToken;
    const jwt = await oktaJwtVerifier.verifyAccessToken(
      accessToken,
      "api://default"
    );

    const oktaUid = jwt.claims.uid;
    const firebaseToken = await firebaseApp.auth().createCustomToken(oktaUid);

    return { firebaseToken };
  }
);

exports.drawImage = functions.https.onCall((data, context) => {
  console.log(OKTA_ISSUER);

  if (!context.auth)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );

  return {
    image: "hello",
  };
});
