# 🏢 Employee Management System

A full-stack Employee Management System built with Angular and Spring Boot.

## ✨ Features
- 👤 Employee CRUD (Add, Edit, Delete)
- 🖐️ Attendance Tracking (Check-in, Check-out, Absent)
- 🔐 Admin Authentication (Login/Logout)
- 🌍 Multi-language Support (English & Arabic)
- 🎨 Dark/Light Theme
- 📊 Dashboard with statistics
- ⚙️ Settings (Company name, Password, Language, Theme)

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21, TypeScript |
| Backend | Java Spring Boot 4.0 |
| Database | MySQL 8.0 |
| DevOps | Docker, Docker Compose |

## 🚀 Run with Docker (Recommended)

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Steps
```bash
# 1. Clone the repo
git clone https://github.com/your-username/employee-management-system.git

# 2. Navigate to project
cd employee-management-system

# 3. Run with Docker
docker-compose up --build
```

Open your browser at: **http://localhost:4200**

### Default Admin Credentials
- Email: `admin@company.com`
- Password: `admin123`

## 🖥️ Run Manually

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

## 📸 Screenshots

### Login Page
![Login](screenshots/login.png)

### Employees
![Employees](screenshots/employees.png)

### Attendance
![Attendance](screenshots/attendance.png)

### Settings
![Settings](screenshots/settings.png)

## 👩‍💻 Developer
Developed by **shrouk  Mohammed**