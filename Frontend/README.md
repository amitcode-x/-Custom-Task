# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



# -Custom-Task


# Sales Order & Inventory Management System

## Project Overview

This project is a simplified **Sales Order & Inventory Management System** built as part of a fresher developer assignment.
The system allows administrators to manage products, inventory, and dealers, while supporting order creation, stock validation, and order lifecycle management.

The goal of this project was to demonstrate:

* Relational database design
* Clean Django REST API development
* Business rule implementation
* Basic frontend integration using React

---

## Features Implemented

### Product Management

* Create, update, delete products
* Unique SKU validation
* Product listing with stock information

### Dealer Management

* Add and manage dealers
* View dealer details and associated orders

### Inventory Management

* Track stock per product
* Manual inventory adjustment
* Stock automatically deducted when orders are confirmed

### Order Management

* Create draft orders
* Add multiple order items
* Order status flow:

  * Draft → Confirmed → Delivered
* Stock validation prevents over-ordering
* Stock deduction on confirmation
* Stock restoration on confirmed order deletion

### Reports

* Dashboard summary:

  * Total orders
  * Draft / Confirmed / Delivered counts
  * Total revenue

### Frontend (Bonus)

* React-based admin dashboard
* Product, dealer, inventory, and order management UI

---

## Tech Stack

**Backend**

* Python 3
* Django
* Django REST Framework
* PostgreSQL

**Frontend**

* React (Vite)
* Axios
* Tailwind CSS

**Other Tools**

* Git & GitHub
* Postman (API testing)

---

## Project Structure

```
backend/
  config/
  core/
  requirements.txt

frontend/
  src/
    pages/
    components/
    api/

README.md
```

---

## Setup Instructions

### Backend Setup

1. Clone repository

```
git clone <repo-url>
cd backend
```

2. Create virtual environment

```
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies

```
pip install -r requirements.txt
```

4. Create `.env` file in backend root

Example:

```
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=vikmo_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

5. Apply migrations

```
python manage.py migrate
```

6. Run server

```
python manage.py runserver
```

---

### Frontend Setup

1. Navigate to frontend

```
cd frontend
```

2. Install dependencies

```
npm install
```

3. Run frontend

```
npm run dev
```

---
### Frontend (Bonus)

* React-based admin dashboard
* Advanced and attractive UI using **Glassmorphism design**
* Fully responsive layout optimized for:

  * Desktop / Laptop
  * Tablets
  * Mobile phones
* Clean and user-friendly interface for managing:

  * Products
  * Dealers
  * Inventory
  * Orders
* Dashboard with reporting and statistics

* The UI was designed focusing on usability, modern design principles, and responsiveness to simulate a real-world SaaS admin panel.


## API Endpoints

### Products

* GET /api/products/
* POST /api/products/
* PUT /api/products/{id}/
* DELETE /api/products/{id}/

### Dealers

* GET /api/dealers/
* POST /api/dealers/
* GET /api/dealers/{id}/

### Orders

* GET /api/orders/
* POST /api/orders/
* PUT /api/orders/{id}/
* POST /api/orders/{id}/confirm/
* POST /api/orders/{id}/deliver/

### Inventory

* GET /api/inventory/
* PUT /api/inventory/{id}/adjust/

### Reports

* GET /api/orders/report/

---

## Business Rules Implemented

* Stock validation before confirming orders
* Atomic transactions during stock deduction
* Order status flow enforced
* Draft orders editable only
* Confirmed/Delivered orders locked
* Line total and order total auto-calculated
* Unique order number auto-generated

---

## Assumptions Made

* Each product has one inventory record
* Inventory adjustments do not affect confirmed orders
* Orders are managed by admin (authentication not implemented in this demo)

---

## Future Improvements

* Authentication and role-based access
* Audit log for inventory changes
* Pagination and search filters
* Docker setup

---

## Author

Amit Chauhan
Full Stack Developer (Python Django + React)
