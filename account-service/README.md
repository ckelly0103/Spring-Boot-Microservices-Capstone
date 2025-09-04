# Account Service

The Account Service is a Spring Boot microservice that handles customer authentication and registration for the customer management application.

## Features

- Customer registration
- Customer authentication with JWT tokens
- Integration with Data Service for customer data management

## Configuration

The service runs on:
- **Port**: 8081
- **Context Path**: `/account`

## Endpoints

### Root Endpoint
- **URL**: `GET /account/`
- **Description**: Health check endpoint that confirms the service is running
- **Response**: Service status information

### Token Endpoint  
- **URL**: `POST /account/token`
- **Description**: Authenticate customer and receive JWT token
- **Request Body**:
  ```json
  {
    "username": "customer@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "username": "customer@example.com",
    "email": "customer@example.com"
  }
  ```

### Register Endpoint
- **URL**: `POST /account/register`
- **Description**: Register a new customer
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com", 
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Customer registered successfully",
    "customerId": 1,
    "email": "john.doe@example.com",
    "name": "John Doe"
  }
  ```

## Dependencies

- Spring Boot 3.5.5
- Spring Security
- JWT (JSON Web Tokens)
- Spring Boot Validation

## Configuration Properties

The following properties can be configured in `application.properties`:

```properties
# Server Configuration
server.port=8081
server.servlet.context-path=/account

# JWT Configuration
jwt.secret=mySecretKey12345678901234567890123456789012345678901234567890
jwt.expiration=86400000

# Data Service Configuration
data.service.url=http://localhost:8080
data.service.customer.endpoint=/customers
```

## Running the Service

1. Ensure Java 21 is installed
2. Navigate to the account-service directory
3. Run the service:
   ```bash
   ./gradlew bootRun
   ```

## API Usage Examples

### Check Service Status
```bash
curl -X GET http://localhost:8081/account/
```

### Register a New Customer
```bash
curl -X POST http://localhost:8081/account/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Authenticate Customer
```bash
curl -X POST http://localhost:8081/account/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe@example.com",
    "password": "password123"
  }'
```

## Security

- No authentication required for accessing account service endpoints
- Passwords are encrypted using BCrypt
- JWT tokens are generated for authenticated users
- JWT tokens include expiration time (default: 24 hours)

## Integration

This service integrates with the Data Service to:
- Store new customer registrations
- Retrieve customer information for authentication
- Validate customer credentials

Make sure the Data Service is running and accessible at the configured URL before starting the Account Service.
