# Complete GoDaddy Shared Hosting Deployment Guide for Bandhan Matrimony

This guide explains step-by-step how to deploy **Bandhan Matrimony** on your **GoDaddy cPanel Shared Hosting Plan** using **Python Flask**, **Node.js**, **MySQL**, and **Vite React**.

---

## 📋 Overview of GoDaddy Architecture

| Component | Technology | GoDaddy cPanel Service |
|---|---|---|
| **Frontend** | Vite React (Static Build) | Upload to `public_html/` |
| **Backend REST API** | Python Flask | cPanel **"Setup Python App"** (WSGI / Phusion Passenger) |
| **Realtime Service** | Node.js Express | cPanel **"Setup Node.js App"** (Phusion Passenger) |
| **Database** | MySQL / MariaDB | cPanel **MySQL Database Wizard** + **phpMyAdmin** |

---

## Step 1: Set up MySQL Database in cPanel

1. Log into your **GoDaddy cPanel**.
2. Under **Databases**, click **MySQL® Database Wizard**.
3. Create a new database named `shadi_matrimony` (Full name will be `yourusername_shadi_matrimony`).
4. Create a MySQL user (e.g. `shadi_user`) and generate a strong password.
5. Grant **ALL PRIVILEGES** to the user on `yourusername_shadi_matrimony`.
6. Open **phpMyAdmin** from cPanel home.
7. Select `yourusername_shadi_matrimony` database on the left menu.
8. Click **Import** -> Choose file `c:\shadi\backend_flask\database\schema.sql` -> Click **Go**.

---

## Step 2: Deploy Python Flask Backend API (Setup Python App)

1. Open **cPanel** -> Click **"Setup Python App"** (under Software section).
2. Click **Create Application**:
   - **Python Version**: `3.9` or `3.10` or higher
   - **Application root**: `backend_flask`
   - **Application URL**: `api/v1`
   - **Application startup file**: `passenger_wsgi.py`
   - **Application Entry point**: `application`
3. Click **Create**.
4. Upload all files inside `c:\shadi\backend_flask\` into your cPanel directory `backend_flask/`.
5. Update `app.py` with your GoDaddy database credentials:
   ```python
   DB_HOST = 'localhost'
   DB_USER = 'yourusername_shadi_user'
   DB_PASSWORD = 'YourStrongPasswordHere'
   DB_NAME = 'yourusername_shadi_matrimony'
   ```
6. In cPanel **Setup Python App**, copy the command to enter the virtual environment (shown at top of page, e.g. `source /home/username/nodevenv/backend_flask/...`).
7. Open **cPanel Terminal** or SSH, paste the command, and run:
   ```bash
   pip install -r requirements.txt
   ```
8. Click **Restart** on the Python App card in cPanel.

---

## Step 3: Deploy Node.js Microservice (Setup Node.js App)

1. Open **cPanel** -> Click **"Setup Node.js App"**.
2. Click **Create Application**:
   - **Node.js Version**: `18.x` or `20.x`
   - **Application Mode**: `Production`
   - **Application Root**: `backend_node`
   - **Application URL**: `api/node`
   - **Application startup file**: `passenger.js`
3. Upload files from `c:\shadi\backend_node\` into `backend_node/` folder on cPanel.
4. Click **Run NPM Install** inside the cPanel Node setup page.
5. Click **Restart**.

---

## Step 4: Deploy Frontend React Web App (`public_html`)

1. On your local machine, open terminal in `c:\shadi`:
   ```bash
   npm run build
   ```
2. This creates a `dist/` directory containing `index.html`, CSS, JS, and assets.
3. Zip the contents of `dist/` into `dist.zip`.
4. Open **cPanel File Manager** -> Navigate to `public_html/`.
5. Upload `dist.zip` and extract it into `public_html/`.
6. Create or edit `.htaccess` file inside `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # API Requests Proxy to Flask
  RewriteRule ^api/v1/(.*)$ http://127.0.0.1:5000/$1 [P,L]
  
  # API Requests Proxy to Node
  RewriteRule ^api/node/(.*)$ http://127.0.0.1:3000/$1 [P,L]

  # Single Page Application Routing
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🎯 Verification & Testing
1. Visit `https://yourdomain.com/` - Your Bandhan Matrimony frontend will load.
2. Test search filters, profile modal, Kundali 36 Guna calculator, express interest flow, and messaging.
3. Check Python API endpoint: `https://yourdomain.com/api/v1/health`
4. Check Node API endpoint: `https://yourdomain.com/api/node/health`
