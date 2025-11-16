# Contributing to Rempo

Thank you for considering contributing to Rempo! This document provides guidelines for contributing to the project.

## Code of Conduct

Please be respectful and considerate in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in GitHub Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Python/Node version, etc.)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue describing:
   - The problem the feature would solve
   - Proposed solution
   - Alternative solutions considered

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes following the coding standards below
4. Write or update tests as needed
5. Ensure all tests pass
6. Commit with clear, descriptive messages
7. Push to your fork
8. Submit a pull request

## Development Setup

See [QUICKSTART.md](QUICKSTART.md) for quick setup instructions.

## Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use meaningful variable and function names
- Write docstrings for functions and classes
- Keep functions focused and single-purpose
- Use type hints where appropriate

Example:
```python
def calculate_total(items: list[dict]) -> float:
    """
    Calculate the total price of items.
    
    Args:
        items: List of item dictionaries with 'price' key
        
    Returns:
        Total price as float
    """
    return sum(item['price'] for item in items)
```

### TypeScript (Frontend)

- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful component and service names
- Keep components focused and reusable
- Use RxJS observables for async operations

Example:
```typescript
export class UserService {
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/`);
  }
}
```

## Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Documentation

- Update README.md if adding new features
- Update API documentation for new endpoints
- Add comments for complex logic
- Keep documentation up-to-date with code changes

## Commit Messages

Use clear, descriptive commit messages:

- Use present tense: "Add feature" not "Added feature"
- Start with a verb: "Fix", "Add", "Update", "Remove"
- Keep first line under 72 characters
- Add details in the body if needed

Good examples:
```
Add user authentication endpoint
Fix CORS configuration for production
Update deployment documentation
```

## Review Process

1. All pull requests require review
2. Address review comments promptly
3. Keep pull requests focused on single features/fixes
4. Ensure CI/CD checks pass

## Questions?

Feel free to ask questions by:
- Opening an issue
- Reaching out to maintainers
- Checking existing documentation

Thank you for contributing to Rempo!
