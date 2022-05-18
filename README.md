# Prisma ORM types genereted by Nexus + Apollo server

This project follows nexus tutorial while I am adding extra types definitions like DateTime, project can serve as boiler plate to scale up a simple project. I also added a postgress Image to spin up a a database, further implementations is contenarized the whole project to become part of a micro-service architecture.

## Setup

### Configure docker-compose.yml

```yml

version: '3.8'
services:
  postgres:
    image: postgres:10.3
    restart: always
    environment:
      - POSTGRES_USER=${DB_USER}
      #- POSTGRES_HOST_AUTH_METHOD=true // uncoment if DB requires no password
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres:/var/lib/postgresql/data
    ports:
      - '5432:5432'
volumes:
  postgres:


```

run ``docker-compose up`` to start the database, you can check with ```docker-compose ps``` to see if is running.

## Setup Prisma

> There Is already an schema I recommend no to change and become familiar with nexus syntax to later modify.

1. Configure `.env` File

```env
DB_USER=whoami
DB_PASSWORD=1234
DB_NAME=project23

DATABASE_URL="postgresql://whoami:1234@localhost:5432/project23"

```

2. Run `yarn install` to install all dependecies

3. The Schema is ready and the nexus schame is also prepare, then run:
   > `npx prisma migrate dev --name init --preview-feature`
4. After the database is ready and types from prisma where generated you can run so Nexus generate the SDL or GraphQL types.
   >`yarn generate`

5. Finnally you can start the server with:
   > `yarn dev`

   and check the apollo playground in `localhost:4000`

## REFERENCES

[Logrocket -> end to end type safety](https://blog.logrocket.com/end-to-end-type-safety-nextjs-prisma-graphql/)

[Repo Prisma Example NextJS](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nextjs)

[Repo e2e Type-safe-app](https://github.com/ruheni/e2e-type-safe-app)
