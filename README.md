# API Rest NodeJS Template

## This Project is a NodeJS template based on TypeScript, Express and TypeORM

## Here is the lib list used to build this API Rest endpoint App :

- **[helmet](https://github.com/helmetjs/helmet)**\
  Help us to secure our application by setting various HTTP headers\
- **[cors](https://github.com/expressjs/cors)**\
  Enable cross-origin Requests\
- **[body-parser](github.com/expressjs/body-parser)**\
  Parses the client’s request from json into javascript objects\
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)**\
  Will handle the jwt operations for us\
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)**\
  Help us to hash user passwords\
- **[typeorm](https://github.com/typeorm/typeorm)**\
  The ORM we are going to use to manipulate database\
- **[reflect-metadata](https://github.com/rbuckton/reflect-metadata)**\
  allow some annotations features used with TypeORM\
- **[class-validator](https://github.com/typestack/class-validator)**\
  A validation package that works really well with TypeORM

## Pre-require

- nodejs
- docker

## Install

```
npm install
```

## Developer config

You can setup the **ormconfig.json** file to configure your database connexion.\ If you don't have one, you can use the docker-compose and adapt it for your use.\
If you use the docker-compose, you need to create a .env file at the root project and fill it as follow :

```
POSTGRES_USER='username'
POSTGRES_PASSWORD='password'
POSTGRES_DB='dn_name'
# The posgres_host should be 'host.docker.internal' in dev
#                            'database'             in prod
POSTGRES_HOST='host.docker.internal'
POSTGRES_PORT=15432
PORT='3000'
jwtSecret='asecretkey'
```

Then run this command

```
docker-compose up --build
```

## Mail Server config

[Mailhog](https://github.com/mailhog/MailHog)\
To use all the functionnalities of this template, you need to use a mail server.\ If you don't have one, like the DB, you can use the docker-compose and uncomment the mailhog lines. It will provide you a mail server that you can access on port 1025 for the SMTP server and on port 8025 for the HTTP server.
Try it on `http://localhost:8025/`

## Build in dev

```
docker build -f Dockerfile.dev . -t homeset-api
```

## Build in prod

```
docker build -f Dockerfile . -t homeset-api
```

## Start

To start, the app need to connect to the DB. It will failed if the db is not up or if the credentials are not correct.

```
npm run start
```

Or

```
docker-compose up
```

With --build if necessary
Open your local browser and verify the sample node api sample is working by accessing :
`http://localhost:3000/public`
`http://localhost:3000/api-docs/#/`

## Production

```
npm run build
```

Or

```
docker-compose -f docker-compose-prod.yml up
```

**TypeORM Migrations**\
node ./node_modules/typeorm/cli.js migration:create -n "YourMigrationFile"
