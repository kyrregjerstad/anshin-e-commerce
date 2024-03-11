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
