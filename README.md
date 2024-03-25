```zsh
pnpm dev
```

This project uses Docker to handle the development backend environment. To start the backend, run the following command:

```zsh
docker-compose up -d
```

This will start Redis on port `6379`. To inspect the Redis key-value store, visit http://localhost:5540 in your browser and use `redis:6379` as the host and port.

To stop the backend, run the following command:

```zsh
docker-compose down
```

In production, Upstash Redis is used.

A mySql database is used to store the user data. It runs on port `3307` to avoid conflicts with local mySql installations.

After starting the backend, you need to create the database schema and seed the database with the following command:

```zsh
pnpm db:init
```

This can only be done after docker is running.

To reset the db, run the following command:

```zsh
pnpm docker:init
```

when the docker container has restarted, run the following command:

```zsh
pnpm db:init
```
