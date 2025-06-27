import React, { useEffect, useState } from 'react';
import useUserStore from '../../store/userStore';
import useOrganizationStore from '../../store/organizationStore';
import { useForm } from 'react-hook-form';
import { RBACWrapper } from '../../components/RBACWrapper';
import SkeletonTable from '../../components/SkeletonTable';
import { toast } from 'react-toastify';
import UserWizard from './UserWizard';
import { useTranslation } from 'react-i18next';
import { FieldRBAC } from '../../components/RBACWrapper';
// import DynamicForm from '../components/atoms/DynamicForm';

const UserForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialData || {} });
  const { organizations, fetchOrganizations } = useOrganizationStore();
  React.useEffect(() => { reset(initialData || {}); }, [initialData, reset]);
  React.useEffect(() => { fetchOrganizations('1'); }, [fetchOrganizations]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ 
      background: 'var(--card)', 
      borderRadius: 16, 
      padding: 32, 
      boxShadow: 'var(--shadow)', 
      maxWidth: 420, 
      margin: '0 auto' 
    }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 24, letterSpacing: '-0.02em' }}>
        {initialData ? 'Edit User' : 'Create User'}
      </h2>
      <div style={{ marginBottom: 18 }}>
        <label style={{ color: '#bdbdbd', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', fontSize: 16 }}>Username</label>
        <input {...register('username', { required: 'Username is required' })} placeholder="Username" className="w-full p-2 border rounded bg-black text-white placeholder-gray-400" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #333', background: '#111', color: '#fff', fontSize: 16, marginTop: 6 }} />
        {errors.username && <div style={{ color: '#f87171', fontSize: 14, marginTop: 4 }}>{errors.username.message}</div>}
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ color: '#bdbdbd', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', fontSize: 16 }}>Email</label>
        <input {...register('email', { required: 'Email is required' })} placeholder="Email" className="w-full p-2 border rounded bg-black text-white placeholder-gray-400" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #333', background: '#111', color: '#fff', fontSize: 16, marginTop: 6 }} />
        {errors.email && <div style={{ color: '#f87171', fontSize: 14, marginTop: 4 }}>{errors.email.message}</div>}
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ color: '#bdbdbd', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', fontSize: 16 }}>Status</label>
        <select {...register('status', { required: 'Status is required' })} className="w-full p-2 border rounded bg-black text-white" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #333', background: '#111', color: '#fff', fontSize: 16, marginTop: 6 }}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
        {errors.status && <div style={{ color: '#f87171', fontSize: 14, marginTop: 4 }}>{errors.status.message}</div>}
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ color: '#bdbdbd', fontWeight: 600, fontFamily: 'Montserrat, sans-serif', fontSize: 16 }}>Organization</label>
        <select {...register('organizationId', { required: 'Organization is required' })} className="w-full p-2 border rounded bg-black text-white" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #333', background: '#111', color: '#fff', fontSize: 16, marginTop: 6 }}>
          <option value="">Select Organization</option>
          {organizations.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>
        {errors.organizationId && <div style={{ color: '#f87171', fontSize: 14, marginTop: 4 }}>{errors.organizationId.message}</div>}
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 24 }}>
        <button type="button" onClick={onCancel} style={{ background: '#232323', color: '#fff', border: '1.5px solid #333', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '10px 22px', cursor: 'pointer', boxShadow: '0 2px 8px #0008', transition: 'background 0.2s, box-shadow 0.2s' }}>Cancel</button>
        <button type="submit" style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '10px 22px', cursor: 'pointer', boxShadow: '0 2px 8px #0008', transition: 'background 0.2s, box-shadow 0.2s' }}>{initialData ? 'Save Changes' : 'Create User'}</button>
      </div>
    </form>
  );
};

const UserList = () => {
  const tenantId = '1'; // For demo, use tenant 1
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUserStore();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const { t } = useTranslation();

  useEffect(() => { fetchUsers(tenantId); }, [fetchUsers, tenantId]);

  const handleCreate = async (data) => {
    // Optimistic update
    const tempId = Date.now().toString();
    const optimisticUser = { ...data, id: tempId };
    useUserStore.setState(state => ({ users: [...state.users, optimisticUser] }));
    setShowForm(false);
    try {
      await createUser(tenantId, data);
      toast.success(t('User created!'));
      fetchUsers(tenantId);
    } catch (e) {
      useUserStore.setState(state => ({ users: state.users.filter(u => u.id !== tempId) }));
      toast.error(t('Failed to create user'));
    }
  };
  const handleEdit = async (data) => {
    await updateUser(tenantId, editing.id, data);
    setEditing(null);
    toast.success('User updated');
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      await deleteUser(tenantId, id);
      toast.success('User deleted');
    }
  };

  return (
    <div style={{
      padding: 32,
      background: 'var(--bg)',
      minHeight: '100vh',
      color: 'var(--text)',
      fontFamily: 'Inter, Playfair Display, JetBrains Mono, sans-serif',
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '100vw',
    }}>
      <div className="flex justify-between items-center mb-6">
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 700,
          color: '#fff',
          margin: 0,
          letterSpacing: '-0.03em',
          textShadow: '0 2px 24px #fff2, 0 1px 0 #fff4',
        }}>{t('Users')}</h1>
        <RBACWrapper resource="users" action="create">
          <button
            onClick={() => setShowWizard(true)}
            style={{
              background: 'linear-gradient(135deg, #18181b 0%, #222 100%)',
              color: '#fff',
              border: '1.5px solid #333',
              borderRadius: '12px',
              fontFamily: 'Inter, Playfair Display, serif',
              fontWeight: 600,
              fontSize: 18,
              padding: '12px 24px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px #0008',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            + {t('New User (Wizard)')}
          </button>
        </RBACWrapper>
      </div>
      {showWizard && <UserWizard onComplete={() => setShowWizard(false)} />}
      {showForm && <UserForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
      {editing && <UserForm initialData={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />}
      {loading ? <SkeletonTable cols={4} /> : error ? <div className="text-red-500">{error}</div> : (
        <div style={{
          background: 'var(--card)',
          borderRadius: 24,
          boxShadow: 'var(--shadow)',
          padding: 32,
          marginTop: 32,
          maxWidth: 1200,
          margin: '0 auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
              <tr style={{ borderBottom: '1.5px solid #222' }}>
                <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Username</th>
                <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Email</th>
                <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Status</th>
                <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', background: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#232323'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <td style={{ padding: '18px 24px', fontSize: 18, fontWeight: 500, fontFamily: 'Inter, Playfair Display, serif' }}>{u.username}</td>
                  <td style={{ padding: '18px 24px', fontSize: 18, fontWeight: 500, fontFamily: 'Inter, Playfair Display, serif' }}>{u.email}</td>
                  <td style={{ padding: '18px 24px', color: u.status === 'active' ? '#4ade80' : '#f87171', fontWeight: 600 }}>{u.status}</td>
                  <td style={{ padding: '18px 24px', display: 'flex', gap: 8 }}>
                  <RBACWrapper resource="users" action="update">
                      <button
                        onClick={() => setEditing(u)}
                        style={{
                          background: '#232323',
                          color: '#fff',
                          border: '1.5px solid #333',
                          borderRadius: '10px',
                          fontFamily: 'Inter, Playfair Display, serif',
                          fontWeight: 600,
                          fontSize: 16,
                          padding: '8px 18px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px #0008',
                          transition: 'background 0.2s, box-shadow 0.2s',
                        }}
                      >
                        Edit
                      </button>
                  </RBACWrapper>
                  <RBACWrapper resource="users" action="delete">
                      <button
                        onClick={() => handleDelete(u.id)}
                        style={{
                          background: '#f87171',
                          color: '#fff',
                          border: '1.5px solid #c53030',
                          borderRadius: '10px',
                          fontFamily: 'Inter, Playfair Display, serif',
                          fontWeight: 600,
                          fontSize: 16,
                          padding: '8px 18px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px #0008',
                          transition: 'background 0.2s, box-shadow 0.2s',
                        }}
                      >
                        Delete
                      </button>
                  </RBACWrapper>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default UserList; 