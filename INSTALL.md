# Install

Here is how you can set up the project on your local machine. You will need :
* A Firebase account to host the users
* A Mysql database inside Docker
* And you are done

## Setting up code

This repository uses `pnpm` as a package manager and nx as monorepo. If you don't have it installed :
`npm i -g pnpm`

Once you have it installed, just run : 
`pnpm i`

Copy-paste [.env.template](./.env.template) file to `.env`

## Setting up Mysql database

### Create the docker container
You will need `docker-compose` for this

`docker-compose up -d`

If later you want to stop it and clean everything :
`docker-compose down -v`

### Populate the database
Fill in the `.env` file with database information.

By default in local :
```env
OWL_DATABASE_TYPE=mysql
OWL_DATABASE_HOST=localhost
OWL_DATABASE_PORT=3306
OWL_DATABASE_USER=root
OWL_DATABASE_PASSWORD=password
OWL_DATABASE_NAME=owlwritey_app
```

Then run : 

`pnpm typeorm:migration:show`

This should display a list of migrations to be run by the database. If this is good :

`pnpm typeorm:migration:run`

## Setting up firebase
### Firebase account - front setup
You can create one from https://console.firebase.google.com

Activate the "Authentication" service, then the "Email/password provider".
Then generate the firebase public keys for the SDK

* Copy [environment.tpl.ts](./apps/front/src/environments/environment.tpl.ts) file to environment.ts
* Paste your key there

### Firebase account - back-setup

Go to generate a private file (Settings => Service accounts => Generate a new private key) in the [Firebase console](https://console.firebase.google.com)

Open the downloaded file and fill in the `.env` file


## Launch everything

### Run back-end
To launch back :

`pnpm nx serve back`

The list of endpoints should be displayed.

### Run front-end

`pnpm nx serve front`

