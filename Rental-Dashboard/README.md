# 🚀 NitroWebStudios — Car Rental & Analytics Dashboard

An enterprise-grade, full-stack administrative dashboard built for managing multi-tenant vehicle inventory, tracking user engagement, and streamlining database operations. Built with a modern **PERN/MERN-style (MySQL, Express, React, Node)** architecture, this platform is optimized for low-latency client rendering, real-time analytics, and secure session management.

---

## 📋 Table of Contents
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [API Reference](#-api-reference)
- [Production Deployment](#-production-deployment)
- [Security & Optimization](#-security--optimization)

---

## 🌟 Key Features

### 📊 Real-Time Analytics & Reporting
- **Top Performing Fleet:** Track high-demand vehicle models, reservation trends, and revenue distribution across categories.
- **Dynamic Product Filtering:** Filter metrics by timeframe, location, and product tier.

### 🚗 Vehicle & Fleet Management
- **Inventory CRUD Operations:** Add, update, and audit vehicle availability, maintenance schedules, and pricing matrices.
- **Binary Image Handling:** Integrated media uploading with optimized asset serving.

### 🔒 Enterprise Security & Auth
- **Session-Based Authentication:** Cookie-based HTTP-only session handshakes (`withCredentials`) across client and backend instances.
- **Database Backup & Stream Downloads:** Secure binary file (`Blob`) streaming for one-click SQL database backups directly from the administrative UI.
- **Role-Based Access Control (RBAC):** Protect endpoints and administrative panels from unauthorized requests.

### 🛡️ Production & Infrastructure Ready
- **Multi-Tenant / Subdomain Ready:** Engineered to run via Nginx Server Blocks for multi-site hosting (e.g., `portfolio.domain.com` or `dealership.domain.com`).
- **Memory-Tuned Node Process Control:** Pre-configured PM2 process monitoring with `--max-memory-restart` guards to safely run in resource-constrained environments (e.g., 1–2 GB RAM Droplets).

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **React.js** (Vite / ESBuild bundler)
- **Axios Client:** Centralized HTTP instance with automatic header injection and session cookie propagation.
- **CSS / UI Components:** Modern responsive dashboard design.

### **Backend**
- **Node.js & Express.js:** RESTful API architecture handling routing, middleware, and stream management.
- **MySQL:** Relational database management using optimized queries and `mysql_native_password` authentication compatibility.

### **Server & Infrastructure**
- **Nginx:** Reverse proxy handling SSL termination, static file serving, and route delegation.
- **PM2:** Node process manager running under fork execution mode.
- **Ubuntu Linux + DigitalOcean Cloud Firewall & UFW:** Hardened network ports (`80`, `443`, `22`).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `v22.x` or `v24.x` (LTS recommended)
- **MySQL Server:** `8.0+`
- **npm:** `v10+`

### 1. Clone the Repository
```bash
git clone -b master [https://github.com/Computer4062/NitroWebStudios.git](https://github.com/Computer4062/NitroWebStudios.git)
cd NitroWebStudios

### 2. ⚙️ Environment Configuration
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rental_dashboard_db
SESSION_SECRET=your_jwt_or_session_secret

### 3. ☁️ Production Deployment
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/my-app/frontend/dist;
    index index.html;

    location / {
        try_files $uri$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

cd /var/www/my-app/backend
pm2 start index.js --name "stock-backend" --max-memory-restart 150M
pm2 save
