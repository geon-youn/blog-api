# Blog API

A RESTful API for a blog with the following features:
1. Users and JWT verification for API calls.
2. Simple text blog posts.
3. Toggles for displaying posts.
4. Comments to posts and to other comments.
5. CRUD methods for posts and comments.
6. Support for MongoDB Atlas.

## Documentation

### `.env` file

Requires 2 environment variables:
- `mongodb` is the link for connecting to the MongoDB Atlas database.
- `secret` is for signing the JWT. 

### Database Models

For create, update, and delete operations, bearer authentication is used (the request must have an `authorization` header of the form `Bearer <jwt>`).

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

Perform a `post` request to `/api/user/signup` where `req.body` has:
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

Perform a `post` request to `/api/user/login` where `req.body` has:
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

Perform a `post` request to `/api/post/create` with `req.body` containing the following:
- `title`: the post's title.
- `text`: the post's text.
- `published`: the post's published status. 

Returns a json response with the new blog post in `post` upon success, otherwise an error message in `message` and `errors`.

#### Getting a specific blog post (e.g. to display a specific post)

Perform a `get` request to `/api/post/get/:postid` where `postid` is a valid MongoDB id. 

Returns a json response with the blog post with `postid` in `post` if successful, otherwise errors in `message` and `errors`. 

#### Getting all blog posts (e.g. for the main page)

Perform a `get` request to `/api/post/get` to get a json response with all published blog posts in `posts`.

#### Updating a specific blog post

Perform a `put` request to `/api/post/update/:postid` where `postid` is a valid MongoDB id with the request body having:
- `title`: the post's (modified) title.
- `text`: the post's (modified) text.
- `published`: the post's (modified) published status.

Returns a json response with the modified blog post with `postid` in `post` if successful, otherwise errors in `message` and `errors`. 

#### Deleting a specific blog post

Perform a `delete` request to `/api/post/delete/:postid` where `postid` is a valid MongoDB id. 

Returns a json response with the deleted blog post in `post` if successful, otherwise errors in `message` and `errors`.

### Comment API

#### Creating a comment to a blog post

Perform a `post` request to `/api/comment/create/:postid` where `postid` is the id of the post on which is being commented and `req.body` has:
- `text`: the comment's text.

Returns a json response with the new comment in `comment` if successful, otherwise errors in `message` and `errors`. Errors occur when:
- `postid` is an invalid MongoDB id.
- Post with `postid` doesn't exist. 
- JWT is invalid (i.e. user doesn't exist or isn't logged in). 

#### Replying to a comment

Perform a `post` request to `/api/comment/create/:postid/:parentid` where `postid` is the id of the post, `parentid` is the id of the comment you're replying to, and `req.body` has:
- `text`: the comment's text.

Returns a json response with the new comment in `comment` if successful, otherwise errors in `message` and `errors`. Errors occur when:
- `postid` is an invalid MongoDB id.
- Post with `postid` doesn't exist. 
- JWT is invalid (i.e. user doesn't exist or isn't logged in). 
- Parent comment with `parentid` doesn't exist.
- Parent comment with `parentid` is for a post with a different `postid`.

#### Getting all comments for a blog post

Perform a `get` request to `/api/comment/get/:postid` where `postid` is the id of the post for which you want to get comments.

Returns a json response with all comments for the post with `postid` in `comments` if successful, where deleted comments' `text` and `author` are `undefined`; otherwise, returns errors in `message` and `errors`. Errors occur when:
- `postid` is an invalid MongoDB id. 

#### Updating a comment

Perform a `put` request to `/api/comment/update/:commentid` where `commentid` is the id of the comment to update and `req.body` has:
- `text`: the comment's (modified) text.

Returns a json response with the modified comment in `comment` if successful, otherwise errors in `message` and `errors`. Errors occur when:
- `commentid` is an invalid MongoDB id.
- Comment with `commentid` doesn't exist or is deleted. 
- JWT is invalid (i.e. user doesn't exist or isn't logged in). 
- Requesting user isn't the author of the comment.

#### Pseudo-deleting a comment

Perform a `delete` request to `/api/comment/delete/:commentid` where `commentid` is the id of the comment to delete.

Returns a json response with the deleted comment in `comment` if successful, otherwise errors in `message` and `errors`. Errors occur when:
- `commentid` is an invalid MongoDB id.
- Comment with `commentid` doesn't exist or is already deleted.
- JWT is invalid (i.e. user doesn't exist or isn't logged in).
- Requesting user isn't the author of the comment.