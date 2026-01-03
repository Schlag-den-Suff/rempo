# Authentication API

This Django app provides JWT-based authentication endpoints for user registration, login, logout, and user management.

## Endpoints

### 1. Register User
**POST** `/api/auth/register/`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Username already exists"
}
```

---

### 2. Login
**POST** `/api/auth/login/`

Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 3. Logout
**POST** `/api/auth/logout/`

Logout user by blacklisting refresh token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

### 4. Get User Info
**GET** `/api/auth/user/`

Get current authenticated user's information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "",
  "last_name": ""
}
```

---

### 5. Refresh Token
**POST** `/api/auth/token/refresh/`

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## JWT Configuration

The JWT tokens are configured with the following settings:

- **Access Token Lifetime**: 60 minutes
- **Refresh Token Lifetime**: 7 days
- **Algorithm**: HS256
- **Header Type**: Bearer

## Usage Examples

### Using cURL

#### Register
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securePassword123"
  }'
```

#### Get User Info
```bash
curl -X GET http://localhost:8000/api/auth/user/ \
  -H "Authorization: Bearer <your_access_token>"
```

#### Refresh Token
```bash
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "<your_refresh_token>"
  }'
```

### Using JavaScript/TypeScript (Angular)

```typescript
// Register
register(username: string, email: string, password: string) {
  return this.http.post(`${this.apiUrl}/auth/register/`, {
    username,
    email,
    password
  });
}

// Login
login(username: string, password: string) {
  return this.http.post(`${this.apiUrl}/auth/login/`, {
    username,
    password
  });
}

// Get User Info
getUserInfo() {
  return this.http.get(`${this.apiUrl}/auth/user/`, {
    headers: {
      Authorization: `Bearer ${this.getAccessToken()}`
    }
  });
}

// Refresh Token
refreshToken(refreshToken: string) {
  return this.http.post(`${this.apiUrl}/auth/token/refresh/`, {
    refresh: refreshToken
  });
}
```

## Authentication Flow

1. **Registration/Login**: User registers or logs in and receives both access and refresh tokens
2. **API Requests**: Include access token in Authorization header for protected endpoints
3. **Token Expiration**: When access token expires (after 60 minutes), use refresh token to get new access token
4. **Logout**: Send refresh token to logout endpoint to blacklist it

## Security Considerations

1. **Store tokens securely**: Use HttpOnly cookies or secure storage (not localStorage for production)
2. **HTTPS only**: Always use HTTPS in production
3. **Validate on backend**: All protected endpoints validate JWT tokens
4. **Token refresh**: Implement automatic token refresh before expiration
5. **Logout properly**: Always call logout endpoint to blacklist refresh token

## Frontend Integration

To integrate with the Angular frontend:

1. Create an auth service that handles registration, login, logout
2. Store tokens securely (consider using HTTP-only cookies)
3. Add an HTTP interceptor to automatically attach access token to requests
4. Implement token refresh logic before token expiration
5. Handle 401 responses by refreshing token or redirecting to login

Example auth service structure:
```typescript
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  
  register(data: RegisterData): Observable<AuthResponse> { }
  login(data: LoginData): Observable<AuthResponse> { }
  logout(): Observable<any> { }
  refreshToken(): Observable<TokenRefreshResponse> { }
  getUserInfo(): Observable<User> { }
  isAuthenticated(): boolean { }
}
```

## Testing

Run tests for the auth API:

```bash
cd backend
python manage.py test auth_api
```

## Database Requirements

This app uses Django's built-in User model, so no custom migrations are needed. Just run:

```bash
python manage.py migrate
```

## Dependencies

- Django >= 5.2
- djangorestframework >= 3.16
- djangorestframework-simplejwt >= 5.3

All dependencies are included in `requirements.txt`.
