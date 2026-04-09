# 🌾 Agricart

## Web-Based Farmer-to-Retailer Trading Platform

Agricart is a full-stack web application developed to enable direct trading between farmers and retailers. The platform provides a digital marketplace where farmers can list their agricultural products and retailers can browse, place orders, and complete secure transactions without intermediaries.

---

## 🚀 Features

### 👨‍🌾 Farmer

* Add, update, and delete products
* Manage product price, quantity, and availability
* View orders placed by retailers
* Track sales and transactions

### 🛒 Retailer

* Browse available products
* Add items to cart
* Place and manage orders
* Make secure payments

### 🛠 Admin

* Monitor users (farmers & retailers)
* Track orders and transactions

---

## 🔐 Authentication & Security

* JWT-based authentication
* Role-based access control (Admin, Farmer, Retailer)
* Protected routes for secure access

---

## 💳 Payment Integration

* Razorpay (Test Mode)
* Secure transaction handling
* Order status updates after payment

---

## 🧰 Tech Stack

### Frontend

* React.js
* HTML, CSS, JavaScript
* Axios

### Backend

* Spring Boot (Java)
* REST APIs

### Database

* MySQL

### Tools & Utilities

* Postman (API Testing)
* Git & GitHub (Version Control)
* CORS Configuration

---

## 📂 Project Structure

agricart/
│── frontend/        # React application
│── backend/         # Spring Boot application
│── README.md

---

## ⚙️ Installation & Setup

### 1. Clone the repository

git clone https://github.com/your-username/agricart.git
cd agricart

---

### 2. Backend Setup (Spring Boot)

cd backend

Configure database settings in application.properties

Run the backend:
mvn spring-boot:run

---

### 3. Frontend Setup (React)

cd frontend
npm install
npm start

---

## 🔌 API Testing

All backend APIs were tested using Postman before integrating with the frontend.

---

## 📊 Key Functionalities

* User registration and login
* Product listing and management
* Cart and order system
* Payment processing
* Transaction tracking
* Role-based dashboards

---

## ⚠️ Challenges Faced

* Role-based authentication and routing issues
* Frontend-backend integration (CORS configuration)
* Payment gateway testing in sandbox mode
* Managing order and transaction workflow

---

## 📚 Learnings

* Full-stack development using React and Spring Boot
* JWT authentication and authorization
* REST API design and testing
* Database schema design
* Debugging and integration handling

---

## 📌 Future Enhancements

* Real-time notifications
* Advanced analytics dashboard
* Mobile application support

---

## 👨‍💻 Author

Mukesh Kumar Kasireddy

---

## 📄 License

This project was developed as part of the Infosys Springboard Virtual Internship 6.0.
