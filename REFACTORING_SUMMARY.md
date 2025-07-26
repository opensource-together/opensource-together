# API Refactoring Summary - User-Specific Endpoints

## Overview
All API endpoints that require user ownership have been moved under the `/me` prefix to clearly indicate that these actions are performed by the authenticated user on their own resources.

## Changes Made

### 1. Project Management Endpoints

#### New Controller: `UserProjectController`
- **Location**: `/workspace/apps/server/src/contexts/project/infrastructure/controllers/user-project.controller.ts`
- **Base Path**: `/projects/me`

**Endpoints moved:**
- `GET /projects/me` - Get all projects owned by the authenticated user
- `POST /projects/me` - Create a new project for the authenticated user
- `PATCH /projects/me/:id` - Update a project owned by the authenticated user
- `DELETE /projects/me/:id` - Delete a project owned by the authenticated user

**Old endpoints marked as deprecated:**
- `POST /projects` → `POST /projects/me`
- `PATCH /projects/:id` → `PATCH /projects/me/:id`
- `DELETE /projects/:id` → `DELETE /projects/me/:id`

### 2. Project Role Management Endpoints

#### New Controller: `UserProjectRolesController`
- **Location**: `/workspace/apps/server/src/contexts/project/bounded-contexts/project-role/infrastructure/controllers/user-project-roles.controller.ts`
- **Base Path**: `/projects/me/:projectId/roles`

**Endpoints moved:**
- `POST /projects/me/:projectId/roles` - Create a role in user's project
- `PATCH /projects/me/:projectId/roles/:roleId` - Update a role in user's project
- `DELETE /projects/me/:projectId/roles/:roleId` - Delete a role from user's project

**Old endpoints marked as deprecated:**
- `POST /projects/:projectId/roles` → `POST /projects/me/:projectId/roles`
- `PATCH /projects/:projectId/roles/:roleId` → `PATCH /projects/me/:projectId/roles/:roleId`
- `DELETE /projects/:projectId/roles/:roleId` → `DELETE /projects/me/:projectId/roles/:roleId`

### 3. Project Role Application Management Endpoints

#### New Controller: `UserProjectRoleApplicationController`
- **Location**: `/workspace/apps/server/src/contexts/project/bounded-contexts/project-role-application/infrastructure/controllers/user-project-role-application.controller.ts`
- **Base Path**: `/projects/me/:projectId/roles`

**Endpoints moved:**
- `GET /projects/me/:projectId/roles/applications` - Get all applications for user's project
- `GET /projects/me/:projectId/roles/:roleId/applications` - Get applications for a specific role
- `PATCH /projects/me/:projectId/roles/applications/:applicationId/accept` - Accept an application
- `PATCH /projects/me/:projectId/roles/applications/:applicationId/reject` - Reject an application

**Old endpoints marked as deprecated:**
- `GET /projects/:projectId/roles/applications` → `GET /projects/me/:projectId/roles/applications`
- `GET /projects/:projectId/roles/:roleId/applications` → `GET /projects/me/:projectId/roles/:roleId/applications`
- `PATCH /projects/:projectId/roles/applications/:applicationId/accept` → `PATCH /projects/me/:projectId/roles/applications/:applicationId/accept`
- `PATCH /projects/:projectId/roles/applications/:applicationId/reject` → `PATCH /projects/me/:projectId/roles/applications/:applicationId/reject`

### 4. Project Key Feature Management Endpoints

#### New Controller: `UserProjectKeyFeatureController`
- **Location**: `/workspace/apps/server/src/contexts/project/bounded-contexts/project-key-feature/infrastructure/controllers/user-project-key-feature.controller.ts`
- **Base Path**: `/projects/me/:projectId`

**Endpoints moved:**
- `POST /projects/me/:projectId/key-features` - Create key features for user's project
- `DELETE /projects/me/:projectId/key-features/:keyFeatureId` - Delete a key feature from user's project

**Old endpoints marked as deprecated:**
- `POST /projects/:projectId/key-features` → `POST /projects/me/:projectId/key-features`
- `DELETE /projects/:projectId/key-features/:keyFeatureId` → `DELETE /projects/me/:projectId/key-features/:keyFeatureId`

## Infrastructure Changes

All new controllers have been registered in their respective infrastructure modules:
- `ProjectInfrastructure` - Added `UserProjectController`
- `ProjectRoleInfrastructure` - Added `UserProjectRolesController`
- `ProjectRoleApplicationInfrastructure` - Added `UserProjectRoleApplicationController`
- `ProjectKeyFeatureInfrastructure` - Added `UserProjectKeyFeatureController`

## Benefits

1. **Clarity**: The `/me` prefix clearly indicates that these endpoints operate on resources owned by the authenticated user
2. **Consistency**: All user-specific actions follow the same pattern
3. **Security**: Makes it explicit that these endpoints require authentication and ownership
4. **API Documentation**: Swagger/OpenAPI documentation clearly shows which endpoints are user-specific

## Migration Guide

For frontend applications:
1. Update all API calls to use the new `/me` endpoints
2. The old endpoints are marked as deprecated but still functional for backward compatibility
3. Plan to remove the deprecated endpoints in a future release

Example migration:
```typescript
// Old
await fetch('/api/projects', { method: 'POST', body: projectData })
await fetch(`/api/projects/${projectId}`, { method: 'PATCH', body: updateData })

// New
await fetch('/api/projects/me', { method: 'POST', body: projectData })
await fetch(`/api/projects/me/${projectId}`, { method: 'PATCH', body: updateData })
```