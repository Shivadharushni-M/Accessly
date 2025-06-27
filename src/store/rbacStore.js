import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useRBACStore = create(
  persist(
    (set, get) => ({
      userPermissions: {},
      setPermissions: (permissions) => {
        set({ userPermissions: permissions });
      },
      can: (resource, action) => {
        const permissions = get().userPermissions;
        return permissions[resource]?.includes(action) || false;
      },
      clearPermissions: () => {
        set({ userPermissions: {} });
      }
    }),
    { name: 'rbac-storage', storage: createJSONStorage(() => localStorage) }
  )
);

export default useRBACStore; 