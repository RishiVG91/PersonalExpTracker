# Expanse - Personal Expense Tracker

A full-stack expense tracking project built with **Spring Boot + React**.

The project is designed to provide a secure web application where users can register, log in, and manage their income and expense transactions. The documented application includes JWT-based authentication, transaction management, filtering, dashboard summaries, and database support.

> **Repository note:** The uploaded `expanse.zip` currently contains the **Spring Boot backend only**. The React frontend is documented below because it is part of the project documentation, but its source files are not present in the uploaded ZIP. The frontend section therefore describes the documented architecture rather than claiming that those files are currently inside this ZIP.

---

## Features

- User registration and login
- JWT-based authentication
- Secure password handling with BCrypt
- Add income and expense transactions
- Edit existing transactions
- Delete transactions
- Filter transactions by type, category, and date range
- Dashboard summary:
  - Total Income
  - Total Expense
  - Net Balance
- Category-wise spending breakdown
- MySQL database support
- H2 in-memory database support for development
- REST API architecture
- React frontend architecture with client-side routing
- Input validation on frontend and backend
- Protected routes for authenticated users

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Java 17 | Backend programming language |
| Spring Boot | Backend application framework |
| Spring Web MVC | REST API / web layer |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Database access and ORM |
| Jakarta Validation | Input validation |
| MySQL Connector/J | MySQL connectivity |
| Maven | Build and dependency management |

### Frontend

The project documentation specifies:

| Technology | Purpose |
|---|---|
| React 18 | Frontend UI library |
| JavaScript ES6+ | Frontend programming |
| JSX | React component syntax |
| Vite | Frontend development server and build tool |
| Vanilla CSS | Styling |
| React Context API | Authentication/session state |
| React Router | Client-side routing |

---

## Project Architecture

The documented application follows a 3-tier architecture:

```text
                    USER / BROWSER
                          |
                          v
              +-----------------------+
              |      React 18         |
              |     Vite + JSX        |
              |  React Router         |
              |  Auth Context         |
              +-----------+-----------+
                          |
                    HTTP / JSON
                          |
                          v
              +-----------------------+
              |    Spring Boot API    |
              |                       |
              |  Controllers          |
              |  Services             |
              |  Spring Security       |
              |  JWT Authentication   |
              |  JPA / Hibernate       |
              +-----------+-----------+
                          |
                          v
              +-----------------------+
              |       Database        |
              |                       |
              |   H2 / MySQL          |
              +-----------------------+
```

---

## Repository Structure

### Backend currently included in this ZIP

```text
expanse/
├── .mvn/
│   └── wrapper/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── expanse/
│   │   │       └── ExpanseApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── expanse/
│               └── ExpanseApplicationTests.java
├── .gitattributes
├── .gitignore
├── HELP.md
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

### Documented full-stack structure

The project documentation describes the following frontend structure:

```text
project/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/settribe/expensetracker/
│           │       ├── config/
│           │       ├── controller/
│           │       ├── model/
│           │       ├── repository/
│           │       ├── service/
│           │       └── exception/
│           └── resources/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Dashboard.jsx
│       ├── components/
│       │   ├── TransactionModal.jsx
│       │   └── SpendingBreakdown.jsx
│       ├── utils/
│       │   └── api.js
│       └── index.css
│
└── queries.sql
```

---

## Backend API

The documented REST API uses:

```text
http://localhost:8080
```

### Authentication

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |

### Transactions

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| GET | `/api/transactions` | Yes | List transactions |
| POST | `/api/transactions` | Yes | Create transaction |
| PUT | `/api/transactions/{id}` | Yes | Update transaction |
| DELETE | `/api/transactions/{id}` | Yes | Delete transaction |
| GET | `/api/transactions/summary` | Yes | Income, expense and balance totals |

Protected requests use:

```text
Authorization: Bearer <token>
```

---

## Database

The documented project supports two database configurations:

### H2

Used for development/demo purposes.

```text
H2 Database
In-memory database
```

### MySQL

Used as the production database.

```text
MySQL 8
Relational database
```

The documented database design contains:

### Users

```text
id
username
email
password
created_at
```

### Transactions

```text
id
title
amount
type
category
date
description
user_id
```

---

## Frontend

The documented React frontend uses **React 18 + Vite**.

### Main frontend pages

- Login
- Register
- Dashboard

### Frontend components

- Transaction Modal
- Spending Breakdown

### Frontend state

The documented application uses **React Context API** for authentication/session state.

### Routing

**React Router** is used for client-side navigation without a full page reload.

### API communication

The frontend communicates with the Spring Boot backend using HTTP requests and includes the JWT token in protected API requests.

### Frontend development server

The documented frontend runs at:

```text
http://localhost:5173
```

---

## Running the Backend

### Requirements

Install:

- Java 17+
- Git
- Maven (optional; Maven Wrapper is included)
- MySQL if using MySQL configuration

Check Java:

```bash
java -version
```

### Windows

From the project directory:

```bash
mvnw.cmd spring-boot:run
```

### macOS / Linux

```bash
./mvnw spring-boot:run
```

### Using installed Maven

```bash
mvn spring-boot:run
```

The backend is documented to run on:

```text
http://localhost:8080
```

---

## Building the Backend

Windows:

```bash
mvnw.cmd clean package
```

macOS / Linux:

```bash
./mvnw clean package
```

The generated JAR file will be created inside:

```text
target/
```

---

## Running Tests

Windows:

```bash
mvnw.cmd test
```

macOS / Linux:

```bash
./mvnw test
```

The uploaded backend currently includes a Spring Boot context-loading test.

---

## Running the Frontend

> The following commands are from the documented project setup. The current uploaded ZIP does not contain the `frontend/` source directory.

From the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The documented frontend URL is:

```text
http://localhost:5173
```

---

## Development Workflow

Run the backend in one terminal:

```bash
cd backend
mvn spring-boot:run
```

Run the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## Security

The documented application uses:

- Spring Security
- JWT authentication
- BCrypt password hashing
- Protected API routes
- Ownership checks for transactions
- Backend and frontend input validation

### Important

Never upload these to GitHub:

```text
database passwords
JWT secrets
API keys
private credentials
.env files containing secrets
```

Use environment variables or local configuration for sensitive values.

---

## Current Repository Status

### Included in the uploaded ZIP

- Spring Boot application
- Maven configuration
- Spring Data JPA dependency
- Spring Security dependency
- Validation dependency
- Spring Web MVC dependency
- MySQL Connector/J
- Maven Wrapper
- Basic Spring Boot test

### Documented but not included in the uploaded ZIP

- React frontend source code
- Vite configuration
- React pages/components
- Frontend package.json
- Frontend API utility
- Full transaction controllers/services/entities/repositories
- SQL assessment file

These items are included in this README because they are part of the project's provided documentation, but they should only be added to the GitHub repository when their actual source files are available.

---

## GitHub Upload

After extracting the project, initialize Git:

```bash
git init
```

Add all files:

```bash
git add .
```

Create the first commit:

```bash
git commit -m "Initial commit"
```

Add your GitHub repository:

```bash
git remote add origin https://github.com/YOUR-USERNAME/expanse.git
```

Push the project:

```bash
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## Author

**Rishi**

GitHub: `https://github.com/RishiVG91`

---

## License

No open-source license is currently specified for this project.

If you want others to legally reuse, modify, and distribute the project, add an appropriate `LICENSE` file.
