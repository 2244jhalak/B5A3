# B5A3 - Library Management API

## Project Overview

B5A3 is a RESTful API built with **Express.js**, **TypeScript**, and **MongoDB** for managing a library system.  
It allows management of books, borrowers, and borrowing transactions with proper validation and business logic enforcement.

This API supports:

- Creating, reading, updating, and deleting books and borrowers.
- Borrowing books only if copies are available.
- Returning books and updating availability.
- Aggregated reports for borrowed books.

---

## Features

- **Book Management:** CRUD operations for books with fields like title, author, genre, ISBN, copies, and availability.
- **Borrower Management:** Add and list borrowers.
- **Borrow/Return System:** Borrow books with quantity checks, return books to update copies.
- **Aggregation:** Borrow summary using MongoDB aggregation pipeline.
- **Type Safety:** Schema validation with TypeScript and Mongoose.
- **Error Handling:** Consistent API responses with proper status codes.

---

## Technology Stack

| Technology     | Purpose              |
|----------------|----------------------|
| Node.js        | Backend runtime      |
| Express.js     | API framework        |
| TypeScript     | Typed JavaScript     |
| MongoDB        | NoSQL database       |
| Mongoose       | ODM for MongoDB      |
| dotenv         | Environment config   |

---

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- MongoDB (local or cloud)
- Git

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/2244jhalak/B5A3.git
   cd B5A3
