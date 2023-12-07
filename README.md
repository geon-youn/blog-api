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

### Database Models

#### User

Holds users' information.
- `username`: the user's username.
- `password`: the user's hashed password.
- `first_name`: the user's first name.
- `last_name`: the user's last name.

Has a virtual `full_name` that returns `first_name + last_name`.

#### Post

Holds blog posts' information.
- `title`: the blog post's title.
- `text`: the blog post's text.
- `author`: a reference to a `User` id.
- `created`: the date the post was created.
- `modified`: the date the post was modified.
- `published`: whether the blog post is published. 

#### Comment

Holds users' comments' information.
- `test`: the comment's text.
- `author`: a reference to a `User` id.
- `post`: a reference to a `Post` id.
- `replyTo`: a reference to a `Comment` id.
- `created`: the date the comment was created.
- `modified`: the date the comment was modified.
- `deleted`: whether the comment is deleted. 

### User API

The user routes allow for signing up (creating an account) and logging in (retrieving a JWT).

#### Signing Up

Perform a `post` request to `/api/user/signup` with the request body containing the following:
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

Perform a `post` request to `/api/user/login` with the request body containing the following:
- `username`: the user's username.
- `password`: the user's password.

Returns a json with `errors` and `message` when:
- The request body is invalid.
- The username doesn't exist.
- The password is incorrect.
- There was an error generating the JWT.

On success, returns a json response with the user's JWT token in `token`.

### Post API

#### Creating a blog post

Perform a `post` request to `/post/create` 

#### Getting a specific blog post (e.g. to display a specific post)

#### Getting all blog posts (e.g. for the main page)

#### Updating a specific blog post

#### Deleting a specific blog post

### Comment API

