import React, { useEffect, useState } from 'react';
import useRoleStore from '../../store/roleStore';
import usePrivilegeStore from '../../store/privilegeStore';
import { useForm } from 'react-hook-form';
import { RBACWrapper } from '../../components/RBACWrapper';
import SkeletonTable from '../../components/SkeletonTable';
import { toast } from 'react-toastify';
import Modal from '../../components/atoms/Modal';

const RoleForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initialData || {} });
  useEffect(() => { reset(initialData || {}); }, [initialData, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input {...register('name', { required: true })} placeholder="Role Name" className="w-full p-2 border rounded bg-black text-white placeholder-gray-400" />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Save</button>
        {onCancel && <button type="button" onClick={onCancel} className="bg-gray-700 text-white px-4 py-2 rounded">Cancel</button>}
      </div>
    </form>
  );
};

const PrivilegeLinker = ({ role, onClose }) => {
  const tenantId = '1';
  const { privileges, fetchPrivileges } = usePrivilegeStore();
  const [selected, setSelected] = useState(role.privileges || []);
  useEffect(() => { fetchPrivileges(tenantId); }, [fetchPrivileges, tenantId]);

  const handleToggle = (privId) => {
    setSelected(sel => sel.includes(privId) ? sel.filter(id => id !== privId) : [...sel, privId]);
  };

  const handleSave = async () => {
    try {
      // Simulate linking/unlinking by updating the role
      await useRoleStore.getState().updateRole(tenantId, role.id, { ...role, privileges: selected });
      toast.success('Privileges updated');
      onClose();
    } catch (e) {
      toast.error('Failed to update privileges');
    }
  };

  return (
    <Modal open={true} onClose={onClose} title={`Link Privileges to ${role.name}`}>
      <div style={{ maxHeight: 320, overflowY: 'auto', marginBottom: 24 }}>
        {privileges.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <input type="checkbox" checked={selected.includes(p.id)} onChange={() => handleToggle(p.id)} />
            <span style={{ marginLeft: 12, color: '#fff', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>{p.name} <span style={{ color: '#bdbdbd', fontSize: 14 }}>({p.category})</span></span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ background: '#232323', color: '#fff', border: '1.5px solid #333', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '8px 18px', cursor: 'pointer', boxShadow: '0 2px 8px #0008', transition: 'background 0.2s, box-shadow 0.2s' }}>Cancel</button>
        <button onClick={handleSave} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '8px 18px', cursor: 'pointer', boxShadow: '0 2px 8px #0008', transition: 'background 0.2s, box-shadow 0.2s' }}>Save</button>
      </div>
    </Modal>
  );
};

const RoleList = () => {
  const tenantId = '1'; // For demo, use tenant 1
  const { roles, loading, error, fetchRoles, createRole, updateRole, deleteRole } = useRoleStore();
  const { privileges } = usePrivilegeStore();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [linking, setLinking] = useState(null);

  useEffect(() => { fetchRoles(tenantId); }, [fetchRoles, tenantId]);

  const handleCreate = async (data) => {
    await createRole(tenantId, data);
    setShowForm(false);
    toast.success('Role created');
  };
  const handleEdit = async (data) => {
    await updateRole(tenantId, editing.id, data);
    setEditing(null);
    toast.success('Role updated');
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this role?')) {
      await deleteRole(tenantId, id);
      toast.success('Role deleted');
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
      <div style={{
        background: 'var(--card)',
        borderRadius: 24,
        boxShadow: 'var(--shadow)',
        padding: 32,
        margin: '0 auto 32px auto',
        maxWidth: 800,
        color: 'var(--text)'
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
          }}>Roles</h1>
          <RBACWrapper resource="roles" action="create">
            <button
              onClick={() => setShowForm(true)}
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
              + New Role
            </button>
          </RBACWrapper>
        </div>
        {showForm && <RoleForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
        {editing && <RoleForm initialData={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />}
        {loading ? <SkeletonTable cols={2} /> : error ? <div className="text-red-500">{error}</div> : (
          <div style={{
            overflowX: 'auto',
            borderRadius: '24px',
            boxShadow: '0 8px 48px 0 #000a',
            background: '#18181b',
            marginTop: 24,
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #222' }}>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Name</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', background: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#232323'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <td style={{ padding: '18px 24px', fontSize: 18, fontWeight: 500, fontFamily: 'Inter, Playfair Display, serif' }}>{r.name}</td>
                    <td style={{ padding: '18px 24px', display: 'flex', gap: 8 }}>
                      <RBACWrapper resource="roles" action="update">
                        <button
                          onClick={() => setEditing(r)}
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
                      <RBACWrapper resource="roles" action="delete">
                        <button
                          onClick={() => handleDelete(r.id)}
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
                      <RBACWrapper resource="roles" action="update">
                        <button
                          onClick={() => setLinking(r)}
                          style={{
                            background: 'linear-gradient(135deg, #18181b 0%, #222 100%)',
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
                          Link Privileges
                        </button>
                      </RBACWrapper>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {linking && <PrivilegeLinker role={linking} onClose={() => setLinking(null)} />}
      </div>
    </div>
  );
};

export default RoleList; 