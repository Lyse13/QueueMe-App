# QueueMe - A Comprehensive Queue Management System

## Project Description

QueueMe is a modern, scalable, and user-friendly queue management system designed to streamline customer flow and enhance service efficiency in various environments, such as retail stores, clinics, or government offices. It provides a robust solution for managing queues, users, and services with distinct roles for users, staff, and administrators.

## Features

### User Features:
*   Join a queue for a specific service.
*   View current position in the queue.
*   Receive real-time updates on queue status.
*   Cancel their queue entry.

### Staff Features:
*   View and manage assigned service queues.
*   Call the next customer in the queue.
*   Mark a service as completed or cancelled.
*   Pause and resume queue operations.
*   View personal performance statistics.

### Admin Features:
*   Full user management (create, edit, delete users; assign roles).
*   Service configuration (add, remove, edit services; set estimated times).
*   System monitoring (view all active queues, system-wide statistics, real-time queue lengths).
*   Reporting and data export for performance analysis.
*   System settings configuration (notification templates, SMS/email integration).

## Technologies Used

### Frontend:
*   **React.js:** A JavaScript library for building user interfaces.
*   **React Router:** For declarative routing in React applications.
*   **Axios:** Promise-based HTTP client for the browser and Node.js.
*   **HTML5 & CSS3:** For structuring and styling the web content.

### Backend:
*   **Node.js:** JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
*   **MySQL2:** MySQL client for Node.js, with a focus on performance.
*   **bcrypt.js:** Library for hashing passwords.
*   **jsonwebtoken (JWT):** For secure authentication and authorization.
*   **cors:** Node.js package for providing a Connect/Express middleware that can be used to enable CORS.

### Database:
*   **MySQL:** A popular open-source relational database management system.

### DevOps & Infrastructure:
*   **Docker:** For containerization of the application components.
*   **Docker Compose:** For defining and running multi-container Docker applications.
*   **Kubernetes:** For orchestrating and managing containerized applications in a clustered environment.
*   **Jenkins:** For Continuous Integration and Continuous Delivery (CI/CD) pipeline automation.
*   **Prometheus:** For monitoring and alerting.
*   **Grafana:** For data visualization and dashboarding.
*   **Ansible:** For automation of infrastructure provisioning and configuration management.

## Setup and Installation

### Prerequisites:
*   Node.js (v14 or higher) and npm
*   MySQL Server
*   Docker and Docker Compose
*   kubectl (for Kubernetes deployments)
*   A Kubernetes cluster (e.g., Minikube, Kind, or a cloud-managed cluster)

### 1. Clone the Repository:
```bash
git clone <your-repository-url>
cd queue-me
```

### 2. Database Setup:

Ensure your MySQL server is running. Create a database named `queue_me` and a user with access to it (e.g., `root` with password `lysette@21` as configured in `server/models/db.js`).

Then, execute the following SQL commands to create the necessary tables:

```sql
CREATE DATABASE IF NOT EXISTS queue_me;
USE queue_me;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM("user", "staff", "admin") DEFAULT "user",
    resetPasswordToken VARCHAR(255),
    resetPasswordExpires DATETIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    estimatedTime INT DEFAULT 15, -- Estimated time in minutes
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS queues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    ticketNumber VARCHAR(50) NOT NULL UNIQUE,
    status ENUM("waiting", "serving", "completed", "cancelled") DEFAULT "waiting",
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

### 3. Backend Setup:

```bash
cd server
npm install
```

### 4. Frontend Setup:

```bash
cd client
npm install
```

## Running the Application

### 1. Development Mode (Frontend & Backend Separately):

**Start Backend:**
```bash
cd server
npm start
```
(The backend will run on `http://localhost:3002`)

**Start Frontend:**
```bash
cd client
npm start
```
(The frontend will run on `http://localhost:3000`)

### 2. Using Docker Compose (Recommended for Local Development):

From the project root directory (`queue-me-project`):

```bash
docker-compose up --build
```
This will build the Docker images for both frontend and backend, and start all services including MySQL. The frontend will be accessible at `http://localhost:3000`.

### 3. Deploying to Kubernetes:

First, ensure you have a running Kubernetes cluster and `kubectl` configured to connect to it.

**Build and Push Docker Images:**
(Replace `your-docker-username` with your Docker Hub username)

```bash
docker build -f Dockerfile.server -t your-docker-username/queueme-backend:latest .
docker push your-docker-username/queueme-backend:latest

docker build -f Dockerfile.client -t your-docker-username/queueme-frontend:latest .
docker push your-docker-username/queueme-frontend:latest
```

**Apply Kubernetes Manifests:**

```bash
kubectl apply -f kubernetes/mysql-deployment.yaml
kubectl apply -f kubernetes/mysql-service.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/frontend-service.yaml
```

**Access the Application:**

To get the external IP/port for the frontend service:
```bash
kubectl get services frontend-service
```

## API Endpoints (Brief Overview)

### Authentication (`/api/auth`):
*   `POST /register`: User registration.
*   `POST /login`: User login.

### Queue Management (`/api/queue`):
*   `POST /join`: Join a queue.
*   `GET /status/:userId`: Get user's queue status.
*   `POST /leave`: Leave a queue.

### Admin API (`/api/admin` - Requires Admin Role):
*   `GET /users`: Get all users.
*   `POST /users`: Create a new user.
*   `PUT /users/:id`: Update user details.
*   `DELETE /users/:id`: Delete a user.
*   `GET /services`: Get all services.
*   `POST /services`: Create a new service.
*   `PUT /services/:id`: Update service details.
*   `DELETE /services/:id`: Delete a service.
*   `GET /queues`: Get all queue entries.
*   `GET /stats`: Get system-wide statistics.

### Staff API (`/api/staff` - Requires Staff or Admin Role):
*   `GET /queue/:serviceId`: Get queue for a specific service.
*   `POST /callNext/:serviceId`: Call the next customer.
*   `POST /complete/:queueEntryId`: Mark queue entry as completed.
*   `POST /pause/:serviceId`: Pause a service queue.
*   `POST /resume/:serviceId`: Resume a service queue.

## Testing

### Backend Tests:
```bash
cd server
npm test
```

### Frontend Tests:
```bash
cd client
npm test
```

## CI/CD

A `Jenkinsfile` is provided at the project root (`Jenkinsfile`) to define a CI/CD pipeline for automated building, testing, and deployment to Kubernetes. You will need a Jenkins instance configured to use this file.

## Monitoring

The backend exposes Prometheus metrics at `/metrics`. You can set up Prometheus to scrape these metrics and Grafana to visualize them for continuous monitoring of application health and performance.

## Configuration Management (Ansible)

Example Ansible playbooks are provided in the `ansible/` directory:
*   `install_dependencies.yml`: For installing system dependencies.
*   `deploy_application.yml`: For deploying the application to target servers.

## Project Structure

```
queue-me-project/
├── ansible/
│   ├── deploy_application.yml
│   └── install_dependencies.yml
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── __tests__/
│   │   └── App.js
│   ├── package.json
│   └── ...
├── kubernetes/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── mysql-deployment.yaml
│   └── mysql-service.yaml
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── package.json
│   └── ...
├── Dockerfile.client
├── Dockerfile.server
├── docker-compose.yml
└── Jenkinsfile
```


