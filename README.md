# NestJS application with TypeORM, Redis, and JWT Authentication

This project provides a secure and scalable NestJS API for managing articles. It utilizes TypeORM with migrations for database persistence, Redis for caching, and JWT authentication for access control.

## Features:

<ul>
<li>Create, retrieve, update, and delete articles.</li>
<li>Filter and sort articles using various criteria.</li>
<li>Implement robust caching with Redis for improved performance.</li>
<li>Secure user access with JWT-based authentication.</li>
<li>Config service with env validation.</li>
<li>Postgres database with typeorm and migrations.</li>
<li>Configured Swagger for documentation.</li>
</ul>

## Technologies:

<ul>
<li>NestJS (backend framework)</li>
<li>TypeORM (object-relational mapper with migrations)</li>
<li>Redis (in-memory data store for caching)</li>
<li>JWT (JSON Web Token) for authentication</li>
</ul>

## Getting Started:

<ol>
  <li> Clone this repository.</li>
  <li> Install dependencies: <code> npm install </code>.</li>
  <li> Create a .env file in the root directory, refer .env.example file.</li>
  <li> Run docker containers for local development <code> sh scripts/build-local.sh.</code>, script will automatically run migrations.</li>
  <li> Start the application: <code> npm run start:dev</code> in backend directory.</li>
</ol>

## API Endpoints:

### Authentication Routes:

<ul>
  <li>
    POST /auth/signup (body: { username, password }): Registration endpoint to generate JWT token upon successful user credentials validation.
  </li>
  <li>
    POST /auth/signin (body: { username, password }): Login endpoint to generate JWT token upon successful user credentials validation.
  </li>
  <li>
    POST /auth/refresh (header: { token }): Refresh user tokens.
  </li>
  <li>
    GET /user/profile (requires valid JWT token): Retrieves currently authenticated user information.
  </li>
</ul>

### Article Routes:

<ul>
  <li> POST /article (Requires authorization): Creates a new article. </li>
  <li> GET /article/:id (Optional authorization): Retrieves an article by its ID. </li>
  <li> GET /article/many (Optional authorization): Retrieves a list of articles with pagination and filtering options. </li>
  <li> PATCH /article/:id (Requires authorization): Updates an existing article. </li>
  <li> 
  DELETE /article/:id (Optional, implement if applicable. Requires authorization): Deletes an article. </li>
</ul>

### Authorization:

The API utilizes JWT (JSON Web Token) for authentication. Successful login via the /auth/signin endpoint provides a JWT token that needs to be included in the authorization header of subsequent requests that require authentication (indicated in the endpoint descriptions).

### Caching:
This project leverages Redis for caching frequently accessed data(articles), potentially improving performance and reducing database load. Caching strategies are implemented within the NestJS application logic.

### Testing:

Unit tests are included to ensure core functionalities.

## Extra:

You can also run your app in remote machine
By running script <code> sh scripts/build-staging.sh </code>

<ol>
  <li> For local development: <code> sh scripts/build-local.sh </code>  </li>
  <li> For staging development: <code> sh scripts/build-staging.sh </code>  </li>
  <li> For locally testing staging игшв: <code> sh scripts/test-build-staging.sh </code>  </li>
  <li> For running migrations <code> npm run migration:run </code> in backend directory</li>
</ol>

## Addons

<ol>
  <li> Sqlpad in local environment for database browsing: PORT 2233</li>
  <li> Kibana in staging environment for logs: http://logs.${HOST} </li>
</ol>
