# Install

Here is how you can set up the project on your local machine. You will need :
* A Firebase account to host the users
* A Mysql database inside Docker
* And you are done

## Setting up the required elements

### Firebase account
You can create one from https://console.firebase.google.com

Activate the "Authentication" service, then the "Email/password provider".
Then generate the firebase public keys for the SDK

* Copy [environment.tpl.ts](./apps/front/src/environments/environment.tpl.ts) file to environment.ts
* Paste your key there


