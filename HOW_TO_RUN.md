# Chess Academy — How to Run

A complete guide for running the Chess Academy locally, with Docker, on a VPS, and on a custom domain.

---

## Table of Contents

1. [Local Development (No Docker)](#1-local-development-no-docker)
2. [Docker (Single Machine)](#2-docker-single-machine)
3. [Docker Compose (Recommended for VPS)](#3-docker-compose-recommended-for-vps)
4. [Deploying to a VPS (Ubuntu / Debian)](#4-deploying-to-a-vps-ubuntu--debian)
5. [Setting Up a Custom Domain + HTTPS](#5-setting-up-a-custom-domain--https)
6. [Environment Variables](#6-environment-variables)
7. [Data Storage](#7-data-storage)
8. [Updating the App](#8-updating-the-app)

---

## 1. Local Development (No Docker)

### Requirements
- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)

### Steps

```bash
# 1. Clone or download the project
git clone <your-repo-url> chess-academy
cd chess-academy

# 2. Install all dependencies
pnpm install

# 3. Start the API server (runs on port 3001 by default)
pnpm --filter @workspace/api-server run dev

# 4. In a new terminal, start the frontend
pnpm --filter @workspace/chess-academy run dev

# 5. Open your browser at:
#    http://localhost:5173
```

> **Note:** User data is saved to `artifacts/api-server/data/DATABASEUSER.JSON`
> and opening/progress data to `artifacts/api-server/data/DATABASE.JSON`.
> These files are created automatically on first run.

---

## 2. Docker (Single Machine)

### Dockerfile for the API Server

Create `artifacts/api-server/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY pnpm-workspace.yaml .
COPY package.json .
COPY pnpm-lock.yaml .
COPY shared/ ./shared/
COPY artifacts/api-server/ ./artifacts/api-server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build TypeScript
RUN pnpm --filter @workspace/api-server run build

# Data directory (will be a volume)
RUN mkdir -p /app/artifacts/api-server/data

EXPOSE 3001

CMD ["node", "artifacts/api-server/dist/index.js"]
```

### Dockerfile for the Frontend

Create `artifacts/chess-academy/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml .
COPY package.json .
COPY pnpm-lock.yaml .
COPY shared/ ./shared/
COPY artifacts/chess-academy/ ./artifacts/chess-academy/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/chess-academy run build

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/artifacts/chess-academy/dist /usr/share/nginx/html

# Nginx config for SPA routing
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
  location /api/ { proxy_pass http://api:3001; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
```

### Build and run manually:

```bash
# Build API
docker build -f artifacts/api-server/Dockerfile -t chess-api .

# Build Frontend
docker build -f artifacts/chess-academy/Dockerfile -t chess-web .

# Create a network
docker network create chess-net

# Run API (with data volume for persistence)
docker run -d \
  --name api \
  --network chess-net \
  -p 3001:3001 \
  -v chess_data:/app/artifacts/api-server/data \
  chess-api

# Run Frontend
docker run -d \
  --name web \
  --network chess-net \
  -p 80:80 \
  chess-web
```

---

## 3. Docker Compose (Recommended for VPS)

Create a `docker-compose.yml` in the project root:

```yaml
version: "3.9"

services:
  api:
    build:
      context: .
      dockerfile: artifacts/api-server/Dockerfile
    container_name: chess_api
    restart: unless-stopped
    environment:
      - PORT=3001
      - JWT_SECRET=change_this_to_a_strong_random_secret
      - NODE_ENV=production
    volumes:
      - chess_data:/app/artifacts/api-server/data
    networks:
      - chess_net

  web:
    build:
      context: .
      dockerfile: artifacts/chess-academy/Dockerfile
    container_name: chess_web
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
    networks:
      - chess_net

volumes:
  chess_data:

networks:
  chess_net:
```

```bash
# Start everything
docker compose up -d --build

# View logs
docker compose logs -f

# Stop everything
docker compose down
```

---

## 4. Deploying to a VPS (Ubuntu / Debian)

### Recommended VPS Providers
- **DigitalOcean** — Droplets from $6/month (2 GB RAM recommended)
- **Hetzner** — Very affordable European servers
- **Vultr** — Good worldwide coverage
- **Linode (Akamai)** — Reliable and well-documented

### Step 1: Provision a Server

Choose Ubuntu 22.04 LTS. Minimum spec: **1 vCPU, 1 GB RAM** (2 GB recommended for builds).

### Step 2: Initial Server Setup

```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Update packages
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose plugin
apt install docker-compose-plugin -y

# Create a non-root user (optional but recommended)
adduser deploy
usermod -aG docker deploy
usermod -aG sudo deploy
su - deploy
```

### Step 3: Copy Your Code to the Server

Option A — Git (recommended):
```bash
git clone https://github.com/your-user/chess-academy.git
cd chess-academy
```

Option B — SCP:
```bash
# From your local machine:
scp -r ./chess-academy root@YOUR_SERVER_IP:/home/deploy/
```

### Step 4: Launch the App

```bash
cd chess-academy
docker compose up -d --build
```

The app is now running on port 80 of your server's IP address.

---

## 5. Setting Up a Custom Domain + HTTPS

### Step 1: Point Your Domain to the Server

In your domain registrar's DNS settings, add an **A record**:

| Type | Name | Value           | TTL |
|------|------|-----------------|-----|
| A    | @    | YOUR_SERVER_IP  | 300 |
| A    | www  | YOUR_SERVER_IP  | 300 |

Wait 5–15 minutes for DNS propagation.

### Step 2: Install Certbot (Let's Encrypt — Free SSL)

```bash
apt install certbot python3-certbot-nginx -y
```

### Step 3: Update Nginx for Your Domain

Replace the nginx config in the frontend Dockerfile or create a standalone nginx on the host:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 4: Obtain SSL Certificate

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically edit your nginx config and enable HTTPS.

### Step 5: Auto-Renew SSL

Certificates expire every 90 days. Certbot sets up automatic renewal, but test it:

```bash
certbot renew --dry-run
```

---

## 6. Environment Variables

| Variable      | Default      | Description                              |
|---------------|--------------|------------------------------------------|
| `PORT`        | `3001`       | Port the API server listens on           |
| `JWT_SECRET`  | `chess-secret-key` | Secret key for signing auth tokens |
| `NODE_ENV`    | `development`| Set to `production` for deployments     |

> **Security Warning:** Always change `JWT_SECRET` in production to a long, random string.
> Generate one with: `openssl rand -base64 64`

Set these in your `docker-compose.yml` under `environment:`, or in a `.env` file:

```env
PORT=3001
JWT_SECRET=your_very_long_random_secret_here
NODE_ENV=production
```

---

## 7. Data Storage

All data is stored in plain JSON files — no database server required.

| File | Contents |
|------|----------|
| `data/DATABASEUSER.JSON` | Registered user accounts |
| `data/DATABASE.JSON` | Chess openings + user progress records |

### Backups

Backup your data with a simple cron job:

```bash
# Edit crontab
crontab -e

# Add this line to back up daily at 2 AM
0 2 * * * cp -r /home/deploy/chess-academy/data /home/deploy/backups/chess-data-$(date +\%Y\%m\%d)
```

### Restore

```bash
# Restore from backup
cp -r /home/deploy/backups/chess-data-20260314/* /home/deploy/chess-academy/data/
docker compose restart api
```

---

## 8. Updating the App

```bash
cd chess-academy

# Pull latest code
git pull origin main

# Rebuild and restart (zero-downtime swap with compose)
docker compose up -d --build

# Clean old unused images to free disk space
docker image prune -f
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start (dev) | `pnpm --filter @workspace/chess-academy run dev` |
| Start all (Docker) | `docker compose up -d` |
| Stop all | `docker compose down` |
| View logs | `docker compose logs -f` |
| Rebuild | `docker compose up -d --build` |
| Backup data | `cp -r data/ backups/` |
| Get SSL cert | `certbot --nginx -d yourdomain.com` |

---

*Built with ❤️ using React, Express, and chess.js*
