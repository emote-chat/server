/**
 * @api {post} /signup Register new user
 * @apiName SignupUser
 * @apiGroup Auth
 *
 * @apiParam (Request body) {String} display_name User's display name.
 * @apiParam (Request body) {String} email User's email.
 * @apiParam (Request body) {String} password User's password.
 *
 * @apiSuccess {Object} user User information.
 * @apiSuccess {Number} user.id User ID.
 * @apiSuccess {String} user.display_name User display name.
 * @apiSuccess {String} user.first_name User first name.
 * @apiSuccess {String} user.last_name User last name.
 * @apiSuccess {String} access_token JSON Web Token (JWT).
 * @apiSuccess {String} expires_in Amount of time in which the JWT will expire.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "user": {
 *              "id": 1,
 *              "email": "test123@gmail.com",
 *              "display_name": "manos",
 *              "first_name": null,
 *              "last_name": null
 *          },
 *          "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU2MTUyMjg3LCJleHAiOjE1NTYzMjUwODd9.O3LGwb8gEYcfUpLlCl_77MCF1hQ8igUVB96AbiaWu2c",
 *          "expires_in": "2 days"
 *     }
 *
 * @apiError MissingFields Missing one or more of required fields <code>email</code>, <code>password</code> and/or <code>display_name</code>.
 * 
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *          "message": "Missing fields"
 *     }
 * 
 * @apiError UserAlreadyExists The <code>email</code> belongs to an existing user.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *          "message": "Account with that email already exists"
 *     }
*/
module.exports = (() => {
    const express = require('express');
    const router = express.Router();
    const path = require('path');
    const authController = require(path.join(__dirname, '../controllers/auth.controller'));

    // API endpoint to sign up new user
    router.post('/', authController.signup);

    return router;
})();