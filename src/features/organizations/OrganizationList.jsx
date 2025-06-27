import React, { useEffect, useState } from 'react';
import useOrganizationStore from '../../store/organizationStore';
import { useForm } from 'react-hook-form';
import { RBACWrapper } from '../../components/RBACWrapper';
import SkeletonTable from '../../components/SkeletonTable';
import { toast } from 'react-toastify';
import OrganizationProfile from './OrganizationProfile';
import Modal from '../../components/atoms/Modal';
import { useTranslation } from 'react-i18next';

const OrganizationForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initialData || {} });
  useEffect(() => { reset(initialData || {}); }, [initialData, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input {...register('name', { required: true })} placeholder="Organization Name" className="w-full p-2 border rounded bg-black text-white placeholder-gray-400" />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Save</button>
        {onCancel && <button type="button" onClick={onCancel} className="bg-gray-700 text-white px-4 py-2 rounded">Cancel</button>}
      </div>
    </form>
  );
};

const OrganizationList = () => {
  const tenantId = '1'; // For demo, use tenant 1
  const { organizations, loading, error, fetchOrganizations, createOrganization, updateOrganization, deleteOrganization } = useOrganizationStore();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(null);
  const { t } = useTranslation();

  useEffect(() => { fetchOrganizations(tenantId); }, [fetchOrganizations, tenantId]);

  const handleCreate = async (data) => {
    await createOrganization(tenantId, data);
    setShowForm(false);
    toast.success(t('Organization created'));
  };
  const handleEdit = async (data) => {
    await updateOrganization(tenantId, editing.id, data);
    setEditing(null);
    toast.success(t('Organization updated'));
  };
  const handleDelete = async (id) => {
    if (window.confirm(t('Delete this organization?'))){
      await deleteOrganization(tenantId, id);
      toast.success(t('Organization deleted'));
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
            color: 'var(--text)',
            margin: 0,
            letterSpacing: '-0.03em',
          }}>{t('Organizations')}</h1>
          <RBACWrapper resource="organizations" action="create">
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: 'var(--accent)',
                color: 'var(--text)',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                fontFamily: 'Inter, Playfair Display, serif',
                fontWeight: 600,
                fontSize: 18,
                padding: '12px 24px',
                cursor: 'pointer',
                boxShadow: '0 2px 12px #0002',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
            >
              + {t('New Organization')}
            </button>
          </RBACWrapper>
        </div>
        {showForm && <OrganizationForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
        {editing && <OrganizationForm initialData={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />}
        {loading ? <SkeletonTable cols={2} /> : error ? <div className="text-red-500">{error}</div> : (
          <div style={{
            overflowX: 'auto',
            borderRadius: '24px',
            boxShadow: 'var(--shadow)',
            background: 'var(--card)',
            marginTop: 24,
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: 'var(--text)', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>{t('Name')}</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: 'var(--text)', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', background: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--input-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <td style={{ padding: '18px 24px', fontSize: 18, fontWeight: 500, fontFamily: 'Inter, Playfair Display, serif', color: 'var(--text)' }}>{o.name}</td>
                    <td style={{ padding: '18px 24px', display: 'flex', gap: 8 }}>
                      <RBACWrapper resource="organizations" action="update">
                        <button
                          onClick={() => setEditing(o)}
                          style={{
                            background: 'var(--input-bg)',
                            color: 'var(--text)',
                            border: '1.5px solid var(--border)',
                            borderRadius: '10px',
                            fontFamily: 'Inter, Playfair Display, serif',
                            fontWeight: 600,
                            fontSize: 16,
                            padding: '8px 18px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px #0002',
                            transition: 'background 0.2s, box-shadow 0.2s',
                          }}
                        >
                          Edit
                        </button>
                      </RBACWrapper>
                      <RBACWrapper resource="organizations" action="delete">
                        <button
                          onClick={() => handleDelete(o.id)}
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
                      <button
                        onClick={() => setShowProfile(o)}
                        style={{
                          background: 'var(--accent)',
                          color: 'var(--text)',
                          border: '1.5px solid var(--border)',
                          borderRadius: '10px',
                          fontFamily: 'Inter, Playfair Display, serif',
                          fontWeight: 600,
                          fontSize: 16,
                          padding: '8px 18px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px #0002',
                          transition: 'background 0.2s, box-shadow 0.2s',
                        }}
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Modal open={!!showProfile} onClose={() => setShowProfile(null)} title="Organization Profile">
          {showProfile && <OrganizationProfile tenantId={tenantId} orgId={showProfile.id} onClose={() => setShowProfile(null)} />}
        </Modal>
      </div>
    </div>
  );
};

export default OrganizationList; 