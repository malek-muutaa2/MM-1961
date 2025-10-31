# API Documentation - RBAC System (Roles, Permissions, User Roles)

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Authentication
All endpoints require authentication. The user must be logged in and have Admin role.

**Headers Required:**
\`\`\`
Authorization: Bearer <token>
Content-Type: application/json
\`\`\`

---

## 1. ROLES MANAGEMENT

### 1.1 Get All Roles
**Endpoint:** `GET /roles`

**Description:** Retrieve all roles in the system (excluding deleted roles)

**Authentication:** Required (Admin only)

**Query Parameters:** None

**Response (200 OK):**
\`\`\`json
{
  "roles": [
    {
      "role_id": 1,
      "name": "Admin",
      "description": "Administrator role with full access",
      "is_builtin": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "deleted_at": null,
      "created_by": 1,
      "updated_by": null,
      "deleted_by": null
    },
    {
      "role_id": 2,
      "name": "Editor",
      "description": "Editor role with limited access",
      "is_builtin": false,
      "created_at": "2024-01-16T14:20:00Z",
      "updated_at": "2024-01-16T14:20:00Z",
      "deleted_at": null,
      "created_by": 1,
      "updated_by": null,
      "deleted_by": null
    }
  ]
}
\`\`\`

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `500 Internal Server Error` - Server error

---

### 1.2 Create Role
**Endpoint:** `POST /roles`

**Description:** Create a new role

**Authentication:** Required (Admin only)

**Request Body:**
\`\`\`json
{
  "name": "Viewer",
  "description": "Read-only access to resources",
  "is_builtin": false
}
\`\`\`

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Unique role name (max 100 chars) |
| description | string | No | Role description (max 255 chars) |
| is_builtin | boolean | No | Whether this is a built-in role (default: false) |

**Response (201 Created):**
\`\`\`json
{
  "role": {
    "role_id": 3,
    "name": "Viewer",
    "description": "Read-only access to resources",
    "is_builtin": false,
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T09:15:00Z",
    "deleted_at": null,
    "created_by": 1,
    "updated_by": null,
    "deleted_by": null
  }
}
\`\`\`

**Error Responses:**
- `400 Bad Request` - Role name is required
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `500 Internal Server Error` - Server error

---

### 1.3 Update Role
**Endpoint:** `PUT /roles/[id]`

**Description:** Update an existing role

**Authentication:** Required (Admin only)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Role ID |

**Request Body:**
\`\`\`json
{
  "name": "Viewer Updated",
  "description": "Updated read-only access"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "role": {
    "role_id": 3,
    "name": "Viewer Updated",
    "description": "Updated read-only access",
    "is_builtin": false,
    "created_at": "2024-01-17T09:15:00Z",
    "updated_at": "2024-01-17T10:45:00Z",
    "deleted_at": null,
    "created_by": 1,
    "updated_by": 1,
    "deleted_by": null
  }
}
\`\`\`

**Error Responses:**
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `404 Not Found` - Role not found
- `500 Internal Server Error` - Server error

---

### 1.4 Delete Role
**Endpoint:** `DELETE /roles/[id]`

**Description:** Delete a role (soft delete). Can only delete if role is not assigned to any users.

**Authentication:** Required (Admin only)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Role ID |

**Response (200 OK):**
\`\`\`json
{
  "message": "Role deleted successfully"
}
\`\`\`

**Error Responses:**
- `400 Bad Request` - Role is assigned to X users and cannot be deleted
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `404 Not Found` - Role not found
- `500 Internal Server Error` - Server error

---

## 2. PERMISSIONS MANAGEMENT

### 2.1 Get All Permissions (with Pagination)
**Endpoint:** `GET /permissions`

**Description:** Retrieve all permissions with pagination and search

**Authentication:** Required (Admin only)

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number for pagination |
| size | integer | 10 | Number of items per page |
| search | string | "" | Search by domain, action, or description |
| column | string | "permission_id" | Column to sort by |
| order | string | "desc" | Sort order (asc or desc) |

**Example Request:**
\`\`\`
GET /permissions?page=1&size=10&search=read&column=domain&order=asc
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "permissions": [
    {
      "permission_id": 1,
      "domain": "users",
      "action": "read",
      "description": "Read user information",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "deleted_at": null,
      "created_by": 1,
      "updated_by": null,
      "deleted_by": null
    }
  ],
  "pageNumber": 1,
  "numberOfPages": 5,
  "totalCount": 47
}
\`\`\`

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `500 Internal Server Error` - Server error

---

### 2.2 Create Permission
**Endpoint:** `POST /permissions`

**Description:** Create a new permission

**Authentication:** Required (Admin only)

**Request Body:**
\`\`\`json
{
  "domain": "documents",
  "action": "delete",
  "description": "Delete documents"
}
\`\`\`

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| domain | string | Yes | Permission domain (max 100 chars) |
| action | string | Yes | Permission action (max 100 chars) |
| description | string | No | Permission description (max 255 chars) |

**Response (201 Created):**
\`\`\`json
{
  "permission": {
    "permission_id": 48,
    "domain": "documents",
    "action": "delete",
    "description": "Delete documents",
    "created_at": "2024-01-17T11:20:00Z",
    "updated_at": "2024-01-17T11:20:00Z",
    "deleted_at": null,
    "created_by": 1,
    "updated_by": null,
    "deleted_by": null
  }
}
\`\`\`

**Error Responses:**
- `400 Bad Request` - Domain and action are required / Permission already exists
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `500 Internal Server Error` - Server error

---

### 2.3 Update Permission
**Endpoint:** `PUT /permissions/[id]`

**Description:** Update an existing permission

**Authentication:** Required (Admin only)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Permission ID |

**Request Body:**
\`\`\`json
{
  "domain": "documents",
  "action": "delete",
  "description": "Delete documents (updated)"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "permission": {
    "permission_id": 48,
    "domain": "documents",
    "action": "delete",
    "description": "Delete documents (updated)",
    "created_at": "2024-01-17T11:20:00Z",
    "updated_at": "2024-01-17T12:00:00Z",
    "deleted_at": null,
    "created_by": 1,
    "updated_by": 1,
    "deleted_by": null
  }
}
\`\`\`

**Error Responses:**
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `404 Not Found` - Permission not found
- `500 Internal Server Error` - Server error

---

### 2.4 Delete Permission
**Endpoint:** `DELETE /permissions/[id]`

**Description:** Delete a permission (soft delete). Can only delete if permission is not assigned to any roles.

**Authentication:** Required (Admin only)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Permission ID |

**Response (200 OK):**
\`\`\`json
{
  "message": "Permission deleted successfully"
}
\`\`\`

**Error Responses:**
- `400 Bad Request` - Permission is assigned to X roles and cannot be deleted
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `404 Not Found` - Permission not found
- `500 Internal Server Error` - Server error

---

## 3. ROLE-PERMISSION MANAGEMENT

### 3.1 Get All Role-Permissions
**Endpoint:** `GET /role-permissions`

**Description:** Retrieve all role-permission assignments

**Authentication:** Required (Admin only)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| permission_id | integer | Filter by permission ID (optional) |

**Example Request:**
\`\`\`
GET /role-permissions?permission_id=5
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "rolePermissions": [
    {
      "id": 1,
      "role_id": 1,
      "permission_id": 5,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "updated_by": 1,
      "constraints": null
    }
  ]
}
\`\`\`

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `500 Internal Server Error` - Server error

---

### 3.2 Assign Permission to Role
**Endpoint:** `POST /role-permissions`

**Description:** Assign a permission to a role

**Authentication:** Required (Admin only)

**Request Body:**
\`\`\`json
{
  "role_id": 2,
  "permission_id": 5
}
\`\`\`

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| role_id | integer | Yes | Role ID |
| permission_id | integer | Yes | Permission ID |

**Response (201 Created):**
\`\`\`json
{
  "rolePermission": {
    "id": 25,
    "role_id": 2,
    "permission_id": 5,
    "created_at": "2024-01-17T13:45:00Z",
    "updated_at": "2024-01-17T13:45:00Z",
    "updated_by": 1,
    "constraints": null
  }
}
\`\`\`

**Error Responses:**
- `400 Bad Request` - Role ID and Permission ID are required / Assignment already exists
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `500 Internal Server Error` - Server error

---

### 3.3 Assign Multiple Permissions to Role
**Endpoint:** `POST /permissions/assign-roles`

**Description:** Assign or unassign multiple permissions to/from roles in one request

**Authentication:** Required (Admin only)

**Request Body:**
\`\`\`json
{
  "permission_id": 5,
  "role_ids": [1, 2, 3]
}
\`\`\`

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| permission_id | integer | Yes | Permission ID |
| role_ids | integer[] | Yes | Array of Role IDs to assign/unassign |

**Response (200 OK):**
\`\`\`json
{
  "message": "Permissions updated successfully",
  "assigned": 2,
  "unassigned": 1
}
\`\`\`

**Error Responses:**
- `400 Bad Request` - Permission ID and role IDs are required
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `404 Not Found` - Permission or role not found
- `500 Internal Server Error` - Server error

---

### 3.4 Delete Role-Permission Assignment
**Endpoint:** `DELETE /role-permissions/[id]`

**Description:** Remove a permission from a role

**Authentication:** Required (Admin only)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Role-Permission assignment ID |

**Response (200 OK):**
\`\`\`json
{
  "message": "Role-permission assignment deleted successfully"
}
\`\`\`

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `404 Not Found` - Assignment not found
- `500 Internal Server Error` - Server error

---

## 4. USER-ROLE MANAGEMENT

### 4.1 Get All User-Roles
**Endpoint:** `GET /user-roles`

**Description:** Retrieve all user-role assignments with user and role details

**Authentication:** Required (Admin only)

**Query Parameters:** None

**Response (200 OK):**
\`\`\`json
{
  "userRoles": [
    {
      "user_role_id": 1,
      "user_id": 5,
      "role_id": 1,
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "role_name": "Admin",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "created_by": 1
    },
    {
      "user_role_id": 2,
      "user_id": 6,
      "role_id": 2,
      "user_name": "Jane Smith",
      "user_email": "jane@example.com",
      "role_name": "Editor",
      "created_at": "2024-01-16T14:20:00Z",
      "updated_at": "2024-01-16T14:20:00Z",
      "created_by": 1
    }
  ]
}
\`\`\`

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `500 Internal Server Error` - Server error

---

### 4.2 Assign Role to User
**Endpoint:** `POST /user-roles`

**Description:** Assign a role to a user

**Authentication:** Required (Admin only)

**Request Body:**
\`\`\`json
{
  "user_id": 7,
  "role_id": 2
}
\`\`\`

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | integer | Yes | User ID |
| role_id | integer | Yes | Role ID |

**Response (201 Created):**
\`\`\`json
{
  "userRole": {
    "id": 15,
    "user_id": 7,
    "role_id": 2,
    "granted_at": "2024-01-17T14:30:00Z",
    "granted_by": null,
    "created_at": "2024-01-17T14:30:00Z",
    "updated_at": "2024-01-17T14:30:00Z",
    "deleted_at": null,
    "created_by": 1,
    "updated_by": null,
    "deleted_by": null
  }
}
\`\`\`

**Error Responses:**
- `400 Bad Request` - User ID and Role ID are required / User already has this role
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `500 Internal Server Error` - Server error

---

### 4.3 Unassign Role from User
**Endpoint:** `DELETE /user-roles/[id]`

**Description:** Remove a role from a user (soft delete)

**Authentication:** Required (Admin only)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | User-Role assignment ID |

**Response (200 OK):**
\`\`\`json
{
  "message": "Role unassigned from user successfully"
}
\`\`\`

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User is not an Admin
- `404 Not Found` - Assignment not found
- `500 Internal Server Error` - Server error

---

## 5. ERROR HANDLING

### Common Error Responses

**401 Unauthorized:**
\`\`\`json
{
  "error": "Not authenticated"
}
\`\`\`

**403 Forbidden:**
\`\`\`json
{
  "error": "Forbidden: Admins only"
}
\`\`\`

**400 Bad Request:**
\`\`\`json
{
  "error": "Role name is required"
}
\`\`\`

**404 Not Found:**
\`\`\`json
{
  "error": "Resource not found"
}
\`\`\`

**500 Internal Server Error:**
\`\`\`json
{
  "error": "Failed to process request"
}
\`\`\`

---

## 6. TESTING CHECKLIST

### Roles
- [ ] GET /roles - Retrieve all roles
- [ ] POST /roles - Create new role
- [ ] PUT /roles/[id] - Update role
- [ ] DELETE /roles/[id] - Delete role (only if not assigned to users)

### Permissions
- [ ] GET /permissions - Retrieve all permissions with pagination
- [ ] POST /permissions - Create new permission
- [ ] PUT /permissions/[id] - Update permission
- [ ] DELETE /permissions/[id] - Delete permission (only if not assigned to roles)

### Role-Permissions
- [ ] GET /role-permissions - Retrieve all role-permission assignments
- [ ] POST /role-permissions - Assign permission to role
- [ ] POST /permissions/assign-roles - Assign/unassign multiple permissions
- [ ] DELETE /role-permissions/[id] - Remove permission from role

### User-Roles
- [ ] GET /user-roles - Retrieve all user-role assignments
- [ ] POST /user-roles - Assign role to user
- [ ] DELETE /user-roles/[id] - Unassign role from user

### Authorization
- [ ] All endpoints require Admin role
- [ ] Non-authenticated users get 401 error
- [ ] Non-admin users get 403 error

### Validation
- [ ] Cannot create duplicate permissions (same domain + action)
- [ ] Cannot delete role assigned to users
- [ ] Cannot delete permission assigned to roles
- [ ] Cannot assign duplicate role to user
