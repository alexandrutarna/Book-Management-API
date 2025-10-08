# Book-Management-API

- [Book-Management-API](#book-management-api)
  - [Setup Instructions](#setup-instructions)
  - [How to run API locally (with Docker)](#how-to-run-api-locally-with-docker)
  - [How to run tests](#how-to-run-tests)
  - [CI/CD script usage](#cicd-script-usage)
  - [API Documentation](#api-documentation)
  - [Notes](#notes)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone
    ```

2. Navigate to the project directory:

    ```bash
    cd Book-Management-API
     ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. todo: Set up environment variables:

    todo: Create a `.env` file in the root directory and add the necessary environment variables.

## How to run API locally (with Docker)

1. Navigate to the project directory:

    ```bash
    cd Book-Management-API
     ```

2. Build and run the Docker container:

    ```bash
    # build the docker image with tag book-management-api
    docker build -t book-management-api . 

    # check if the image is created
    docker images | grep book-management-api

    # If a container with name 'book-api' already exists, remove it first:
    # docker stop book-api && docker rm book-api

    # run the docker container with name book-api
    docker run -d -p 3000:3000 --name book-api book-management-api 

    # Check if container is running
    docker ps | grep book-api

    ```

3. Access the API at `http://localhost:3000` (or the port specified in your `.env` file).

4. Test the API endpoints using curl:
    - Get all books:
  
    ```bash
    curl -X GET http://localhost:3000/books
    ```

    - Get a book by ID:
  
    ```bash
    curl -X GET http://localhost:3000/books/{id}
    ```

    - Add a new book:
  
    ```bash
    curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"title": "Book Title", "author": "Author Name", "publishedDate": "2023-01-01", "genre": "Fiction"}'
    ```

    - Update a book:
  
    ```bash
    curl -X PUT http://localhost:3000/books/{id} -H "Content-Type: application/json" -d '{"title": "Updated Book Title", "author": "Updated Author Name", "publishedDate": "2023-01-01", "genre": "Fiction"}'
    ```

    - Delete a book:
  
    ```bash
    curl -X DELETE http://localhost:3000/books/{id}
    ```

5. To stop and clean up the container when finished:

    ```bash
    # Stop the container
    docker stop book-api

    # Remove the container
    docker rm book-api

    # Optional: Remove the image if no longer needed
    docker rmi book-management-api
    ```

## How to run tests

1. Navigate to the project directory:

    ```bash
    cd Book-Management-API
     ```

2. Install dependencies (if not already done):

    ```bash
    npm install
    ```

3. Run the tests:

    ```bash
    npm test
    ```

## CI/CD script usage

1. Ensure you have the necessary permissions to execute the script.
2. Make the script executable (if not already):

    ```bash
    chmod +x ci.sh
    ```

3. Run the CI/CD script:

    ```bash
    ./ci.sh
    ```

## API Documentation

## Notes
