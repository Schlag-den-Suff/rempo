# rempo

A monorepo application with Angular frontend and Django backend.

## Project Structure

```
rempo/
├── frontend/          # Angular TypeScript application
├── backend/           # Django Python application
├── .github/
│   └── workflows/     # CI/CD pipelines
└── README.md
```

## Tech Stack

### Frontend
- **Framework**: Angular 20+
- **Language**: TypeScript
- **Build Tool**: Angular CLI

### Backend
- **Framework**: Django 5.2+
- **Language**: Python 3.12+
- **API**: Django REST Framework
- **WSGI Server**: Gunicorn

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- Python 3.12+
- pip

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:4200`.

See [frontend/README.md](frontend/README.md) for more details.

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
python manage.py migrate
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`.

See [backend/README.md](backend/README.md) for more details.

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example`:

- `SECRET_KEY`: Django secret key (generate a new one for production)
- `DEBUG`: Set to `False` in production
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DB_ENGINE`: Database engine (default: sqlite3)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host (external location)
- `DB_PORT`: Database port
- `CORS_ALLOWED_ORIGINS`: Frontend URLs that can access the API

### Frontend Environment Variables

Environment files are in `frontend/src/environments/`:
- `environment.ts`: Development configuration
- `environment.prod.ts`: Production configuration

Set `API_URL` environment variable during build to configure the backend API endpoint.

## Database and Data Storage

The application is designed to use an **external database** located separately from the application code:

1. Configure database connection in `backend/.env`
2. Database can be PostgreSQL, MySQL, or any Django-supported database
3. Run migrations: `python manage.py migrate`

## CI/CD Pipeline

The repository includes a GitHub Actions workflow that:

1. **Builds** both frontend and backend
2. **Tests** the backend
3. **Deploys** to your server when pushed to `main` branch

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

- `SERVER_HOST`: Your server hostname or IP
- `SERVER_USER`: SSH username
- `SERVER_PORT`: SSH port (default: 22)
- `SSH_PRIVATE_KEY`: SSH private key for authentication
- `DEPLOY_PATH`: Path to deployment directory on server
- `SECRET_KEY`: Django secret key
- `API_URL`: Backend API URL for frontend build

### Deployment Workflow

The workflow automatically:
1. Checks out code
2. Sets up Node.js and Python environments
3. Installs dependencies
4. Builds frontend
5. Runs backend tests
6. Deploys to server via SSH
7. Restarts services (Gunicorn for backend, Nginx for frontend)

See [.github/workflows/deploy.yml](.github/workflows/deploy.yml) for details.

## Production Deployment

### Server Requirements

- Ubuntu/Debian Linux server
- Nginx (for serving frontend)
- Gunicorn (for running Django backend)
- Python 3.12+
- Node.js 20+
- PostgreSQL or other database (external)

### Manual Deployment Steps

1. **Clone repository on server**:
   ```bash
   git clone <repository-url>
   cd rempo
   ```

2. **Set up backend**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with production settings
   python manage.py collectstatic
   python manage.py migrate
   ```

3. **Set up Gunicorn systemd service**:
   Create `/etc/systemd/system/gunicorn.service`

4. **Build and deploy frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

5. **Configure Nginx**:
   - Serve frontend from `frontend/dist/`
   - Proxy `/api/` requests to Gunicorn

6. **Start services**:
   ```bash
   sudo systemctl start gunicorn
   sudo systemctl start nginx
   ```

## Development Workflow

1. Make changes to frontend or backend
2. Test locally
3. Commit and push to a feature branch
4. Create pull request
5. Merge to `main` to trigger automatic deployment

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
python manage.py test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Add your license here]
