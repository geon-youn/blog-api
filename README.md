# Blog API

A RESTful API for a blog with the following features:
1. Users and JWT verification for API calls.
2. Simple text blog posts.
3. Toggles for displaying posts.
4. Comments to posts and to other comments.
5. CRUD methods for posts and comments.
6. Support for MongoDB Atlas.

## Documentation

### `.env` 

Requires 2 environment variables:
- `mongodb` is the link for connecting to the MongoDB Atlas database.
- `secret` is for signing the JWT. 

### User API

The user routes allow for signing up (creating an account) and logging in (retrieving a JWT).

#### Signing Up

Perform a `post` request to `/signup` with the request body containing the following:
- `username`: the user's desired username.
  - Has to be alphanumeric.
  - Non-empty. 
- `password`: the user's password.
  - Non-empty.
- `first_name`: the user's first name.
  - Only contains alphabets.
  - Non-empty.
- `last_name`: the user's last name.
  - Only contains alphabets.
  - Non-empty.

Returns a json with `errors` and `message` when:
- The request body is invalid.
- A user with the given username already exists.
- The password couldn't be hashed. 

On success, returns a json response with the user's JWT token in `token`.

#### Logging In

Perform a `post` request to `/login` with the request body containing the following:
- `username`: the user's username.
- `password`: the user's password.

Returns a json with `errors` and `message` when:
- The request body is invalid.
- The username doesn't exist.
- The password is incorrect.
- There was an error generating the JWT.

On success, returns a json response with the user's JWT token in `token`.

### Comment API

### Post API