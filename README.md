## Description

It is a basic model for simple user rest-api system include "Authentication & Authorization" using node js and MySQL database.

API documentation using swagger:

ex: [http://localhost:5000/api-docs/](http://localhost:5000/api-docs/)

## Installation

```bash
$ npm install
```

## Running the app

### development

```bash
$ npm run dev
```

### Build app

```bash
$ npm run build
```

### production mode

```bash
$ npm start
```

## Test

### Unit tests

```bash
$ npm run test
```

## Database Migration

### Migration

```bash
$ npm run migration
```

## Environment Variables

PORT: require port for running app ex: 5000.

ENCRYPTION_KEY: key used for ENCRYPTION process in system "it depended on ENCRYPTION algorithm".

DB_DATABASE: Database name.

DB_USERNAME: Database username.

DB_PASSWORD: Database Password.

DB_HOST: Database host.

DB_PORT: Database port.

JWT_SECRET: jwt secret key.

JWT_EXPIRE: jwt expire.

GOOGLE_USER: gmail address "used for mail services configuration".

GOOGLE_PASSWORD: password for google services "not gmail password and used for mail services configuration"

CLOUD_API_KEY: cloudinary "API KEY".

CLOUD_API_SECRET: cloudinary "API secret".

CLOUD_NAME: cloudinary "Cloud Name"
