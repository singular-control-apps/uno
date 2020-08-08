/**
 * REQUIRED FOR LOCAL DEVELOPMENT
 *
 * Purpose: Creates and registers a local instance of the Singular App SDK
 *
 * NOTE: Do NOT include this file when deploying into Singular.live Platform
 *       Do NOT upload this file with your private user information to any public repository!!!
 */

if (!parent || (parent && !parent.runningOnSingularServer)) {
  // Create Singular app with the virtual app key found in App Manager
  SingularApp.createWithAppInstanceKey(
    'Virtual App Key Here',             // virtual app key (found in App Manager)
    'https://app.singular.live/',       // host default value
    singularAppInit,                    // callback function found in app.js
    'Your Email Here',                  // your email
    'Your Password Here'                // your password
  );
} else {
  alert('ERROR: Could not connect to Singular server.');
}