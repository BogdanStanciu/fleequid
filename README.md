## Description

This project requires implementing two Node.js applications that communicate via APIs, each with its own local database for CRUD operations.

- **Application A** exposes APIs for retrieving, inserting, updating, and deleting documents.
- **Application B** interacts with Application A via API calls and stores the retrieved data in its own database.
- Authentication is required for POST, PUT, and DELETE requests, with login returning a user-specific token.

The solution consists of two services built with NestJS, using MongoDB for data persistence in Service A and Redis for caching responses from Service A in Service B.

### 🚨 Disclaimer 🚨

All infrastructure for this project is tested on [Orbstack](https://orbstack.dev/), with data not being persisted initially or across restarts.
Additionally, to run the project, ports **3000**, **4000**, **6379**, and **27017** must be available on the local machine.

## Project setup

Clone the repository to your machine and navigate to the project’s root directory. Follow the steps below to set up the project.

Once the project is running, API documentation for Service A will be available at:
📌 http://localhost:3000/doc

- Service A runs on port 3000
- Service B runs on port 4000

### Build Docker Images

Use the provided Makefile to build the Docker images:

```bash
$ make build
```

After the build, two new images will be created: service-a and service-b.

### Start the infrastructure

Run the following command from the project’s root directory:

```bash
make start
```

All logs will be displayed in the terminal.

### Stop the infrastructure

To shut down the infrastructure, run:

```bash
make stop
```

## Running the Get and Insert Flow

The two applications bind to ports 3000 and 4000.
To test the flows, open a new terminal and execute the provided curl commands while monitoring the logs in the previous terminal.

Both MongoDB and Redis are mapped to local ports, allowing users to connect using their preferred database clients.

Available utilities in Service A

| username | password |
| -------- | -------- |
| user.a   | 1234     |
| user.b   | 1234     |

### Get Flow

This flow performs a GET request and a GET list request, caching the results using Redis.

```bash
curl --location 'http://localhost:4000/get-test'
```

### Insert Flow

This flow performs insert, update, and delete operations.
All requests are authenticated using user A.

```bash
curl --location 'http://localhost:4000/insert-test'
```
