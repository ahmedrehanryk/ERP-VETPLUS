# Gluon-like ERP

A minimal manufacturing-focused ERP with a React frontend and a Node.js backend.

## Prerequisites

-   Node.js (v18+)
-   npm (v8+)
-   MySQL

## Running the Application

The frontend and backend must be set up and run separately. The backend will serve the built frontend files.

### 1. Backend Setup

**a. Environment File:**

In the `/backend` directory, create a `.env` file by copying the example file:
```bash
cd backend
cp .env.example .env
```
You can then edit the `backend/.env` file to match your local database configuration.

**b. Database Setup:**

Create a MySQL database named `erp_db`. Then, from the `/backend` directory, import the schema:
```bash
mysql -u<user> -p<password> erp_db < schema.sql
```

**c. Install & Start:**

From the `/backend` directory:
```bash
npm install
npm start
```
The backend will be running on `http://localhost:8080`.

### 2. Frontend Setup

**a. Install & Build:**

In a new terminal, from the `/frontend` directory:
```bash
npm install
npm run build
```

### 3. View Application

Open your browser to [http://localhost:8080](http://localhost:8080).

### Development Notes

For frontend development, you can run `npm run dev` in the `/frontend` directory to start the Vite dev server. However, API calls will not work. To see frontend changes with live API data, you must rebuild the frontend (`npm run build`) and refresh your browser at `http://localhost:8080`.