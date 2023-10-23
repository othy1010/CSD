# CSD

# CSD Project

Welcome to the CSD project. This repository contains two main services:

1. csd-graphql : Implemented using Apollo Server
2. csd-Frontend: Powered by Next.js

## Project Structure

```
CSD/
│
├── csd-graphql/              # Apollo Server backend
│   ├── src/
│   ├── package.json
│   ├── .env              # Environment variables for backend
│   └── ...
│
├── csd-Frontend/             # Next.js frontend
│   ├── pages/
│   ├── public/
│   ├── package.json
│   ├── .env.local        # Environment variables for frontend
│   └── ...
│
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- npm or yarn
- Access to a database (if used in Apollo backend)

### Setting Up & Running the Backend

Navigate to the `backend` directory:

```bash
cd csd-graphql/
```

Install the required packages:

```bash
npm install
# or
yarn install
```

Provide necessary environment variables in the `.env` file. An example might look like in the db file:



Run the Apollo Server:

```bash
npm start
# or
yarn start
```

Your Apollo Server should be up and running at `http://localhost:4000`.

### Setting Up & Running the Frontend

Navigate to the `frontend` directory:

```bash
cd frontend/
```

Install the required packages:

```bash
npm install
```

```bash
# or
yarn install
```

Set up your environment variables in the `.env.local` file. If you're connecting to the Apollo Server backend, you might have something like:

```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000
```

Run the Next.js app:

```bash
npm run dev
# or
yarn dev
```

Your Next.js app should now be running at `http://localhost:3000`.

## Building for Production

If you want to build the Next.js app for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm start
# or
yarn start
```

This will serve your Next.js app in production mode from `http://localhost:3000`.

Note That if you have docker installed you can run the application with :


For development:

```bash
docker-compose -f docker-compose-dev.yml up
```

For production:

```bash
docker-compose -f docker-compose.yml up
```


