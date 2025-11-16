# Deployment Guide

This guide provides detailed instructions for deploying the rempo application to a production server.

## Prerequisites

- Ubuntu 20.04+ or Debian 11+ server
- Root or sudo access
- Domain name (optional but recommended)

## Initial Server Setup

### 1. Update system packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install required packages

```bash
sudo apt install -y python3 python3-pip python3-venv nginx git
```

### 3. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 4. Install PostgreSQL (if using external database)

Skip this if your database is on a separate server.

```bash
sudo apt install -y postgresql postgresql-contrib
```

## Application Deployment

### 1. Create deployment user

```bash
sudo adduser --system --group --home /opt/rempo rempo
```

### 2. Clone repository

```bash
sudo -u rempo git clone https://github.com/Schlag-den-Suff/rempo.git /opt/rempo/app
cd /opt/rempo/app
```

### 3. Set up backend

```bash
cd /opt/rempo/app/backend

# Create virtual environment
python3 -m venv /opt/rempo/venv
source /opt/rempo/venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
sudo nano .env  # Edit with production settings
```

#### Backend .env configuration

```ini
SECRET_KEY=<generate-secure-random-key>
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Database (external location)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=rempo_db
DB_USER=rempo_user
DB_PASSWORD=<secure-password>
DB_HOST=<external-db-host>
DB_PORT=5432

CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

Generate a secure SECRET_KEY:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

#### Run migrations

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

#### Create superuser (optional)

```bash
python manage.py createsuperuser
```

### 4. Set up frontend

```bash
cd /opt/rempo/app/frontend
npm install
npm run build -- --configuration production
```

## Configure Gunicorn

### 1. Create Gunicorn systemd service

```bash
sudo nano /etc/systemd/system/gunicorn.service
```

Add the following content:

```ini
[Unit]
Description=Gunicorn daemon for rempo backend
After=network.target

[Service]
Type=notify
User=rempo
Group=rempo
RuntimeDirectory=gunicorn
WorkingDirectory=/opt/rempo/app/backend
Environment="PATH=/opt/rempo/venv/bin"
ExecStart=/opt/rempo/venv/bin/gunicorn \
    --config gunicorn.conf.py \
    backend.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

### 2. Start and enable Gunicorn

```bash
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl status gunicorn
```

## Configure Nginx

### 1. Create Nginx configuration

```bash
sudo nano /etc/nginx/sites-available/rempo
```

Add the following content:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /opt/rempo/app/frontend/dist/frontend/browser;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files for Django
    location /static/ {
        alias /opt/rempo/app/backend/staticfiles/;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 2. Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/rempo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Configuration (Recommended)

### Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain SSL certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

## GitHub Actions Setup

### 1. Generate SSH key pair

On your local machine:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions
```

### 2. Add public key to server

```bash
ssh-copy-id -i ~/.ssh/github-actions.pub rempo@your-server
```

### 3. Configure GitHub Secrets

In your GitHub repository, go to Settings → Secrets and variables → Actions, and add:

- `SERVER_HOST`: your-server-ip-or-domain
- `SERVER_USER`: rempo
- `SERVER_PORT`: 22
- `SSH_PRIVATE_KEY`: (paste contents of ~/.ssh/github-actions private key)
- `DEPLOY_PATH`: /opt/rempo/app
- `SECRET_KEY`: (your Django secret key)
- `API_URL`: https://your-domain.com/api

### 4. Test deployment

Push to main branch and check GitHub Actions workflow.

## Maintenance

### View logs

```bash
# Gunicorn logs
sudo journalctl -u gunicorn -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart services

```bash
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

### Manual deployment

```bash
cd /opt/rempo/app
sudo -u rempo git pull origin main

# Backend
cd backend
source /opt/rempo/venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart gunicorn

# Frontend
cd ../frontend
npm ci
npm run build -- --configuration production
sudo systemctl restart nginx
```

## Troubleshooting

### Gunicorn won't start

Check logs:
```bash
sudo journalctl -u gunicorn -n 50
```

Common issues:
- Wrong Python path in systemd service
- Missing dependencies
- Database connection issues

### Nginx returns 502 Bad Gateway

- Check if Gunicorn is running: `sudo systemctl status gunicorn`
- Check firewall settings
- Verify proxy_pass URL in Nginx config

### Frontend not loading

- Check Nginx error logs
- Verify build output path in Nginx config
- Ensure frontend was built successfully

### Database connection errors

- Verify database credentials in .env
- Check database server is accessible
- Ensure database exists and user has permissions

## Security Checklist

- [ ] Set DEBUG=False in production
- [ ] Use strong SECRET_KEY
- [ ] Configure ALLOWED_HOSTS
- [ ] Use HTTPS (SSL certificate)
- [ ] Set up firewall (ufw or iptables)
- [ ] Keep database in separate secure location
- [ ] Use environment variables for secrets
- [ ] Regularly update dependencies
- [ ] Set up database backups
- [ ] Configure fail2ban for SSH protection
- [ ] Use strong passwords for all services
- [ ] Restrict file permissions

## Backup and Recovery

### Database backup

```bash
# PostgreSQL example
pg_dump -U rempo_user -h <db-host> rempo_db > backup.sql
```

### Application backup

```bash
tar -czf rempo-backup-$(date +%Y%m%d).tar.gz /opt/rempo/app
```

### Restore

```bash
# Restore database
psql -U rempo_user -h <db-host> rempo_db < backup.sql

# Restore application
tar -xzf rempo-backup-20241116.tar.gz -C /opt/rempo/
```

## Monitoring

Consider setting up:
- Application monitoring (e.g., Sentry)
- Server monitoring (e.g., Prometheus, Grafana)
- Uptime monitoring (e.g., UptimeRobot)
- Log aggregation (e.g., ELK stack)

## Support

For issues and questions:
- Check logs first
- Review GitHub Issues
- Consult Django and Angular documentation
