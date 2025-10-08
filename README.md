# Book-Management-API

- [Book-Management-API](#book-management-api)
  - [Setup Instructions](#setup-instructions)
    - [What it does](#what-it-does)
    - [Testing failures](#testing-failures)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/alexandrutarna/Book-Management-API.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Book-Management-API
     ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the server:

    ```bash
    npm start
    ```

5. The server will run on `http://localhost:3000` by default.

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

3. Access the API at `http://localhost:3000`  

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

The `ci.sh` script automates the full pipeline: install dependencies, run tests, build Docker image, and smoke test the API.

### Quick Start

```bash
# Make executable and run
chmod +x ci.sh
./ci.sh

# Or with custom tag
./ci.sh my-tag
```

### What it does

1. `npm ci` - Clean dependency install
2. `npm test` - Run tests with coverage  
3. `docker build` - Create Docker image
4. **Port cleanup** - Automatically handles port 3000 conflicts
5. `docker run` - Start container for testing
6. Smoke test/ Health check - Verify `/books` endpoint works
7. Auto cleanup - Remove test containers (runs automatically on script exit, success or failure)

### Testing failures

To verify the CI fails properly when tests break:

1. **Break a test** in `tests/controllers/bookController.unit.test.js` (e.g., change an expected value)
2. **Run CI** - `./ci.sh`
3. **Should fail** at the test stage with `❌ TESTS FAILED - CI pipeline stopped`
4. **Fix the test** and run again to verify it passes

**Note**: Missing lint checks from original requirements - can be added with `npm run lint`.
