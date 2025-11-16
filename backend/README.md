# Backend - Django Application

This is the Django backend for the rempo application.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file based on `.env.example` and configure your environment variables.

3. Run database migrations:
```bash
python manage.py migrate
```

4. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

5. Run the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`.

## Production Deployment

For production deployment, use Gunicorn:
```bash
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

## Environment Variables

See `.env.example` for required environment variables. Key variables include:
- `SECRET_KEY`: Django secret key (generate a new one for production)
- `DEBUG`: Set to False in production
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DB_*`: Database connection settings (stored externally)
- `CORS_ALLOWED_ORIGINS`: Frontend URLs that can access the API
