# Digital CEO Avatar Development Rules and Standards

## Project Overview

This document establishes the development rules, standards, and best practices for the Digital CEO Avatar project. All team members must adhere to these guidelines to ensure consistent, high-quality code delivery.

## General Guidelines

1. **Communication First**: Always ask if there are any questions before proceeding to each subsequent step.
2. **Documentation**: Clearly document each change and iteration.
3. **Best Practices**: Adhere strictly to coding best practices, including:
   - SOLID principles
   - DRY (Don't Repeat Yourself)
   - KISS (Keep It Simple, Stupid)
   - YAGNI (You Aren't Gonna Need It)
4. **Monitoring**: Implement and maintain clear, comprehensive logging and monitoring.
5. **Code Quality**: Utilize linting, formatting, and syntax checking consistently:
   - Frontend: ESLint, Prettier
   - Backend: Black, isort, mypy

## Development Workflow

### 1. Git Workflow

- **Branching Strategy**: GitFlow or trunk-based (based on team size)
- **Branch Naming**:
  - Features: `feature/description-of-feature`
  - Fixes: `fix/description-of-fix`
  - Hotfixes: `hotfix/description-of-hotfix`
- **Commit Messages**:
  - Use conventional commits format
  - Example: `feat: add WebRTC audio streaming`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Pull Requests**:
  - Must pass all CI checks
  - Require at least one code review
  - Include comprehensive description and testing evidence

### 2. Test-Driven Development (TDD)

- **Write tests first** before implementing functionality
- **Coverage Requirements**:
  - Minimum 80% code coverage
  - Critical paths require 100% coverage
- **Test Types**:
  - Unit tests for all functions/methods
  - Integration tests for API endpoints
  - E2E tests for critical user flows

### 3. Code Style Guidelines

#### Frontend (React TypeScript)

```typescript
// Component structure
interface Props {
  // Always define prop types
}

export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Hooks at the top
  // Logic in the middle
  // Return JSX at the bottom
};

// File naming: PascalCase for components, camelCase for utilities
// Directory structure: components/ComponentName/ComponentName.tsx
```

#### Backend (Python/FastAPI)

```python
# Use type hints everywhere
from typing import Optional, List

# Pydantic models for validation
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    
# Async functions for I/O operations
async def get_user(user_id: int) -> Optional[User]:
    # Implementation
    pass

# Clear docstrings
def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculate semantic similarity between two texts.
    
    Args:
        text1: First text to compare
        text2: Second text to compare
        
    Returns:
        Similarity score between 0 and 1
    """
    pass
```

### 4. Architecture Guidelines

#### Frontend Architecture

- **Component Design**: Atomic Design methodology
- **State Management**: React Context + hooks for global state
- **API Communication**: Axios with interceptors for auth
- **Real-time**: WebRTC through custom hooks
- **Styling**: TailwindCSS with custom theme configuration

#### Backend Architecture

- **API Design**: RESTful with OpenAPI documentation
- **Database**: Repository pattern with SQLModel
- **Authentication**: JWT with refresh tokens
- **Background Tasks**: Celery for async processing
- **ML Pipeline**: Separate service layer for AI operations

### 5. Security Standards

- **Authentication**: OAuth2 with JWT tokens
- **Data Validation**: Always validate input with Pydantic
- **SQL Injection**: Use SQLModel ORM, never raw SQL
- **XSS Prevention**: Sanitize all user inputs
- **CORS**: Configure specific allowed origins
- **Secrets**: Use environment variables, never commit secrets
- **Rate Limiting**: Implement on all public endpoints

### 6. Performance Standards

- **Response Time**: API responses < 200ms (excluding AI operations)
- **AI Latency**: < 1 second for voice interactions
- **Database Queries**: Use indexes, avoid N+1 queries
- **Caching**: Redis for frequently accessed data
- **Frontend**: 
  - Lazy loading for components
  - Image optimization
  - Code splitting

### 7. Documentation Requirements

- **Code Documentation**:
  - All functions must have docstrings
  - Complex logic requires inline comments
  - README files in each major directory
- **API Documentation**:
  - OpenAPI/Swagger for all endpoints
  - Include request/response examples
- **Architecture Documentation**:
  - System diagrams using Mermaid
  - Data flow documentation
  - Deployment guides

### 8. CI/CD Requirements

- **Pre-commit Hooks**:
  - Linting (ESLint, Black)
  - Type checking (mypy, TypeScript)
  - Test execution
- **GitHub Actions**:
  - Run on all PRs
  - Build, test, and security scanning
  - Automated deployment to staging
- **Deployment Checklist**:
  - All tests passing
  - Security scan complete
  - Performance benchmarks met
  - Documentation updated

### 9. Monitoring and Logging

- **Logging Standards**:
  ```python
  # Use structured logging
  logger.info("User action", extra={
      "user_id": user.id,
      "action": "avatar_interaction",
      "latency_ms": 150
  })
  ```
- **Metrics to Track**:
  - API response times
  - AI model latency
  - Error rates
  - User engagement metrics
- **Alerting**:
  - Set up alerts for critical failures
  - Performance degradation warnings
  - Security incident notifications

### 10. AI/ML Specific Guidelines

- **Model Versioning**: Track all model versions with metadata
- **Training Data**: Document data sources and preprocessing
- **Evaluation Metrics**: Define and track model performance
- **A/B Testing**: Framework for testing model improvements
- **Bias Testing**: Regular audits for model fairness
- **Fallback Mechanisms**: Graceful degradation if AI fails

### 11. Review Process

1. **Code Review Checklist**:
   - [ ] Tests written and passing
   - [ ] Documentation updated
   - [ ] No security vulnerabilities
   - [ ] Performance impact assessed
   - [ ] Follows style guidelines
   
2. **Design Review**: Required for new features or architectural changes
3. **Security Review**: Required for auth changes or new data handling

### 12. Incident Response

- **On-call Rotation**: Define responsibilities
- **Incident Levels**:
  - P0: System down
  - P1: Major functionality broken
  - P2: Minor issues
- **Post-mortems**: Required for P0/P1 incidents
- **Documentation**: Update runbooks after incidents

## Enforcement

These rules are enforced through:
- Automated tooling (linters, formatters)
- CI/CD pipeline checks
- Code review process
- Regular team audits

Non-compliance will result in:
1. PR rejection until fixed
2. Team discussion for repeated violations
3. Additional training if needed

## Updates

This document is living and should be updated when:
- New patterns emerge
- Tools change
- Team consensus on modifications

Last Updated: [Current Date]
Version: 1.0 