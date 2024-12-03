# Backend API Documentation

# User Authentication API

## Register User

### **Endpoint**  
`POST /register`

### **Description**  
This endpoint registers a new user, hashes their password, generates a JWT token, and saves the user to the database.

### **Request Headers**

| Key           | Value              |
|---------------|--------------------|
| Content-Type  | application/json   |

### **Request Body**

```json
{
    "fullName": {
        "firstName": "John",
        "lastName": "Doe"
    },
    "email": "johndoe@example.com",
    "password": "password123"
}

### Response

HTTP Status: 201 Created

{
    "message": "User created successfully",
    "data": {
        "_id": "648cd9e1d9c8c8f8472d9e1c",
        "email": "johndoe@example.com",
        "fullName": {
            "firstName": "John",
            "lastName": "Doe"
        },
        "createdAt": "2024-12-01T12:00:00Z",
        "updatedAt": "2024-12-01T12:00:00Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


###  Error Response

HTTP Status: 400 Bad Request

{
    "message": "Validation failed",
    "errors": ["Invalid email format", "Password must be at least 8 characters"]
}


### Email Already Exists

HTTP Status: 400 Bad Request

{
    "message": "Email already exists!"
}


###  Server Error

HTTP Status: 500 Internal Server Error

{
    "message": "Error creating user",
    "error": "Detailed error message"
}




API Documentation for GET /getProfile
Endpoint: /getProfile
Method: GET
Description:
This endpoint retrieves the profile of the authenticated user.

Request
Headers
Authorization (optional, if not using cookies):
Format: Bearer <JWT_TOKEN>
Description: Pass the JWT token for authentication.
Cookies
token (optional, if not using Authorization header):
Description: JWT token stored as a cookie.
Responses
200 OK
Description: Returns the authenticated user's profile data.
Response Body:
{
  "user": {
    "_id": "64f6e41e4fa9e09e8d8e73df",
    "email": "example@example.com",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z"
  }
}
401 Unauthorized
Description: User is not authenticated.
Response Body:
{
  "message": "Unauthorized"
}
500 Internal Server Error
Description: An unexpected error occurred on the server.
Response Body:
{
  "message": "Something went wrong",
  "error": "Detailed error message"
}





