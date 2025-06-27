import React from 'react';
import useRBACStore from '../store/rbacStore';

export const RBACWrapper = ({ 
  children, 
  resource, 
  action, 
  fallback = null 
}) => {
  const { can } = useRBACStore();

  // Check if user has permission
  if (!can(resource, action)) {
    return fallback || (
      <div className="text-red-500">
        You do not have permission to access this resource
      </div>
    );
  }

  return children;
};

export const FieldRBAC = ({ resource, action, children, fallback = null }) => {
  const { can } = useRBACStore();
  if (!can(resource, action)) return fallback;
  return children;
};

// Usage example
export const UserManagementPage = () => {
  return (
    <RBACWrapper 
      resource="users" 
      action="view"
      fallback={<UnauthorizedMessage />}
    >
      <UserList />
    </RBACWrapper>
  );
};