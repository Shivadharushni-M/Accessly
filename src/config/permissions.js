export const PERMISSIONS = {
  USERS: {
    VIEW: 'users:view',
    CREATE: 'users:create',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    ASSIGN_ROLE: 'users:assign_role',
    REVOKE_ROLE: 'users:revoke_role',
  },
  TENANTS: {
    VIEW: 'tenants:view',
    CREATE: 'tenants:create',
    UPDATE: 'tenants:update',
    DELETE: 'tenants:delete',
  },
  ROLES: {
    VIEW: 'roles:view',
    CREATE: 'roles:create',
    UPDATE: 'roles:update',
    DELETE: 'roles:delete',
    LINK_PRIVILEGE: 'roles:link_privilege',
    UNLINK_PRIVILEGE: 'roles:unlink_privilege',
  },
  ORGANIZATIONS: {
    VIEW: 'organizations:view',
    CREATE: 'organizations:create',
    UPDATE: 'organizations:update',
    DELETE: 'organizations:delete',
    PROFILE_VIEW: 'organizations:profile_view',
    PROFILE_UPDATE: 'organizations:profile_update',
  },
  LEGAL_ENTITIES: {
    VIEW: 'legal_entities:view',
    CREATE: 'legal_entities:create',
    UPDATE: 'legal_entities:update',
    DELETE: 'legal_entities:delete',
  },
  PRIVILEGES: {
    VIEW: 'privileges:view',
    CREATE: 'privileges:create',
    UPDATE: 'privileges:update',
    DELETE: 'privileges:delete',
  },
  PROFILE: {
    VIEW: 'profile:view',
    UPDATE: 'profile:update',
  }
};

export const ROLE_PERMISSIONS = {
  ADMINISTRATOR: [
    ...Object.values(PERMISSIONS.USERS),
    ...Object.values(PERMISSIONS.TENANTS),
    ...Object.values(PERMISSIONS.ROLES),
    ...Object.values(PERMISSIONS.ORGANIZATIONS),
    ...Object.values(PERMISSIONS.LEGAL_ENTITIES),
    ...Object.values(PERMISSIONS.PRIVILEGES),
    ...Object.values(PERMISSIONS.PROFILE),
  ],
  TENANT_ADMIN: [
    ...Object.values(PERMISSIONS.USERS),
    ...Object.values(PERMISSIONS.ROLES),
    ...Object.values(PERMISSIONS.ORGANIZATIONS),
    ...Object.values(PERMISSIONS.LEGAL_ENTITIES),
    ...Object.values(PERMISSIONS.PRIVILEGES),
    PERMISSIONS.TENANTS.VIEW,
    PERMISSIONS.TENANTS.UPDATE,
    ...Object.values(PERMISSIONS.PROFILE),
  ],
  USER: [
    PERMISSIONS.USERS.VIEW,
    ...Object.values(PERMISSIONS.PROFILE),
  ]
};