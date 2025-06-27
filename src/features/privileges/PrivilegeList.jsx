import React, { useEffect, useState } from 'react';
import usePrivilegeStore from '../../store/privilegeStore';
import { useForm } from 'react-hook-form';
import { RBACWrapper } from '../../components/RBACWrapper';
import SkeletonTable from '../../components/SkeletonTable';
import { toast } from 'react-toastify';

const PrivilegeForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initialData || {} });
  useEffect(() => { reset(initialData || {}); }, [initialData, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input {...register('name', { required: true })} placeholder="Privilege Name" className="w-full p-2 border rounded bg-black text-white placeholder-gray-400" />
      <input {...register('category', { required: true })} placeholder="Category" className="w-full p-2 border rounded bg-black text-white placeholder-gray-400" />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Save</button>
        {onCancel && <button type="button" onClick={onCancel} className="bg-gray-700 text-white px-4 py-2 rounded">Cancel</button>}
      </div>
    </form>
  );
};

const PrivilegeList = () => {
  const tenantId = '1'; // For demo, use tenant 1
  const { privileges, loading, error, fetchPrivileges, createPrivilege, updatePrivilege, deletePrivilege } = usePrivilegeStore();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchPrivileges(tenantId); }, [fetchPrivileges, tenantId]);

  const handleCreate = async (data) => {
    await createPrivilege(tenantId, data);
    setShowForm(false);
    toast.success('Privilege created');
  };
  const handleEdit = async (data) => {
    await updatePrivilege(tenantId, editing.id, data);
    setEditing(null);
    toast.success('Privilege updated');
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this privilege?')) {
      await deletePrivilege(tenantId, id);
      toast.success('Privilege deleted');
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
          }}>Privileges</h1>
          <RBACWrapper resource="privileges" action="create">
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
              + New Privilege
            </button>
          </RBACWrapper>
        </div>
        {showForm && <PrivilegeForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
        {editing && <PrivilegeForm initialData={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />}
        {loading ? <SkeletonTable cols={3} /> : error ? <div className="text-red-500">{error}</div> : (
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
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Category</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {privileges.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', background: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#232323'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <td style={{ padding: '18px 24px', fontSize: 18, fontWeight: 500, fontFamily: 'Inter, Playfair Display, serif' }}>{p.name}</td>
                    <td style={{ padding: '18px 24px', fontSize: 18, fontWeight: 500, fontFamily: 'Inter, Playfair Display, serif' }}>{p.category}</td>
                    <td style={{ padding: '18px 24px', display: 'flex', gap: 8 }}>
                      <RBACWrapper resource="privileges" action="update">
                        <button
                          onClick={() => setEditing(p)}
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
                      <RBACWrapper resource="privileges" action="delete">
                        <button
                          onClick={() => handleDelete(p.id)}
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
    </div>
  );
};

export default PrivilegeList; 