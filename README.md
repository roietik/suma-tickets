# Suma-tickets

Generating and sending tickets to an email address

## The application consists of four services:

- __APP__: Service listens on port 3000. It represents a frontend application built in the Angular Framework.
- __API__: Service listens on port 5050. It represents a backend API built using the Express.js framework for Node.js.
- __NGINX__: Service listens on port 80 which is mapped by docker-compose to 3050 on the localhost and forwards requests to the api. Matches URL paths starting with '/', '/api', and routes them to the APP, API services defined in the 'upstream app', 'upstream api' block".
- __POSTGRES__: Service listens on port 5432. It represents a PostgreSQL database server.

## Cloning it with github

Clone the Main Repository:

```
git clone git@github.com:roietik/suma-tickets.git
```
Begin by cloning the core suma-tickets repository from GitHub using the above command


Clone the App frontend submodule:
```
cd app
git clone git@github.com:roietik/suma-tickets-app.git
```
Cloned submodule content should follow a specific structure within the ./app directory.
Below you will find a expected structure

## Project structure
```$ tree suma-tickets
.
├── docker-compose.yml
├── .env
├── api
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── index.js
├── nginx
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── default.conf
└── app
    ├── Dockerfile
    ├── Dockerfile.dev
    └── nginx
        └── nginx.conf
    
```

## Deploy it with docker-compose:

Be sure to add the .env file listed above, which is not placed directly in the repository for security reasons
```
$ docker-compose up -d
Creating network "suma-tickets_default" with the default driver
Building app
Step 1/2 : FROM node:18.17.1-alpine
 ---> 48c8a7c47625
Step 2/2 : COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
 ---> Using cache
 ---> 9d5f008155e5

Successfully built 9d5f008155e5
Successfully tagged suma_tickets_app:latest
WARNING: Image for service app was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
...
Creating suma_tickets_api    ... done
Creating suma_tickets_app    ... done
Creating postgres            ... done
Creating suma_tickets_nginx  ... done
```
Check that containers are running
```
$ docker-compose ps
IMAGE                COMMAND                  PORTS                    NAMES
suma-tickets-nginx   "/docker-entrypoint.…"   0.0.0.0:3050->80/tcp     nginx
postgres:latest      "docker-entrypoint.s…"   0.0.0.0:5432->5432/tcp   postgres
suma-tickets-api     "docker-entrypoint.s…"                            api
suma-tickets-app     "docker-entrypoint.s…"                            app

```

Stop and remove containers
```
$ docker-compose down
[+] Running 5/5
 ✔ Container postgres            Removed                                                                                                                                                        0.4s 
 ✔ Container nginx               Removed                                                                                                                                                        0.9s 
 ✔ Container app                 Removed                                                                                                                                                       10.9s 
 ✔ Container api                 Removed                                                                                                                                                       10.3s 
 ✔ Network suma-tickets_default  Removed 
```

Creates a backup of a PostgreSQL database and saves it to a specific location
```
$ docker exec -it postgres pg_dump -U postgres -d postgres > api/var/dumps/dump.sql
```
