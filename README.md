Modern Banking Application
This project is a full-stack web application simulating basic banking functionalities, built with a modern technology stack including React for the frontend, Flask for the backend API, JWT for authentication, and SQLAlchemy for database interactions, styled with Bootstrap. It demonstrates effective client-server communication, secure authentication practices, and robust data management.


![image](https://github.com/user-attachments/assets/2a23913c-b50b-4811-a36b-a479de17bc62)

![image](https://github.com/user-attachments/assets/36b72040-0297-4c2c-bbf4-322092034790)

![image](https://github.com/user-attachments/assets/2571b9d3-6d63-4e46-9d41-01c17b6b9a6c)

### ✨ Features

User Authentication: Secure login and registration with JSON Web Tokens (JWT).

Account Management:

Display current balance and recent transactions.

Ability to transfer money between accounts.

Request a loan (with a basic approval logic).

Feature to close an account.

Transaction History: View transaction history.

Responsive UI: A user-friendly interface designed with Bootstrap for various screen sizes.

### 💻 Technologies Used
Frontend
React.js: A JavaScript library for building dynamic and interactive user interfaces.

React Router: For declarative routing and navigation within the Single Page Application.

Bootstrap: A powerful CSS framework for responsive design and pre-built UI components, ensuring a polished look and feel.

HTML5 & CSS3: For structuring and custom styling of the web application.

JavaScript (ES6+): For all client-side logic, data manipulation, and interaction with the backend API.

### Backend

Python: The primary programming language for the server-side logic.

Flask: A lightweight and flexible micro web framework for Python, used to build the RESTful API.

Flask-SQLAlchemy: An extension for Flask that seamlessly integrates SQLAlchemy, simplifying database operations within the Flask application.

SQLAlchemy: A robust SQL toolkit and Object-Relational Mapper (ORM) that provides a high-level, Pythonic way to interact with relational databases.

Flask-JWT-Extended: A Flask extension providing comprehensive JSON Web Token (JWT) support for secure user authentication and authorization.

SQLite: The relational database system used for persistent data storage.

### 🚀 Key Concepts & Good Practices

This project showcases a full-stack architecture with a strong emphasis on modern development practices:

Frontend (React & Bootstrap)
Component-Based Architecture: Building modular and reusable UI components with React for enhanced maintainability and scalability.

Declarative UI: Designing the user interface in React where the UI describes the desired state, and React handles updates efficiently.

State Management with React Hooks: Utilizing useState, useEffect, and useContext for effective and predictable application state management.

Asynchronous Operations: Handling secure API requests (e.g., using fetch or axios) to communicate with the Flask backend.

Responsive Design: Implementing responsive layouts and styling with Bootstrap to ensure optimal user experience across various devices.

Backend (Flask, SQLAlchemy, JWT)
RESTful API Design: Developing well-structured and consistent API endpoints for banking operations (e.g., /api/auth/login, /api/transactions, /api/accounts).

Secure Authentication with JWT:

Token-Based Authorization: Implementing a stateless authentication mechanism where signed JWTs issued upon login are used to authorize subsequent client requests.

Protected Routes: Securing sensitive API endpoints that require a valid authentication token.

Object-Relational Mapping (ORM) with SQLAlchemy:

Pythonic Database Interactions: Defining database schemas and interacting with the database using Python objects, abstracting raw SQL queries.

Atomic Transactions: Ensuring data integrity for critical operations like money transfers, where all related database changes are committed or rolled back together.

Modular Application Structure: Organizing the Flask application into logical modules (e.g., blueprints, models, services) for better code organization and separation of concerns.

Robust Error Handling: Implementing comprehensive error handling for API responses, database operations, and user input validation.


### 1) Installation:

> If you use Github Codespaces (recommended) or Gitpod, this template will already come with Python, Node, and the PostgreSQL  Database installed. If you are working locally, make sure to install Python 3.10, Node. 

### Back-End Manual Installation:

It is recommended to install the backend first, make sure you have Python 3.8, Pipenv, and a database engine

1. Install the Python packages: `$ pipenv install`
2. Create a .env file based on the .env.example: `$ cp .env.example .env`
3. Make sure that you change the `BACKEND_URL` variable in the `.env` file to point to your actual address.

### Front-End Manual Installation:

-   Make sure you are using node version 14+ and that you have already successfully installed and run the backend.

1. Install the packages: `$ npm install`
2. Start coding! start the webpack dev server `$ npm run start`

### 🛠️ How to Run
1. To start the front-end `npm start`
2. To start the back-end `pipenv run start`
3. Make sure you make the ports public

### Contributors

This template was built as part of the 4Geeks Academy
