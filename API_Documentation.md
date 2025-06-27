# 📚 API Documentation - Accessly User Management System

Complete API reference for the Accessly User Management System.

## 🔐 Authentication

### Base URL

http://localhost:3000/api/v1


### Headers
javascript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}


---

## 👤 User Management

### Register User
*POST* /auth/register
json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "role": "System Administrator" | "Tenant Administrator" | "User"
}


### Login User
*POST* /auth/login
json
{
  "username": "string",
  "password": "string",
  "rememberMe": "boolean"
}


### Get Current User Profile
*GET* /me

### Update User Profile
*PUT* /me
json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "organization": "string"
}


### Change Password
*PUT* /me/password
json
{
  "currentPassword": "string",
  "newPassword": "string"
}


### Get User Notifications
*GET* /me/notifications

### Update User Notifications
*PUT* /me/notifications
json
{
  "emailNotifications": "boolean",
  "pushNotifications": "boolean",
  "securityAlerts": "boolean",
  "marketingEmails": "boolean",
  "notificationFrequency": "immediate" | "daily" | "weekly"
}


### Get User Activity
*GET* /me/activity

---

## 🏢 Tenant Management

### Get All Tenants
*GET* /tenants

### Create Tenant
*POST* /tenants
json
{
  "name": "string",
  "domain": "string",
  "adminEmail": "string",
  "settings": {
    "theme": "dark" | "light",
    "timezone": "string",
    "locale": "string"
  }
}


### Get Tenant by ID
*GET* /tenants/{id}

### Update Tenant
*PUT* /tenants/{id}
json
{
  "name": "string",
  "domain": "string",
  "status": "active" | "inactive"
}


### Get Tenant Settings
*GET* /tenants/{id}/settings

### Update Tenant Settings
*PUT* /tenants/{id}/settings
json
{
  "domain": "string",
  "email": "string",
  "theme": "dark" | "light",
  "timezone": "string",
  "locale": "string",
  "features": {
    "analytics": "boolean",
    "auditLogs": "boolean",
    "bulkOperations": "boolean"
  }
}


---

## 🏬 Organization Management

### Get Organizations by Tenant
*GET* /tenants/{tenantId}/organizations

### Create Organization
*POST* /tenants/{tenantId}/organizations
json
{
  "name": "string",
  "description": "string",
  "parentId": "string" | null,
  "settings": {
    "timezone": "string",
    "locale": "string"
  }
}


### Get Organization by ID
*GET* /tenants/{tenantId}/organizations/{id}

### Update Organization
*PUT* /tenants/{tenantId}/organizations/{id}
json
{
  "name": "string",
  "description": "string",
  "parentId": "string" | null,
  "status": "active" | "inactive"
}


### Delete Organization
*DELETE* /tenants/{tenantId}/organizations/{id}

### Get Organization Profile
*GET* /tenants/{tenantId}/organizations/{id}/profile

### Update Organization Profile
*PUT* /tenants/{tenantId}/organizations/{id}/profile
json
{
  "name": "string",
  "description": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "website": "string"
}


---

## 🛡 Role Management

### Get Roles by Tenant
*GET* /tenants/{tenantId}/roles

### Create Role
*POST* /tenants/{tenantId}/roles
json
{
  "name": "string",
  "description": "string",
  "privileges": ["string"],
  "isDefault": "boolean"
}


### Get Role by ID
*GET* /tenants/{tenantId}/roles/{id}

### Update Role
*PUT* /tenants/{tenantId}/roles/{id}
json
{
  "name": "string",
  "description": "string",
  "privileges": ["string"]
}


### Link Privilege to Role
*POST* /tenants/{tenantId}/roles/{roleId}/privileges/{privilegeId}/link

### Unlink Privilege from Role
*POST* /tenants/{tenantId}/roles/{roleId}/privileges/{privilegeId}/unlink

---

## 🔑 Privilege Management

### Get Privileges by Tenant
*GET* /tenants/{tenantId}/privileges

### Create Privilege
*POST* /tenants/{tenantId}/privileges
json
{
  "name": "string",
  "description": "string",
  "category": "string"
}


### Get Privilege by ID
*GET* /tenants/{tenantId}/privileges/{id}

### Update Privilege
*PUT* /tenants/{tenantId}/privileges/{id}
json
{
  "name": "string",
  "description": "string",
  "category": "string"
}


---

## 📄 Legal Entity Management

### Get Legal Entities by Tenant
*GET* /tenants/{tenantId}/legal-entities

### Create Legal Entity
*POST* /tenants/{tenantId}/legal-entities
json
{
  "name": "string",
  "type": "LLC" | "Corporation" | "Partnership",
  "registrationNumber": "string",
  "taxId": "string",
  "address": "string",
  "contactPerson": "string",
  "contactEmail": "string"
}


### Get Legal Entity by ID
*GET* /tenants/{tenantId}/legal-entities/{id}

### Update Legal Entity
*PUT* /tenants/{tenantId}/legal-entities/{id}
json
{
  "name": "string",
  "type": "LLC" | "Corporation" | "Partnership",
  "registrationNumber": "string",
  "taxId": "string",
  "address": "string",
  "contactPerson": "string",
  "contactEmail": "string"
}


---

## 📊 Analytics & Reporting

### Get Activity Logs
*GET* /activity-logs

*Query Parameters:*
- page (number): Page number
- limit (number): Records per page
- type (string): Activity type filter
- userId (string): User ID filter
- startDate (string): Start date (ISO format)
- endDate (string): End date (ISO format)

### Get Pending Users
*GET* /tenants/{tenantId}/pending-users

### Approve User
*POST* /tenants/{tenantId}/users/{id}/approve

### Reject User
*POST* /tenants/{tenantId}/users/{id}/reject
json
{
  "reason": "string"
}


---

## ⚙ System Configuration

### Get System Health
*GET* /health

---

## 🔧 Error Handling

### Error Response Format
json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object" | null,
    "timestamp": "string"
  }
}


### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Internal server error |

### Example Error Responses

*400 Bad Request:*
json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Invalid email format"],
      "password": ["Password must be at least 6 characters"]
    },
    "timestamp": "2024-01-15T12:00:00Z"
  }
}


*401 Unauthorized:*
json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": null,
    "timestamp": "2024-01-15T12:00:00Z"
  }
}


*403 Forbidden:*
json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions to access this resource",
    "details": {
      "required": ["ADMIN"],
      "current": ["USER"]
    },
    "timestamp": "2024-01-15T12:00:00Z"
  }
}


*404 Not Found:*
json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "details": {
      "resource": "user",
      "id": "999"
    },
    "timestamp": "2024-01-15T12:00:00Z"
  }
}


---

## 📝 Data Models

### User Model
typescript
interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  phone?: string;
  organization?: string;
  role: 'ADMINISTRATOR' | 'TENANT_ADMIN' | 'USER';
  tenantId: string;
  status: 'active' | 'inactive' | 'pending';
  roles: string[];
  canonicalRole: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}


### Tenant Model
typescript
interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive';
  settings: {
    theme: 'dark' | 'light';
    timezone: string;
    locale: string;
    email: string;
  };
  createdAt: string;
  updatedAt?: string;
}


### Organization Model
typescript
interface Organization {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  parentId?: string;
  status: 'active' | 'inactive';
  settings?: {
    timezone: string;
    locale: string;
  };
  createdAt: string;
  updatedAt?: string;
}


### Role Model
typescript
interface Role {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  privileges: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string;
}


### Privilege Model
typescript
interface Privilege {
  id: string;
  name: string;
  description?: string;
  category: string;
  tenantId: string;
  createdAt: string;
  updatedAt?: string;
}


### Legal Entity Model
typescript
interface LegalEntity {
  id: string;
  name: string;
  type: 'LLC' | 'Corporation' | 'Partnership';
  tenantId: string;
  status: 'active' | 'inactive';
  registrationNumber: string;
  taxId: string;
  address: string;
  contactPerson?: string;
  contactEmail?: string;
  createdAt: string;
  updatedAt?: string;
}


### Activity Log Model
typescript
interface ActivityLog {
  id: string;
  action: string;
  time: string;
  type: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: object;
}


---

## 🔐 Authentication Flow

### JWT Token Structure
json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "email": "user@example.com",
    "role": "ADMINISTRATOR",
    "tenantId": "1",
    "iat": 1642248000,
    "exp": 1642251600
  }
}


### Token Refresh
*POST* /auth/refresh
json
{
  "token": "new_jwt_token",
  "expiresIn": 3600
}


---

## 📊 Rate Limiting

### Rate Limits
- *Authentication endpoints*: 5 requests per minute
- *User management*: 100 requests per minute
- *Analytics*: 50 requests per minute
- *General endpoints*: 1000 requests per minute

### Rate Limit Headers

X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642251600


### Rate Limit Exceeded Response
json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "details": {
      "limit": 100,
      "reset": 1642251600
    },
    "timestamp": "2024-01-15T12:00:00Z"
  }
}


---

## 🧪 Testing

### Test Environment
- *Base URL*: http://localhost:3000/api/v1
- *Mock Data*: All endpoints use MSW for mocking
- *Test Users*: Pre-configured test accounts available

### Test Credentials
json
{
  "admin": {
    "username": "admin",
    "password": "password",
    "role": "ADMINISTRATOR"
  },
  "tenantAdmin": {
    "username": "tenantadmin",
    "password": "password",
    "role": "TENANT_ADMIN"
  },
  "user": {
    "username": "user",
    "password": "password",
    "role": "USER"
  }
}


---
