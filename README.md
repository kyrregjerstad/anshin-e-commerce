# anshin e-commerce

[Live Deployment](https://anshin.world)

## Overview

This is a full-stack e-commerce application built with Next.js, TypeScript, Tailwind CSS and Drizzle ORM. The database is a MySQL database that can be hosted anywhere that supports MySQL 8+.

## Stack

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![Zod](https://img.shields.io/badge/zod-FF3E00?style=for-the-badge&logo=zod&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![mySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Upstash](https://img.shields.io/badge/upstash-%2343853D.svg?style=for-the-badge&logo=upstash&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Features

- User authentication and registration
- Complete checkout flow
- User profile page

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.18.0+)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)

### Installation

To get started, clone the repository and install the dependencies:

```zsh
gh repo clone kyrregjerstad/anshin-e-commerce
cd anshin-e-commerce
pnpm install
```

Copy over the `.env.example` file to a new file called `.env` and fill in the necessary environment variables.

```zsh
cp .env.example .env
```

To start the development server, run the following command:

```zsh
pnpm dev
```

This project uses Docker to handle the development backend environment, such as a MySQL db and Redis. To start the backend, run the following command in a new terminal session in the project root:

```zsh
docker-compose up -d
```

The db needs to be initialized and seeded before the project can be run. To do this, run the following command:

```zsh
pnpm db:init
```

That's it! The full project is now running.

## Docker

Redis will run on port `6379`. To inspect the Redis key-value store, visit http://localhost:5540 in your browser and use `redis:6379` as the host and port in the menu.

In production, Upstash Redis is used.

A MySQL database is used to store the user data. It runs on port `3307` to avoid conflicts with local MySQL installations.

To stop docker, run the following command:

```zsh
docker-compose down
```
