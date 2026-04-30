# Employee Management System — Backend

REST API for the Employee Management System built with Node.js, Express, and MySQL.

## Features

- Full CRUD API for employee management
- MySQL database with connection pooling
- Environment-based configuration with dotenv
- CORS enabled for frontend integration

## Tech Stack

- Node.js
- Express
- MySQL2
- dotenv
- cors
- nodemon

## Getting Started

### Prerequisites
- Node.js v18+
- MySQL

### Installation

```bash
git clone https://github.com/SnobbishKick/employee-management-backend.git
cd employee-management-backend
npm install
```

Create a `.env` file in the root:

Then run:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get single employee |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

## Database Schema

```sql
CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role VARCHAR(50),
  status ENUM('active', 'inactive'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Frontend

[employee-management-frontend](https://github.com/SnobbishKick/employee-management-frontend)
