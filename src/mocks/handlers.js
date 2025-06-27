import { http } from 'msw';

// Mock Data
let tenants = [
  { id: '1', name: 'Acme Corp', status: 'active' },
  { id: '2', name: 'Globex Inc', status: 'inactive' }
];
let users = [
  { id: '1', username: 'admin', email: 'admin@acme.com', status: 'active', roles: ['0'], tenantId: '1', password: 'password', canonicalRole: 'ADMINISTRATOR' },
  { id: '2', username: 'tenantadmin', email: 'tenantadmin@acme.com', status: 'active', roles: ['1'], tenantId: '1', password: 'password', canonicalRole: 'TENANT_ADMIN' },
  { id: '4', username: 'user', email: 'user@acme.com', status: 'active', roles: ['3'], tenantId: '1', password: 'password', canonicalRole: 'USER' },
  { id: '6', username: 'pendinguser', email: 'pending@acme.com', status: 'pending', roles: ['3'], tenantId: '1', password: 'password', canonicalRole: 'USER' }
];
let roles = [
  { id: '1', name: 'Admin', privileges: ['1', '2'], tenantId: '1' },
  { id: '3', name: 'User', privileges: ['1'], tenantId: '1' }
];
let privileges = [
  { id: '1', name: 'View Users', category: 'User' },
  { id: '2', name: 'Edit Users', category: 'User' }
];
let organizations = [
  { id: '1', name: 'Acme HQ', tenantId: '1' }
];
let legalEntities = [
  { id: '1', name: 'Acme Legal', type: 'LLC', tenantId: '1' }
];
let tenantSettings = {
  '1': { domain: 'acme.com', email: 'admin@acme.com', theme: 'dark' },
  '2': { domain: 'globex.com', email: 'info@globex.com', theme: 'light' }
};
let activityLogs = [
  { id: '1', action: 'User admin created tenant Acme Corp', time: '2024-06-01T10:00:00Z', type: 'tenant' },
  { id: '2', action: 'TenantAdmin approved user manager', time: '2024-06-01T11:00:00Z', type: 'user' },
  { id: '3', action: 'Welcome email sent to user@acme.com', time: '2024-06-01T11:01:00Z', type: 'email' },
  { id: '4', action: 'User pendinguser registered and is pending approval', time: '2024-06-01T12:00:00Z', type: 'user' }
];

// Hydrate users from localStorage if present
if (typeof window !== 'undefined' && window.localStorage) {
  const storedUsers = window.localStorage.getItem('mock_users');
  if (storedUsers) {
    try {
      users = JSON.parse(storedUsers);
    } catch {}
  }
  const storedTenants = window.localStorage.getItem('mock_tenants');
  if (storedTenants) {
    try {
      tenants = JSON.parse(storedTenants);
    } catch {}
  }
  const storedOrganizations = window.localStorage.getItem('mock_organizations');
  if (storedOrganizations) {
    try {
      organizations = JSON.parse(storedOrganizations);
    } catch {}
  }
}

function saveUsersToStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('mock_users', JSON.stringify(users));
  }
}

function saveTenantsToStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('mock_tenants', JSON.stringify(tenants));
  }
}

function saveOrganizationsToStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('mock_organizations', JSON.stringify(organizations));
  }
}

export const handlers = [
  // Profile (me) - PUT (moved to top for priority)
  http.put('/api/v1/me', async ({ request }) => {
    console.log('PUT /api/v1/me called - handler found');
    const body = await request.json();
    console.log('Request body:', body);
    // Get current user from localStorage
    let currentUser = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = window.localStorage.getItem('mock_current_user');
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
        } catch {}
      }
    }
    // Fallback: if no current user in localStorage, try to find by email or username
    if (!currentUser && body.email) {
      currentUser = users.find(u => u.email === body.email || u.username === body.email);
      console.log('Found user by email fallback:', currentUser);
    }
    // If still no user, use the first active user as fallback
    if (!currentUser) {
      currentUser = users.find(u => u.status === 'active');
      console.log('Using first active user as fallback:', currentUser);
    }
    console.log('Current user:', currentUser);
    if (currentUser) {
      // Update the current user with new data
      const updatedUser = { 
        ...currentUser, 
        ...body,
        lastUpdated: new Date().toISOString()
      };
      console.log('Updated user:', updatedUser);
      // Update in localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('mock_current_user', JSON.stringify(updatedUser));
      }
      // Update in users array
      users = users.map(u => u.id === currentUser.id ? updatedUser : u);
      saveUsersToStorage();
      
      // Log the activity
      const activityEntry = {
        id: String(Date.now()),
        action: `Profile updated: ${body.name ? 'Name' : ''} ${body.email ? 'Email' : ''} ${body.phone ? 'Phone' : ''} ${body.organization ? 'Organization' : ''}`.trim(),
        time: new Date().toISOString(),
        type: 'profile'
      };
      activityLogs.push(activityEntry);
      
      console.log('Profile updated successfully');
      return new Response(JSON.stringify({ success: true, message: 'Profile updated successfully.', user: updatedUser }), { status: 200 });
    }
    console.log('User not found, returning 404');
    return new Response(JSON.stringify({ success: false, message: 'User not found.' }), { status: 404 });
  }),

  // Auth
  http.post('/api/v1/auth/login', ({ request }) => {
    // Always sync global users from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUsers = window.localStorage.getItem('mock_users');
      if (storedUsers) {
        try {
          users = JSON.parse(storedUsers);
        } catch {}
      }
    }
    return request.json().then(({ username, password }) => {
      // Always read users from localStorage
      let localUsers = users;
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedUsers = window.localStorage.getItem('mock_users');
        if (storedUsers) {
          try {
            localUsers = JSON.parse(storedUsers);
          } catch {}
        }
      }
      let user = localUsers.find(u => (u.username === username || u.email === username));
      if (!user) {
        return new Response(JSON.stringify({ message: 'Email not registered' }), { status: 401 });
      }
      if (user.password !== password) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
      }
      // Save current user to localStorage for /me endpoint
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('mock_current_user', JSON.stringify(user));
        console.log('Saved current user to localStorage:', user);
      }
      return new Response(JSON.stringify({
          token: 'fake_jwt_token',
          user: { id: user.id, username: user.username, email: user.email, role: user.canonicalRole || 'USER', tenantId: user.tenantId }
      }), { status: 200 });
    });
  }),
  http.post('/api/v1/auth/register', async ({ request }) => {
    // Always sync global users from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUsers = window.localStorage.getItem('mock_users');
      if (storedUsers) {
        try {
          users = JSON.parse(storedUsers);
        } catch {}
      }
    }
    const { username, email, password, role } = await request.json();
    let localUsers = users;
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUsers = window.localStorage.getItem('mock_users');
      if (storedUsers) {
        try {
          localUsers = JSON.parse(storedUsers);
        } catch {}
      }
    }
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return new Response(JSON.stringify({ message: 'Username must be alphanumeric' }), { status: 400 });
    }
    if (username.length < 3) {
      return new Response(JSON.stringify({ message: 'Username must be at least 3 characters' }), { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ message: 'Invalid email address' }), { status: 400 });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ message: 'Password must be at least 6 characters' }), { status: 400 });
    }
    if (localUsers.find(u => u.username === username)) {
      return new Response(JSON.stringify({ message: 'Username already exists' }), { status: 409 });
    }
    if (localUsers.find(u => u.email === email)) {
      return new Response(JSON.stringify({ message: 'Email already exists' }), { status: 409 });
    }
    // Map role string to roleId and canonical name
    let roleId = '5';
    let canonicalRole = 'USER';
    switch (role) {
      case 'System Administrator':
        roleId = '0';
        canonicalRole = 'ADMINISTRATOR';
        break;
      case 'Tenant Administrator':
        roleId = '1';
        canonicalRole = 'TENANT_ADMIN';
        break;
      case 'Manager / Org Admin':
        roleId = '2';
        canonicalRole = 'ORG_MANAGER';
        break;
      case 'User (Regular Staff/Employee)':
        roleId = '3';
        canonicalRole = 'USER';
        break;
      case 'Viewer / Read-only User':
        roleId = '4';
        canonicalRole = 'VIEWER';
        break;
      case 'User':
        roleId = '3';
        canonicalRole = 'USER';
        break;
      default:
        roleId = '3';
        canonicalRole = 'USER';
    }
    const newUser = {
      id: String(Date.now()),
      username,
      email,
      password,
      status: 'active',
      roles: [roleId],
      tenantId: '1',
      canonicalRole,
    };
    localUsers.push(newUser);
    users = localUsers;
    saveUsersToStorage();
    // Save current user to localStorage for /me endpoint
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('mock_current_user', JSON.stringify(newUser));
    }
    activityLogs.push({ id: String(Date.now()), action: `User ${username} registered and is pending approval`, time: new Date().toISOString(), type: 'user' });
    return new Response(JSON.stringify({
      token: 'fake_jwt_token',
      user: { id: newUser.id, username: newUser.username, email: newUser.email, role: canonicalRole, tenantId: newUser.tenantId }
    }), { status: 201 });
  }),

  // Tenants
  http.get('/api/v1/tenants', () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTenants = window.localStorage.getItem('mock_tenants');
      if (storedTenants) {
        try {
          tenants = JSON.parse(storedTenants);
        } catch {}
      }
    }
    return new Response(JSON.stringify(tenants), { status: 200 });
  }),
  http.post('/api/v1/tenants', async ({ request }) => {
    const body = await request.json();
    const newTenant = { ...body, id: String(Date.now()) };
    tenants.push(newTenant);
    saveTenantsToStorage();
    return new Response(JSON.stringify(newTenant), { status: 201 });
  }),
  http.get('/api/v1/tenants/:id', ({ params }) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTenants = window.localStorage.getItem('mock_tenants');
      if (storedTenants) {
        try {
          tenants = JSON.parse(storedTenants);
        } catch {}
      }
    }
    const tenant = tenants.find(t => t.id === params.id);
    return tenant ? new Response(JSON.stringify(tenant), { status: 200 }) : new Response(null, { status: 404 });
  }),
  http.put('/api/v1/tenants/:id', async ({ params, request }) => {
    const body = await request.json();
    tenants = tenants.map(t => t.id === params.id ? { ...t, ...body } : t);
    saveTenantsToStorage();
    return new Response(JSON.stringify(tenants.find(t => t.id === params.id)), { status: 200 });
  }),
  http.get('/api/v1/tenants/:id/settings', ({ params }) => {
    return new Response(JSON.stringify(tenantSettings[params.id] || { domain: '', email: '', theme: 'dark' }), { status: 200 });
  }),
  http.put('/api/v1/tenants/:id/settings', async ({ params, request }) => {
    const body = await request.json();
    tenantSettings[params.id] = body;
    return new Response(JSON.stringify(tenantSettings[params.id]), { status: 200 });
  }),

  // Organizations
  http.get('/api/v1/tenants/:tenantId/organizations', ({ params }) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedOrganizations = window.localStorage.getItem('mock_organizations');
      if (storedOrganizations) {
        try {
          organizations = JSON.parse(storedOrganizations);
        } catch {}
      }
    }
    const orgs = organizations.filter(o => o.tenantId === params.tenantId);
    return new Response(JSON.stringify(orgs), { status: 200 });
  }),
  http.post('/api/v1/tenants/:tenantId/organizations', async ({ params, request }) => {
    const body = await request.json();
    const newOrg = { ...body, id: String(Date.now()), tenantId: params.tenantId };
    organizations.push(newOrg);
    saveOrganizationsToStorage();
    return new Response(JSON.stringify(newOrg), { status: 201 });
  }),
  http.get('/api/v1/tenants/:tenantId/organizations/:id', ({ params }) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedOrganizations = window.localStorage.getItem('mock_organizations');
      if (storedOrganizations) {
        try {
          organizations = JSON.parse(storedOrganizations);
        } catch {}
      }
    }
    const org = organizations.find(o => o.id === params.id && o.tenantId === params.tenantId);
    return org ? new Response(JSON.stringify(org), { status: 200 }) : new Response(null, { status: 404 });
  }),
  http.put('/api/v1/tenants/:tenantId/organizations/:id', async ({ params, request }) => {
    const body = await request.json();
    organizations = organizations.map(o => o.id === params.id ? { ...o, ...body } : o);
    saveOrganizationsToStorage();
    return new Response(JSON.stringify(organizations.find(o => o.id === params.id)), { status: 200 });
  }),
  http.delete('/api/v1/tenants/:tenantId/organizations/:id', ({ params }) => {
    organizations = organizations.filter(o => !(o.id === params.id && o.tenantId === params.tenantId));
    saveOrganizationsToStorage();
    return new Response(JSON.stringify({}), { status: 200 });
  }),
  http.get('/api/v1/tenants/:tenantId/organizations/:id/profile', ({ params }) => {
    const org = organizations.find(o => o.id === params.id && o.tenantId === params.tenantId);
    return org ? new Response(JSON.stringify({ name: org.name, description: org.description || '' }), { status: 200 }) : new Response(null, { status: 404 });
  }),
  http.put('/api/v1/tenants/:tenantId/organizations/:id/profile', async ({ params, request }) => {
    const body = await request.json();
    organizations = organizations.map(o => o.id === params.id && o.tenantId === params.tenantId ? { ...o, ...body } : o);
    return new Response(JSON.stringify(organizations.find(o => o.id === params.id && o.tenantId === params.tenantId)), { status: 200 });
  }),

  // Users
  http.get('/api/v1/tenants/:tenantId/users', ({ params }) => {
    const tenantUsers = users.filter(u => u.tenantId === params.tenantId);
    return new Response(JSON.stringify(tenantUsers), { status: 200 });
  }),
  http.post('/api/v1/tenants/:tenantId/users', async ({ params, request }) => {
    const body = await request.json();
    const newUser = { ...body, id: String(Date.now()), tenantId: params.tenantId, status: 'active', roles: body.roles || ['3'], canonicalRole: 'USER' };
    users.push(newUser);
    saveUsersToStorage();
    return new Response(JSON.stringify(newUser), { status: 201 });
  }),
  http.get('/api/v1/tenants/:tenantId/users/:id', ({ params }) => {
    const user = users.find(u => u.tenantId === params.tenantId && u.id === params.id);
    return user ? new Response(JSON.stringify(user), { status: 200 }) : new Response(null, { status: 404 });
  }),
  http.put('/api/v1/tenants/:tenantId/users/:id', async ({ params, request }) => {
    const body = await request.json();
    users = users.map(u => u.tenantId === params.tenantId && u.id === params.id ? { ...u, ...body } : u);
    saveUsersToStorage();
    return new Response(JSON.stringify(users.find(u => u.tenantId === params.tenantId && u.id === params.id)), { status: 200 });
  }),
  http.delete('/api/v1/tenants/:tenantId/users/:id', ({ params }) => {
    users = users.filter(u => !(u.tenantId === params.tenantId && u.id === params.id));
    saveUsersToStorage();
    return new Response(null, { status: 204 });
  }),

  // User roles
  http.get('/api/v1/tenants/:tenantId/users/:id/roles', ({ params }) => {
    const user = users.find(u => u.tenantId === params.tenantId && u.id === params.id);
    return user ? new Response(JSON.stringify(user.roles || []), { status: 200 }) : new Response(null, { status: 404 });
  }),
  http.post('/api/v1/tenants/:tenantId/users/:id/roles', async ({ params, request }) => {
    const { roleId } = await request.json();
    users = users.map(u => u.tenantId === params.tenantId && u.id === params.id ? { ...u, roles: [...(u.roles || []), roleId] } : u);
    saveUsersToStorage();
    return new Response(JSON.stringify(users.find(u => u.tenantId === params.tenantId && u.id === params.id)), { status: 200 });
  }),
  http.delete('/api/v1/tenants/:tenantId/users/:id/roles/:roleId', ({ params }) => {
    users = users.map(u => u.tenantId === params.tenantId && u.id === params.id ? { ...u, roles: (u.roles || []).filter(r => r !== params.roleId) } : u);
    saveUsersToStorage();
    return new Response(JSON.stringify(users.find(u => u.tenantId === params.tenantId && u.id === params.id)), { status: 200 });
  }),

  // Roles
  http.get('/api/v1/tenants/:tenantId/roles', ({ params }) => {
    const tenantRoles = roles.filter(r => r.tenantId === params.tenantId);
    return new Response(JSON.stringify(tenantRoles), { status: 200 });
  }),
  http.post('/api/v1/tenants/:tenantId/roles', async ({ params, request }) => {
    const body = await request.json();
    const newRole = { ...body, id: String(Date.now()), tenantId: params.tenantId, privileges: body.privileges || [] };
    roles.push(newRole);
    return new Response(JSON.stringify(newRole), { status: 201 });
  }),
  http.get('/api/v1/tenants/:tenantId/roles/:id', ({ params }) => {
    const role = roles.find(r => r.tenantId === params.tenantId && r.id === params.id);
    return role ? new Response(JSON.stringify(role), { status: 200 }) : new Response(null, { status: 404 });
  }),
  http.put('/api/v1/tenants/:tenantId/roles/:id', async ({ params, request }) => {
    const body = await request.json();
    roles = roles.map(r => r.tenantId === params.tenantId && r.id === params.id ? { ...r, ...body } : r);
    return new Response(JSON.stringify(roles.find(r => r.tenantId === params.tenantId && r.id === params.id)), { status: 200 });
  }),
  http.post('/api/v1/tenants/:tenantId/roles/:roleId/privileges/:privilegeId/link', ({ params }) => {
    roles = roles.map(r => r.tenantId === params.tenantId && r.id === params.roleId ? { ...r, privileges: [...(r.privileges || []), params.privilegeId] } : r);
    return new Response(JSON.stringify(roles.find(r => r.tenantId === params.tenantId && r.id === params.roleId)), { status: 200 });
  }),
  http.post('/api/v1/tenants/:tenantId/roles/:roleId/privileges/:privilegeId/unlink', ({ params }) => {
    roles = roles.map(r => r.tenantId === params.tenantId && r.id === params.roleId ? { ...r, privileges: (r.privileges || []).filter(p => p !== params.privilegeId) } : r);
    return new Response(JSON.stringify(roles.find(r => r.tenantId === params.tenantId && r.id === params.roleId)), { status: 200 });
  }),

  // Privileges
  http.get('/api/v1/tenants/:tenantId/privileges', ({ params }) => {
    const tenantPrivileges = privileges.filter(p => p.tenantId === params.tenantId || !p.tenantId);
    return new Response(JSON.stringify(tenantPrivileges), { status: 200 });
  }),
  http.post('/api/v1/tenants/:tenantId/privileges', async ({ params, request }) => {
    const body = await request.json();
    const newPrivilege = { ...body, id: String(Date.now()), tenantId: params.tenantId };
    privileges.push(newPrivilege);
    return new Response(JSON.stringify(newPrivilege), { status: 201 });
  }),
  http.get('/api/v1/tenants/:tenantId/privileges/:id', ({ params }) => {
    const privilege = privileges.find(p => (p.tenantId === params.tenantId || !p.tenantId) && p.id === params.id);
    return privilege ? new Response(JSON.stringify(privilege), { status: 200 }) : new Response(null, { status: 404 });
  }),
  http.put('/api/v1/tenants/:tenantId/privileges/:id', async ({ params, request }) => {
    const body = await request.json();
    privileges = privileges.map(p => (p.tenantId === params.tenantId || !p.tenantId) && p.id === params.id ? { ...p, ...body } : p);
    return new Response(JSON.stringify(privileges.find(p => (p.tenantId === params.tenantId || !p.tenantId) && p.id === params.id)), { status: 200 });
  }),

  // Legal Entities
  http.get('/api/v1/tenants/:tenantId/legal-entities', ({ params }) => {
    const tenantEntities = legalEntities.filter(e => e.tenantId === params.tenantId);
    return new Response(JSON.stringify(tenantEntities), { status: 200 });
  }),
  http.post('/api/v1/tenants/:tenantId/legal-entities', async ({ params, request }) => {
    const body = await request.json();
    const newEntity = { ...body, id: String(Date.now()), tenantId: params.tenantId };
    legalEntities.push(newEntity);
    return new Response(JSON.stringify(newEntity), { status: 201 });
  }),
  http.get('/api/v1/tenants/:tenantId/legal-entities/:id', ({ params }) => {
    const entity = legalEntities.find(e => e.tenantId === params.tenantId && e.id === params.id);
    return entity ? new Response(JSON.stringify(entity), { status: 200 }) : new Response(null, { status: 404 });
  }),
  http.put('/api/v1/tenants/:tenantId/legal-entities/:id', async ({ params, request }) => {
    const body = await request.json();
    legalEntities = legalEntities.map(e => e.tenantId === params.tenantId && e.id === params.id ? { ...e, ...body } : e);
    return new Response(JSON.stringify(legalEntities.find(e => e.tenantId === params.tenantId && e.id === params.id)), { status: 200 });
  }),

  // Endpoint for Tenant Admins to list pending users
  http.get('/api/v1/tenants/:tenantId/pending-users', ({ params }) => {
    const pending = users.filter(u => u.tenantId === params.tenantId && u.status === 'pending');
    return new Response(JSON.stringify(pending), { status: 200 });
  }),

  // Endpoint to approve/reject users
  http.post('/api/v1/tenants/:tenantId/users/:id/approve', ({ params }) => {
    users = users.map(u => u.id === params.id ? { ...u, status: 'active' } : u);
    const user = users.find(u => u.id === params.id);
    activityLogs.push({ id: String(Date.now()), action: `TenantAdmin approved user ${user.username}`, time: new Date().toISOString(), type: 'user' });
    activityLogs.push({ id: String(Date.now()), action: `Welcome email sent to ${user.email}`, time: new Date().toISOString(), type: 'email' });
    saveUsersToStorage();
    return new Response(JSON.stringify(user), { status: 200 });
  }),
  http.post('/api/v1/tenants/:tenantId/users/:id/reject', ({ params }) => {
    const user = users.find(u => u.id === params.id);
    users = users.filter(u => u.id !== params.id);
    activityLogs.push({ id: String(Date.now()), action: `TenantAdmin rejected user ${user.username}`, time: new Date().toISOString(), type: 'user' });
    saveUsersToStorage();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }),

  // Endpoint to get activity logs
  http.get('/api/v1/activity-logs', () => {
    return new Response(JSON.stringify(activityLogs), { status: 200 });
  }),

  // Profile (me) - GET
  http.get('/api/v1/me', ({ request }) => {
    // Simulate auth by token (in real app, parse token)
    const token = request.headers.get('Authorization');
    // For this mock, expect token to be 'Bearer fake_jwt_token' and get user from localStorage/session
    let user = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = window.localStorage.getItem('mock_current_user');
      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch {}
      }
    }
    // Fallback: try to find the first active user
    if (!user) {
      user = users.find(u => u.status === 'active') || users[0];
    }
    return new Response(JSON.stringify(user), { status: 200 });
  }),
  // Password change
  http.put('/api/v1/me/password', async ({ request }) => {
    // Accept any password change for demo
    return new Response(JSON.stringify({ success: true, message: 'Password changed successfully.' }), { status: 200 });
  }),
  // Notification preferences
  http.get('/api/v1/me/notifications', () => {
    return new Response(JSON.stringify({ email: true, sms: false, push: true }), { status: 200 });
  }),
  http.put('/api/v1/me/notifications', async ({ request }) => {
    const prefs = await request.json();
    // Accept any update for demo
    return new Response(JSON.stringify({ ...prefs, success: true }), { status: 200 });
  }),
  // Activity logs
  http.get('/api/v1/me/activity', () => {
    // Get current user from localStorage
    let currentUser = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = window.localStorage.getItem('mock_current_user');
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
        } catch {}
      }
    }
    
    // Create user-specific activity logs
    const userActivity = [
      { id: 'a1', action: `Logged in as ${currentUser?.username || 'User'}`, time: new Date().toISOString() },
      { id: 'a2', action: 'Viewed profile', time: new Date(Date.now() - 5 * 60 * 1000).toISOString() }, // 5 minutes ago
      { id: 'a3', action: 'Updated profile information', time: new Date(Date.now() - 2 * 60 * 1000).toISOString() }, // 2 minutes ago
    ];
    
    // Add any recent profile updates
    if (currentUser?.lastUpdated) {
      userActivity.unshift({
        id: 'a4',
        action: `Profile updated: ${currentUser.lastUpdated}`,
        time: new Date().toISOString()
      });
    }
    
    return new Response(JSON.stringify(userActivity), { status: 200 });
  })
];