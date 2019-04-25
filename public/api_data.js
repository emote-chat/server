define({ "api": [  {    "type": "post",    "url": "/signup",    "title": "Register new user",    "name": "SignupUser",    "group": "Auth",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "display_name",            "description": "<p>User's display name.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>User's email.</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>User's password.</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "user",            "description": "<p>User information.</p>"          },          {            "group": "Success 200",            "type": "Number",            "optional": false,            "field": "user.id",            "description": "<p>User ID.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "user.display_name",            "description": "<p>User display name.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "user.first_name",            "description": "<p>User first name.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "user.last_name",            "description": "<p>User last name.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "access_token",            "description": "<p>JSON Web Token (JWT).</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "expires_in",            "description": "<p>Amount of time in which the JWT will expire.</p>"          }        ]      },      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n     \"user\": {\n         \"id\": 1,\n         \"email\": \"test123@gmail.com\",\n         \"display_name\": \"manos\",\n         \"first_name\": null,\n         \"last_name\": null\n     },\n     \"access_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU2MTUyMjg3LCJleHAiOjE1NTYzMjUwODd9.O3LGwb8gEYcfUpLlCl_77MCF1hQ8igUVB96AbiaWu2c\",\n     \"expires_in\": \"2 days\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "MissingFields",            "description": "<p>Missing one or more of required fields <code>email</code>, <code>password</code> and/or <code>display_name</code>.</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "UserAlreadyExists",            "description": "<p>The <code>email</code> belongs to an existing user.</p>"          }        ]      },      "examples": [        {          "title": "Error-Response:",          "content": "HTTP/1.1 400 Bad Request\n{\n     \"message\": \"Missing fields\"\n}",          "type": "json"        },        {          "title": "Error-Response:",          "content": "HTTP/1.1 400 Bad Request\n{\n     \"message\": \"Account with that email already exists\"\n}",          "type": "json"        }      ]    },    "version": "0.0.0",    "filename": "routes/signup.js",    "groupTitle": "Auth"  }] });
