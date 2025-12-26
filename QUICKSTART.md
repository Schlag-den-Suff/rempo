# Quick Start Guide

Get the rempo application up and running quickly.

## Prerequisites

- kubernetes

## Quick Setup

### 1. Clone the Repository

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
helm -n argocd upgrade argocd --install --create-namespace argo/argo-cd \
  --set global.domain=argocd.rd.localhost \
  --set configs.params.server\.insecure=true \
  --set server.ingress.enabled=true
  
kubectl get pods -n argocd
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
kubectl create namespace knowker-dev
kubectl create namespace knowker-prod
```

### 2. Start Backend

```bash
kubectl apply -f argocd/app-deployment-dev.yaml
kubectl apply -f argocd/app-deployment-prod.yaml

# Install dependencies
kubectl create secret docker-registry ghcr-pull-secret --docker-server=ghcr.io --docker-username=<github-username> --docker-password=<github-key> --docker-email=ffflllooo6@gmail.com -n knowker-prod

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

Backend will be running at `http://localhost:8000`

### 3. Start Frontend (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will be running at `http://localhost:4200`

## Test the Setup

1. Open your browser and navigate to `http://localhost:4200`
2. You should see the Angular welcome page
3. Test the backend API at `http://localhost:8000/api/health/`

## API Endpoints

The backend provides these default endpoints:

- `GET /api/health/` - Health check endpoint
- `GET /api/info/` - API information
- `GET /admin/` - Django admin panel (requires superuser)

## Next Steps

1. **Configure Environment Variables**: 
   - Copy `backend/.env.example` to `backend/.env`
   - Update with your database credentials and settings

2. **Set Up External Database**:
   - Configure PostgreSQL or your preferred database
   - Update `DB_*` variables in `.env`
   - Run migrations: `python manage.py migrate`

3. **Create Superuser**:
   ```bash
   cd backend
   python manage.py createsuperuser
   ```

4. **Configure Frontend API URL**:
   - For production, update `frontend/src/environments/environment.prod.ts`
   - Set your backend API URL

5. **Deploy to Production**:
   - Follow the detailed guide in [DEPLOYMENT.md](DEPLOYMENT.md)
   - Set up GitHub Actions secrets for CI/CD

## Common Commands

### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Collect static files
python manage.py collectstatic

# Run development server
python manage.py runserver

# Run production server
gunicorn backend.wsgi:application
```

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## Troubleshooting

### Backend won't start

- Check Python version: `python --version` (should be 3.12+)
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check database connection settings in `.env`

### Frontend won't start

- Check Node.js version: `node --version` (should be 20+)
- Delete `node_modules` and run `npm install` again
- Clear Angular cache: `rm -rf .angular/cache`

### CORS errors

- Ensure backend CORS settings include frontend URL
- Check `CORS_ALLOWED_ORIGINS` in `backend/.env`
- Default development setting allows `http://localhost:4200`

### Port already in use

- Backend: Change port with `python manage.py runserver 8001`
- Frontend: Change port with `ng serve --port 4201`

## Development Workflow

1. Create a new branch for your feature
2. Make changes to frontend and/or backend
3. Test locally
4. Commit changes
5. Push to GitHub
6. Create pull request
7. Merge to `main` for automatic deployment (if CI/CD is configured)

## Getting Help

- Check the main [README.md](README.md) for detailed information
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- See individual README files in `frontend/` and `backend/` directories
- Check Django documentation: https://docs.djangoproject.com/
- Check Angular documentation: https://angular.dev/

## Project Structure

```
rempo/
├── frontend/              # Angular application
│   ├── src/
│   │   ├── app/          # Application components
│   │   └── environments/ # Environment configurations
│   ├── package.json      # Node dependencies
│   └── angular.json      # Angular configuration
│
├── backend/              # Django application
│   ├── backend/          # Django project settings
│   ├── api/              # API endpoints
│   ├── requirements.txt  # Python dependencies
│   └── manage.py         # Django management script
│
├── .github/
│   └── workflows/        # CI/CD pipelines
│
├── README.md             # Main documentation
├── QUICKSTART.md         # This file
└── DEPLOYMENT.md         # Production deployment guide
```

## License

[Add your license here]
