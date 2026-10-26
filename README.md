# KIVORA

KIVORA is a server-rendered property-listing application built with Node.js,
Express, MongoDB, Mongoose, and EJS. It allows users to browse listings,
create new listings, view listing details, edit existing listings, and delete
listings.

## Features

- View all available listings
- View an individual listing and its details
- Create a new listing
- Edit an existing listing
- Delete a listing
- Seed MongoDB with sample listing data
- Use method override to support PUT and DELETE requests from HTML forms

## Technology Stack

- **Runtime:** Node.js
- **Web framework:** Express 5
- **Database:** MongoDB
- **ODM:** Mongoose
- **Templating engine:** EJS
- **HTTP method support:** method-override

## Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB Community Server running locally

The application currently connects to:

```text
mongodb://127.0.0.1:27017/kivora
```

## Installation

1. Clone or download the project.
2. Open a terminal in the project directory.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Make sure MongoDB is running locally.

## Running the Application

Start the Express server with:

```bash
node app.js
```

The application listens on port `8080`. Open the following URL in a browser:

```text
http://localhost:8080
```

The main listings page is available at:

```text
http://localhost:8080/listings
```

## Loading Sample Data

The project includes sample listing data in `init/data.js`. To clear the
existing `Listing` documents and insert the sample data, run:

```bash
node init/index.js
```

> **Warning:** The seed script runs `deleteMany({})` before inserting the
> sample data. This removes all existing listings from the `kivora` database.

## Application Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Confirms that the root route is working |
| `GET` | `/listings` | Displays all listings |
| `GET` | `/listings/new` | Displays the new-listing form |
| `POST` | `/listings` | Creates a listing |
| `GET` | `/listings/:id` | Displays one listing |
| `GET` | `/listings/:id/edit` | Displays the edit form |
| `PUT` | `/listings/:id` | Updates a listing |
| `DELETE` | `/listings/:id` | Deletes a listing |

HTML forms use `method-override` with the `_method` query parameter to submit
the `PUT` and `DELETE` operations.

## Listing Data Model

Each listing contains:

| Field | Type | Required |
|---|---|---|
| `title` | String | Yes |
| `description` | String | No |
| `image.filename` | String | No |
| `image.url` | String | No |
| `price` | Number | Yes |
| `location` | String | Yes |
| `country` | String | Yes |

If no image filename is supplied, the model provides a default image URL.

## Project Structure

```text
KIVORA/
├── app.js                  # Express application and route definitions
├── init/
│   ├── data.js             # Sample listing data
│   └── index.js            # Database seed script
├── models/
│   └── listing.js          # Mongoose Listing schema and model
├── views/
│   └── listings/
│       ├── edit.ejs        # Edit-listing form
│       ├── index.ejs       # All-listings page
│       ├── new.ejs         # New-listing form
│       └── show.ejs        # Listing details page
├── package.json
├── package-lock.json
└── .gitignore
```

## Available npm Scripts

There is currently no start script configured in `package.json`, so use
`node app.js` to start the application. The existing `test` script is the
default placeholder and does not run automated tests.

## Notes

- The application currently uses a local MongoDB connection string directly in
  the source code.
- Authentication, authorization, image uploads, centralized error handling,
  and automated tests are not currently implemented.
