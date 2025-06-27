# 🧩 Component Documentation - Accessly User Management System

Complete component reference with PropTypes, usage examples, and implementation details for all React components in the Accessly User Management System.

## 📋 Table of Contents

- [🔧 Atomic Components](#-atomic-components)
- [🧬 Molecular Components](#-molecular-components)
- [🏗 Organism Components](#-organism-components)
- [📄 Feature Components](#-feature-components)
- [🎨 Layout Components](#-layout-components)
- [🔧 Utility Components](#-utility-components)
- [📊 Data Display Components](#-data-display-components)

---

## 🔧 Atomic Components

### Button Component
*File*: src/components/atoms/Button.jsx

A versatile button component with multiple variants and states.

#### PropTypes
javascript
Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'link']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right'])
}


#### Default Props
javascript
Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  type: 'button',
  iconPosition: 'left'
}


#### Usage Examples

*Basic Button*
jsx
import Button from './components/atoms/Button';

<Button onClick={() => console.log('Clicked!')}>
  Click Me
</Button>


*Primary Button with Icon*
jsx
<Button variant="primary" icon={<PlusIcon />}>
  Add User
</Button>


*Danger Button with Loading State*
jsx
<Button 
  variant="danger" 
  loading={isDeleting}
  onClick={handleDelete}
>
  Delete User
</Button>


*Full Width Submit Button*
jsx
<Button 
  type="submit" 
  fullWidth 
  loading={isSubmitting}
>
  Save Changes
</Button>


---

### Input Component
*File*: src/components/atoms/Input.jsx

A flexible input component with validation states and various types.

#### PropTypes
javascript
Input.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url', 'search']),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.bool,
  label: PropTypes.string,
  helperText: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool
}


#### Default Props
javascript
Input.defaultProps = {
  type: 'text',
  disabled: false,
  required: false,
  success: false,
  iconPosition: 'left',
  fullWidth: false
}


#### Usage Examples

*Basic Text Input*
jsx
import Input from './components/atoms/Input';

<Input
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>


*Email Input with Validation*
jsx
<Input
  type="email"
  label="Email Address"
  value={email}
  onChange={handleEmailChange}
  error={emailError}
  required
  helperText="We'll never share your email"
/>


*Password Input with Icon*
jsx
<Input
  type="password"
  label="Password"
  value={password}
  onChange={handlePasswordChange}
  icon={<LockIcon />}
  error={passwordError}
/>


*Search Input*
jsx
<Input
  type="search"
  placeholder="Search users..."
  value={searchTerm}
  onChange={handleSearch}
  icon={<SearchIcon />}
  iconPosition="right"
/>


---

### Modal Component
*File*: src/components/atoms/Modal.jsx

A modal dialog component with backdrop and keyboard support.

#### PropTypes
javascript
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  closeOnBackdrop: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
  backdropClassName: PropTypes.string,
  contentClassName: PropTypes.string
}


#### Default Props
javascript
Modal.defaultProps = {
  size: 'md',
  closeOnBackdrop: true,
  closeOnEscape: true,
  showCloseButton: true
}


#### Usage Examples

*Basic Modal*
jsx
import Modal from './components/atoms/Modal';

const [isModalOpen, setIsModalOpen] = useState(false);

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
  <div className="flex gap-2 mt-4">
    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </div>
</Modal>


*Large Modal with Custom Content*
jsx
<Modal
  isOpen={isUserModalOpen}
  onClose={() => setIsUserModalOpen(false)}
  title="User Details"
  size="lg"
>
  <UserProfile user={selectedUser} />
</Modal>


*Modal without Close Button*
jsx
<Modal
  isOpen={isProcessing}
  onClose={() => {}} // No-op for processing state
  title="Processing..."
  showCloseButton={false}
  closeOnBackdrop={false}
  closeOnEscape={false}
>
  <div className="text-center">
    <Spinner />
    <p>Please wait while we process your request...</p>
  </div>
</Modal>


---

### Sidebar Component
*File*: src/components/atoms/Sidebar.jsx

A responsive sidebar navigation component with role-based menu items.

#### PropTypes
javascript
Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userRole: PropTypes.oneOf(['ADMINISTRATOR', 'TENANT_ADMIN', 'USER']).isRequired,
  currentPath: PropTypes.string,
  className: PropTypes.string
}


#### Usage Examples

*Basic Sidebar*
jsx
import Sidebar from './components/atoms/Sidebar';

<Sidebar
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
  userRole={user.role}
  currentPath={location.pathname}
/>


---

### DynamicForm Component
*File*: src/components/atoms/DynamicForm.jsx

A dynamic form component that renders fields based on configuration.

#### PropTypes
javascript
DynamicForm.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'email', 'password', 'select', 'textarea', 'checkbox', 'radio']).isRequired,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })),
    validation: PropTypes.object,
    placeholder: PropTypes.string,
    helperText: PropTypes.string
  })).isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  loading: PropTypes.bool,
  submitText: PropTypes.string,
  className: PropTypes.string
}


#### Default Props
javascript
DynamicForm.defaultProps = {
  initialValues: {},
  loading: false,
  submitText: 'Submit'
}


#### Usage Examples

*User Registration Form*
jsx
import DynamicForm from './components/atoms/DynamicForm';

const registrationFields = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    required: true,
    validation: { minLength: 3 }
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    validation: { minLength: 6 }
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    options: [
      { value: 'USER', label: 'User' },
      { value: 'TENANT_ADMIN', label: 'Tenant Administrator' },
      { value: 'ADMINISTRATOR', label: 'System Administrator' }
    ]
  }
];

<DynamicForm
  fields={registrationFields}
  onSubmit={handleRegistration}
  submitText="Register"
  loading={isRegistering}
/>


*Profile Update Form*
jsx
const profileFields = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel'
  },
  {
    name: 'organization',
    label: 'Organization',
    type: 'text'
  },
  {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Tell us about yourself...'
  }
];

<DynamicForm
  fields={profileFields}
  onSubmit={handleProfileUpdate}
  initialValues={userProfile}
  submitText="Update Profile"
/>


---

### AdvancedFilter Component
*File*: src/components/atoms/AdvancedFilter.jsx

An advanced filtering component with multiple filter types and operators.

#### PropTypes
javascript
AdvancedFilter.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'select', 'date', 'number', 'boolean']).isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    })),
    operators: PropTypes.arrayOf(PropTypes.string)
  })).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  className: PropTypes.string,
  showAdvanced: PropTypes.bool
}


#### Default Props
javascript
AdvancedFilter.defaultProps = {
  showAdvanced: false
}


#### Usage Examples

*User List Filter*
jsx
import AdvancedFilter from './components/atoms/AdvancedFilter';

const userFilters = [
  {
    field: 'username',
    label: 'Username',
    type: 'text',
    operators: ['contains', 'equals', 'starts_with']
  },
  {
    field: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'USER', label: 'User' },
      { value: 'TENANT_ADMIN', label: 'Tenant Admin' },
      { value: 'ADMINISTRATOR', label: 'System Administrator' }
    ]
  },
  {
    field: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' }
    ]
  },
  {
    field: 'createdAt',
    label: 'Created Date',
    type: 'date',
    operators: ['equals', 'before', 'after', 'between']
  }
];

<AdvancedFilter
  filters={userFilters}
  onFilterChange={handleFilterChange}
  onClear={handleClearFilters}
/>


---

### KeyboardShortcuts Component
*File*: src/components/atoms/KeyboardShortcuts.jsx

A component for managing keyboard shortcuts and hotkeys.

#### PropTypes
javascript
KeyboardShortcuts.propTypes = {
  shortcuts: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    modifier: PropTypes.oneOf(['ctrl', 'alt', 'shift', 'meta']),
    global: PropTypes.bool
  })).isRequired,
  enabled: PropTypes.bool,
  className: PropTypes.string
}


#### Default Props
javascript
KeyboardShortcuts.defaultProps = {
  enabled: true
}


#### Usage Examples

*Global Shortcuts*
jsx
import KeyboardShortcuts from './components/atoms/KeyboardShortcuts';

const shortcuts = [
  {
    key: 'n',
    description: 'New User',
    action: () => setShowNewUserModal(true),
    modifier: 'ctrl',
    global: true
  },
  {
    key: 's',
    description: 'Save',
    action: handleSave,
    modifier: 'ctrl',
    global: true
  },
  {
    key: 'Escape',
    description: 'Close Modal',
    action: () => setShowModal(false),
    global: true
  }
];

<KeyboardShortcuts shortcuts={shortcuts} />


---

## 🧬 Molecular Components

### CRUDList Component
*File*: src/components/CRUDList.jsx

A comprehensive CRUD list component with filtering, sorting, and bulk operations.

#### PropTypes
javascript
CRUDList.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool,
    filterable: PropTypes.bool,
    render: PropTypes.func,
    width: PropTypes.string
  })).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  onBulkDelete: PropTypes.func,
  onBulkAction: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  emptyMessage: PropTypes.string,
  showFilters: PropTypes.bool,
  showSearch: PropTypes.bool,
  showPagination: PropTypes.bool,
  pageSize: PropTypes.number,
  className: PropTypes.string,
  selectable: PropTypes.bool,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    variant: PropTypes.string,
    icon: PropTypes.node
  }))
}


#### Default Props
javascript
CRUDList.defaultProps = {
  loading: false,
  emptyMessage: 'No data available',
  showFilters: true,
  showSearch: true,
  showPagination: true,
  pageSize: 10,
  selectable: false
}


#### Usage Examples

*User List*
jsx
import CRUDList from './components/CRUDList';

const userColumns = [
  {
    key: 'username',
    label: 'Username',
    sortable: true,
    filterable: true
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    filterable: true
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    filterable: true,
    render: (value) => <Badge variant={getRoleVariant(value)}>{value}</Badge>
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    render: (value) => <StatusBadge status={value} />
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    render: (value) => formatDate(value)
  }
];

const userActions = [
  {
    label: 'Edit',
    action: (user) => handleEditUser(user),
    variant: 'secondary',
    icon: <EditIcon />
  },
  {
    label: 'Delete',
    action: (user) => handleDeleteUser(user),
    variant: 'danger',
    icon: <DeleteIcon />
  }
];

<CRUDList
  data={users}
  columns={userColumns}
  onEdit={handleEditUser}
  onDelete={handleDeleteUser}
  onBulkDelete={handleBulkDelete}
  loading={isLoading}
  error={error}
  actions={userActions}
  selectable
/>


*Organization List*
jsx
const orgColumns = [
  {
    key: 'name',
    label: 'Organization Name',
    sortable: true,
    filterable: true
  },
  {
    key: 'description',
    label: 'Description',
    render: (value) => value || 'No description'
  },
  {
    key: 'userCount',
    label: 'Users',
    sortable: true,
    render: (value) => <Badge>{value}</Badge>
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    render: (value) => <StatusBadge status={value} />
  }
];

<CRUDList
  data={organizations}
  columns={orgColumns}
  onEdit={handleEditOrg}
  onDelete={handleDeleteOrg}
  onView={handleViewOrg}
  loading={isLoading}
  showFilters={false}
/>


---

### SkeletonTable Component
*File*: src/components/SkeletonTable.jsx

A skeleton loading component for tables and lists.

#### PropTypes
javascript
SkeletonTable.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  showHeader: PropTypes.bool,
  className: PropTypes.string
}


#### Default Props
javascript
SkeletonTable.defaultProps = {
  rows: 5,
  columns: 4,
  showHeader: true
}


#### Usage Examples

*Basic Skeleton*
jsx
import SkeletonTable from './components/SkeletonTable';

<SkeletonTable rows={10} columns={5} />


*Custom Skeleton*
jsx
<SkeletonTable 
  rows={8} 
  columns={6} 
  showHeader={false}
  className="my-custom-skeleton"
/>


---

### ErrorBoundary Component
*File*: src/components/ErrorBoundary.jsx

A React error boundary component for catching and handling errors.

#### PropTypes
javascript
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func,
  className: PropTypes.string
}


#### Usage Examples

*Basic Error Boundary*
jsx
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary>
  <UserList />
</ErrorBoundary>


*Custom Fallback*
jsx
const CustomFallback = ({ error, resetError }) => (
  <div className="error-container">
    <h2>Something went wrong</h2>
    <p>{error.message}</p>
    <Button onClick={resetError}>Try Again</Button>
  </div>
);

<ErrorBoundary fallback={CustomFallback}>
  <Dashboard />
</ErrorBoundary>


---

### RBACWrapper Component
*File*: src/components/RBACWrapper.jsx

A role-based access control wrapper component.

#### PropTypes
javascript
RBACWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  userRole: PropTypes.string.isRequired,
  fallback: PropTypes.node,
  className: PropTypes.string
}


#### Usage Examples

*Role-Based Content*
jsx
import RBACWrapper from './components/RBACWrapper';

<RBACWrapper 
  requiredRoles={['ADMINISTRATOR', 'TENANT_ADMIN']}
  userRole={user.role}
>
  <AdminPanel />
</RBACWrapper>


*With Custom Fallback*
jsx
<RBACWrapper 
  requiredRoles={['ADMINISTRATOR']}
  userRole={user.role}
  fallback={<AccessDenied />}
>
  <SystemSettings />
</RBACWrapper>


---

## 🏗 Organism Components

### UserList Component
*File*: src/features/users/UserList.jsx

A comprehensive user management component with full CRUD operations.

#### PropTypes
javascript
UserList.propTypes = {
  tenantId: PropTypes.string,
  userRole: PropTypes.string.isRequired,
  onUserSelect: PropTypes.func,
  className: PropTypes.string
}


#### Usage Examples

*Tenant Admin User List*
jsx
import UserList from './features/users/UserList';

<UserList 
  tenantId="1"
  userRole="TENANT_ADMIN"
  onUserSelect={handleUserSelect}
/>


*System Admin User List*
jsx
<UserList 
  userRole="ADMINISTRATOR"
  onUserSelect={handleUserSelect}
/>


---

### RoleList Component
*File*: src/features/roles/RoleList.jsx

A role management component with privilege assignment.

#### PropTypes
javascript
RoleList.propTypes = {
  tenantId: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  onRoleSelect: PropTypes.func,
  className: PropTypes.string
}


#### Usage Examples

*Role Management*
jsx
import RoleList from './features/roles/RoleList';

<RoleList 
  tenantId="1"
  userRole="TENANT_ADMIN"
  onRoleSelect={handleRoleSelect}
/>


---

### OrganizationList Component
*File*: src/features/organizations/OrganizationList.jsx

An organization management component with hierarchical structure.

#### PropTypes
javascript
OrganizationList.propTypes = {
  tenantId: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  onOrgSelect: PropTypes.func,
  className: PropTypes.string
}


#### Usage Examples

*Organization Management*
jsx
import OrganizationList from './features/organizations/OrganizationList';

<OrganizationList 
  tenantId="1"
  userRole="TENANT_ADMIN"
  onOrgSelect={handleOrgSelect}
/>


---

## 📄 Feature Components

### Dashboard Component
*File*: src/features/dashboard/Dashboard.jsx

The main dashboard component with role-based widgets and analytics.

#### PropTypes
javascript
Dashboard.propTypes = {
  userRole: PropTypes.string.isRequired,
  tenantId: PropTypes.string,
  className: PropTypes.string
}


#### Usage Examples

*System Administrator Dashboard*
jsx
import Dashboard from './features/dashboard/Dashboard';

<Dashboard 
  userRole="ADMINISTRATOR"
/>


*Tenant Admin Dashboard*
jsx
<Dashboard 
  userRole="TENANT_ADMIN"
  tenantId="1"
/>


*User Dashboard*
jsx
<Dashboard 
  userRole="USER"
  tenantId="1"
/>


---

### LoginPage Component
*File*: src/features/auth/LoginPage.jsx

The login page component with authentication form.

#### PropTypes
javascript
LoginPage.propTypes = {
  onLogin: PropTypes.func,
  redirectTo: PropTypes.string,
  className: PropTypes.string
}


#### Usage Examples

*Basic Login*
jsx
import LoginPage from './features/auth/LoginPage';

<LoginPage 
  onLogin={handleLogin}
  redirectTo="/dashboard"
/>


---

### RegisterPage Component
*File*: src/features/auth/RegisterPage.jsx

The registration page component with role selection.

#### PropTypes
javascript
RegisterPage.propTypes = {
  onRegister: PropTypes.func,
  redirectTo: PropTypes.string,
  className: PropTypes.string
}


#### Usage Examples

*User Registration*
jsx
import RegisterPage from './features/auth/RegisterPage';

<RegisterPage 
  onRegister={handleRegister}
  redirectTo="/dashboard"
/>


---

### UserProfile Component
*File*: src/features/users/UserProfile.jsx

A comprehensive user profile component with editing capabilities.

#### PropTypes
javascript
UserProfile.propTypes = {
  user: PropTypes.object,
  onUpdate: PropTypes.func,
  onPasswordChange: PropTypes.func,
  onNotificationUpdate: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string
}


#### Usage Examples

*User Profile*
jsx
import UserProfile from './features/users/UserProfile';

<UserProfile 
  user={currentUser}
  onUpdate={handleProfileUpdate}
  onPasswordChange={handlePasswordChange}
  onNotificationUpdate={handleNotificationUpdate}
  loading={isLoading}
/>


---

### UserWizard Component
*File*: src/features/users/UserWizard.jsx

A multi-step user creation wizard.

#### PropTypes
javascript
UserWizard.propTypes = {
  onComplete: PropTypes.func,
  onCancel: PropTypes.func,
  initialData: PropTypes.object,
  className: PropTypes.string
}


#### Usage Examples

*User Creation Wizard*
jsx
import UserWizard from './features/users/UserWizard';

<UserWizard 
  onComplete={handleUserCreated}
  onCancel={() => setShowWizard(false)}
  initialData={{ role: 'USER' }}
/>


---

## 🎨 Layout Components

### MainLayout Component
*File*: src/layouts/MainLayout.jsx

The main application layout with sidebar and header.

#### PropTypes
javascript
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object,
  onLogout: PropTypes.func,
  className: PropTypes.string
}


#### Usage Examples

*Main Application Layout*
jsx
import MainLayout from './layouts/MainLayout';

<MainLayout 
  user={currentUser}
  onLogout={handleLogout}
>
  <Dashboard />
</MainLayout>


---

## 🔧 Utility Components

### SocketProvider Component
*File*: src/features/dashboard/SocketProvider.jsx

A WebSocket provider for real-time updates.

#### PropTypes
javascript
SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  url: PropTypes.string,
  onMessage: PropTypes.func,
  onConnect: PropTypes.func,
  onDisconnect: PropTypes.func,
  className: PropTypes.string
}


#### Default Props
javascript
SocketProvider.defaultProps = {
  url: 'ws://localhost:3001'
}


#### Usage Examples

*Real-time Updates*
jsx
import SocketProvider from './features/dashboard/SocketProvider';

<SocketProvider 
  onMessage={handleRealTimeUpdate}
  onConnect={() => console.log('Connected')}
  onDisconnect={() => console.log('Disconnected')}
>
  <Dashboard />
</SocketProvider>


---

## 📊 Data Display Components

### Analytics Component
*File*: src/features/analytics/Analytics.jsx

An analytics dashboard with charts and metrics.

#### PropTypes
javascript
Analytics.propTypes = {
  data: PropTypes.object,
  timeRange: PropTypes.string,
  onTimeRangeChange: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string
}


#### Usage Examples

*Analytics Dashboard*
jsx
import Analytics from './features/analytics/Analytics';

<Analytics 
  data={analyticsData}
  timeRange="7d"
  onTimeRangeChange={handleTimeRangeChange}
  loading={isLoading}
/>


---

### AuditLog Component
*File*: src/features/audit/AuditLog.jsx

An audit log component for viewing system activities.

#### PropTypes
javascript
AuditLog.propTypes = {
  logs: PropTypes.array,
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string
}


#### Usage Examples

*Audit Log*
jsx
import AuditLog from './features/audit/AuditLog';

<AuditLog 
  logs={auditLogs}
  filters={currentFilters}
  onFilterChange={handleFilterChange}
  loading={isLoading}
/>


---

### BulkOps Component
*File*: src/features/bulk/BulkOps.jsx

A bulk operations component for managing multiple items.

#### PropTypes
javascript
BulkOps.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  onBulkAction: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    variant: PropTypes.string,
    icon: PropTypes.node
  })).isRequired,
  className: PropTypes.string
}


#### Usage Examples

*Bulk User Operations*
jsx
import BulkOps from './features/bulk/BulkOps';

const bulkActions = [
  {
    label: 'Activate',
    action: 'activate',
    variant: 'success',
    icon: <CheckIcon />
  },
  {
    label: 'Deactivate',
    action: 'deactivate',
    variant: 'warning',
    icon: <PauseIcon />
  },
  {
    label: 'Delete',
    action: 'delete',
    variant: 'danger',
    icon: <DeleteIcon />
  }
];

<BulkOps 
  selectedItems={selectedUsers}
  onBulkAction={handleBulkAction}
  actions={bulkActions}
/>


---

## 🎯 Component Best Practices

### 1. *PropTypes Validation*
Always define PropTypes for all components to catch type errors early:

jsx
import PropTypes from 'prop-types';

const MyComponent = ({ title, count, onAction }) => {
  // Component logic
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  onAction: PropTypes.func.isRequired
};

MyComponent.defaultProps = {
  count: 0
};


### 2. *Component Composition*
Use composition over inheritance for flexible component design:

jsx
// Good: Composition
<Card>
  <Card.Header>
    <Card.Title>User Details</Card.Title>
  </Card.Header>
  <Card.Body>
    <UserInfo user={user} />
  </Card.Body>
  <Card.Footer>
    <Button onClick={onSave}>Save</Button>
  </Card.Footer>
</Card>


### 3. *Error Boundaries*
Wrap components that might fail in error boundaries:

jsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <UserList />
</ErrorBoundary>


### 4. *Loading States*
Always provide loading states for async operations:

jsx
{loading ? (
  <SkeletonTable rows={5} columns={4} />
) : (
  <UserList data={users} />
)}


### 5. *Accessibility*
Include proper ARIA labels and keyboard navigation:

jsx
<Button
  aria-label="Delete user"
  onClick={handleDelete}
  onKeyDown={handleKeyDown}
>
  Delete
</Button>


---

## 🔧 Component Testing

### Example Test Structure
jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './components/atoms/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant class', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByText('Delete')).toHaveClass('btn-danger');
  });
});


---

