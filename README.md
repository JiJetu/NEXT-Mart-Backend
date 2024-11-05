<div align="center">
  <h1>Car Rental Reservation System</h1>
</div>

---

# Car Rental Reservation System - Server

## Introduction

This server-side application supports the Car Rental Reservation System, enabling robust backend services for car listing management, user authentication, booking handling, payment processing, and email notifications. It utilizes Node.js, Express, and MongoDB to manage data storage and ensure secure user interactions with JWT-based authentication and environment variable configurations.

## Project Description

The backend for the Car Rental Reservation System provides RESTful API endpoints for client interactions and admin management functionalities. Key features include managing cars, handling bookings, authenticating users, and facilitating secure payments through a payment gateway.

## Features

- **User Authentication**: Sign up, login, forget password and JWT-based session management.
- **Car Management**: CRUD operations for car listings.
- **Booking Management**: Create, view, and manage user bookings.
- **Payment Integration**: Payment gateway integration for online payments.
- **Email Notifications**: Support for sending emails to users for booking confirmations and password resets.
- **Admin Tools**: Manage cars, user accounts, and booking information.

## Technology Stack

- **Node.js** and **Express**: Server and REST API.
- **MongoDB**: Database for storing user, car, and booking data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: JSON Web Tokens for secure authentication.
- **Nodemailer**: Email notifications.
- **bcrypt**: Password hashing.
- **dotenv**: Environment variable management.
- **Zod**: Validation of API requests.
- **Axios**: HTTP client for external requests.

## Project Structure

The project follows a modular and organized structure, ensuring maintainability and scalability.

```plaintext
Car-Rental-Reservation-System-Backend/
├── src/
│   ├── app/
│   │   ├── builder/
│   │   │   └── QueryBuilder.ts
│   │   ├── config/
│   │   │   └── index.ts
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   ├── handleCastError.ts
│   │   │   ├── handleDuplicateError.ts
│   │   │   ├── handleValidationError.ts
│   │   │   └── handleZodError.ts
│   │   ├── interface/
│   │   │   ├── error.ts
│   │   │   └── index.d.ts
│   │   ├── middlewares/
│   │   │   ├── auth.ts
│   │   │   ├── globalErrorhandler.ts
│   │   │   ├── noDataFound.ts
│   │   │   ├── notFound.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.interface.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.utils.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── booking/
│   │   │   │   ├── booking.interface.ts
│   │   │   │   ├── booking.model.ts
│   │   │   │   ├── booking.route.ts
│   │   │   │   ├── booking.service.ts
│   │   │   │   └── booking.validation.ts
│   │   │   ├── Car/
│   │   │   │   ├── car.constant.ts
│   │   │   │   ├── car.controller.ts
│   │   │   │   ├── car.interface.ts
│   │   │   │   ├── car.model.ts
│   │   │   │   ├── car.route.ts
│   │   │   │   ├── car.service.ts
│   │   │   │   └── car.validation.ts
│   │   │   ├── payment/
│   │   │   │   ├── payment.controller.ts
│   │   │   │   ├── payment.route.ts
│   │   │   │   ├── payment.service.ts
│   │   │   │   └── payment.utils.ts
│   │   │   ├── review/
│   │   │   │   ├── review.controller.ts
│   │   │   │   ├── review.interface.ts
│   │   │   │   ├── review.model.ts
│   │   │   │   ├── review.route.ts
│   │   │   │   ├── review.service.ts
│   │   │   │   └── review.validation.ts
│   │   │   ├── User/
│   │   │   │   ├── user.constant.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.route.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.validation.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── catchAsync.ts
│   │   │   ├── sendEmail.ts
│   │   │   └── sendResponse.ts
│   ├── views/
│   │   └── conformation.html
│   ├── app.ts
│   ├── server.ts
├── .env
├── .gitignore
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
├── vercel.json
```

## Installation Guideline

### Prerequisites

- Node.js (version 16 or higher)
- MongoDB instance (local or remote)

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/JiJetu/Car-Rental-Reservation-System-Backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Car-Rental-Reservation-System-Backend
   ```

3. Install dependencies:

   ```bash
    npm install
    # or
    yarn install
   ```

### Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the necessary configuration variables as shown below:
   ```bash
    NODE_ENV=development
    PORT=5000
    DB_URL=your_mongodb_connection_string
    SALT_ROUND=10
    JWT_ACCESS_SECRET=your_jwt_access_secret
    JWT_ACCESS_EXPIRES_IN=1h
    JWT_REFRESH_SECRET=your_jwt_refresh_secret
    JWT_REFRESH_EXPIRES_IN=7d
    STORE_ID=your_store_id
    SIGNATURE_KEY=your_signature_key
    PAYMENT_URL=https://your-payment-url.com
    PAYMENT_VERIFY_URL=https://your-payment-verify-url.com
    RESET_PASS_UI_LINK=https://your-client-url/reset-password
    EMAIL_USER=your_email_username
    EMAIL_PASS=your_email_password
   ```

## Usage

1. Build the project:

   ```bash
    npm run build
   ```

2. Start the server in development mode::

   ```bash
    npm run build
   ```

3. For production, use:

   ```bash
    npm run start:prod
   ```

4. By default, the server will run on `http://localhost:5000.` You can modify the `PORT` variable in your `.env` file if needed.

# Car Rental Reservation System API Documentation

## Base URL

`http://localhost:5000/api`

## Authentication

### Sign Up

- **Endpoint**: `/auth/signup`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "name": "your_name",
      "email": "user@example.com",
      "password": "your_password",
      "confirmPassword": "confirm_password",
      "location": "your_location",
      "phoneNumber": "your_phone_number"
    }
    ```
  - **Responses**:
    - **201**: User registered successfully
    - **400**: Invalid data provided

### Sign In

- **Endpoint**: `/auth/signin`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "your_password"
    }
    ```
  - **Responses**:
    - **200**: Successful login
    - **400**: Invalid credentials

### Refresh Token

- **Endpoint**: `/auth/refresh-token`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "refreshToken": "your_refresh_token"
    }
    ```
  - **Responses**:
    - **200**: New access token generated
    - **400**: Invalid refresh token

### Forget Password

- **Endpoint**: `/auth/forget-password`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "email": "user@example.com"
    }
    ```
  - **Responses**:
    - **200**: Password reset email sent
    - **400**: User not found

## Car Listings

### Get All Cars

- **Endpoint**: `/cars`
  - **Method**: GET
  - **Responses**:
    - **200**: List of cars
    - **404**: No cars found

### Create a Car

- **Endpoint**: `/cars`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "price": 30000
    }
    ```
  - **Responses**:
    - **201**: Car created successfully
    - **400**: Invalid data provided

## Booking

### Create a Booking

- **Endpoint**: `/bookings`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "carId": "123",
      "startDate": "2024-01-01",
      "endDate": "2024-01-10"
    }
    ```
  - **Responses**:
    - **201**: Booking created successfully
    - **400**: Invalid booking details

### Get All Bookings

- **Endpoint**: `/bookings`
  - **Method**: GET
  - **Responses**:
    - **201**: List of all bookings
    - **400**: No bookings found

### Cancel a Booking

- **Endpoint**: `/bookings/cancel/:bookingId`
  - **Method**: DELETE
  - **Request Body**:
    ```json
    {
      "carId": "123",
      "startDate": "2024-01-01",
      "endDate": "2024-01-10"
    }
    ```
  - **Responses**:
    - **204**: Booking canceled successfully
    - **404**: Booking not found

## Reviews

### Create a Review

- **Endpoint**: `/reviews`
  - **Method**: POST
  - **Request Body**:
    ```json
    {
      "carId": "123",
      "rating": 5,
      "comment": "Great car!"
    }
    ```
  - **Responses**:
    - **201**: Booking created successfully
    - **400**: Invalid booking details

### Get All Reviews

- **Endpoint**: `/bookings`
  - **Method**: GET
  - **Responses**:
    - **201**: List of all reviews
    - **400**: No reviews found

# Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.

2. Create a new branch:

   ```bash
   git checkout -b feature-branch
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m "Description of the feature"
   ```

4. Push to the branch:

   ```bash
   git push origin feature-branch
   ```

5. Open a pull request.

# Contact

Project Maintainer: **Md Jaoadul Islam**

---

Thank you for checking out the Car Rental Reservation System backend!

```rust
This README provides an overview of the backend server for the Car Rental Reservation System, covering key features, installation steps, configuration, usage, and contribution guidelines.
```
