# Angular Frontend MVP - Migration Guide

## Current Status

The Angular frontend MVP is currently using a **mock backend service** to simulate Django API responses. This allows development and testing of the frontend while the Django backend is being developed.

## Architecture Overview

### Current Setup (Mock Backend)
- **Mock Service**: `frontend/src/app/auth/mock-backend.service.ts`
- **Auth Service**: Uses `MockBackendService` for login, register, and logout operations
- **In-Memory Storage**: Mock users are stored in memory (not persisted)
- **Authentication**: Simulated JWT tokens stored in localStorage

### Components
1. **Landing Page** (`/`) - Unauthenticated users see welcome page with feature highlights
2. **Login Page** (`/login`) - Mock authentication with username: `testuser`, password: `password123`
3. **Register Page** (`/registrieren`) - Mock registration (creates in-memory users)
4. **Games Page** (`/games`) - Protected route, only accessible when authenticated
5. **Burger Menu** - Appears when authenticated, provides navigation to Games page

## Migration to Django Backend

When the Django backend is ready, follow these steps:

### 1. Backend Requirements

Your Django backend should provide these endpoints:

```
POST /user/login
Request: { username: string, password: string }
Response: { access: string, refresh: string, id: string }

POST /user/register
Request: { username: string, email: string, password: string }
Response: { message: string, id: string }

POST /user/logout
Request: { id: string }
Response: { message: string }

POST /user/refresh_token/
Request: { refresh: string }
Response: { access: string }
```

### 2. Update Auth Service

Open `frontend/src/app/auth/auth.service.ts` and:

1. **Remove MockBackendService injection** from the constructor
2. **Uncomment HTTP calls** in the following methods:
   - `register()`
   - `login()`
   - `logout()`
   - `refreshAccessToken()`
3. **Remove mock backend calls** (lines using `this.mockBackend`)

Example for `login()` method:
```typescript
// BEFORE (Mock):
login(userName: string, password: string): Observable<any> {
  return this.mockBackend.login(userName, password);
}

// AFTER (Django):
login(userName: string, password: string): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/login`,
    { username: userName, password: password },
    {
      observe: 'response',
      responseType: 'json',
    }
  );
}
```

### 3. Update Environment Configuration

Update `frontend/src/environment/environment.ts`:

```typescript
export const environment = {
  apiUrl: 'http://your-django-backend-url:8000', // Update with your Django URL
};
```

### 4. Update JWT Configuration

In `frontend/src/app/app.module.ts`, update the JWT configuration:

```typescript
JwtModule.forRoot({
  config: {
    tokenGetter,
    allowedDomains: ['your-django-backend-url:8000'], // Update with your Django domain
    disallowedRoutes: ['http://your-django-backend-url:8000/api/token/'],
  },
}),
```

### 5. Test Error Handling

Verify that Django error responses match the expected format:
- `'userNameNotRegistered'` - Username doesn't exist
- `'passwordOrUserNameWrong'` - Invalid credentials
- `'Email already exists'` - Email already registered
- `'Username already exists'` - Username already taken

If Django uses different error messages, update the error handling in:
- `frontend/src/app/features/user-management/login/login.component.ts`
- `frontend/src/app/features/user-management/account-creation/account-creation.component.ts`

### 6. Remove Mock Backend Service (Optional)

Once everything is working with the Django backend, you can optionally remove:
- `frontend/src/app/auth/mock-backend.service.ts`

### 7. CORS Configuration

Ensure your Django backend has CORS configured to allow requests from your Angular frontend:

```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",  # Angular dev server
    # Add production URLs as needed
]
```

## Testing

### Test Mock Backend (Current)
1. Start the Angular dev server: `npm start`
2. Navigate to `http://localhost:4200`
3. Login with username: `testuser`, password: `password123`
4. Or register a new account
5. Verify access to Games page after login

### Test Django Backend (After Migration)
1. Ensure Django backend is running
2. Update environment configuration
3. Update AuthService (steps above)
4. Build and test: `npm run build`
5. Test login/register/logout flows
6. Verify JWT token refresh works correctly

## Notes

- The mock backend simulates a 500ms network delay for realistic testing
- Mock tokens expire after 1 hour (matching JWT configuration)
- Session timeout is set to 30 minutes of inactivity
- Auth guard protects the `/games` route and redirects to login if not authenticated

## Support

For issues during migration, check:
1. Browser console for errors
2. Network tab for API request/response details
3. Django backend logs for server-side errors
