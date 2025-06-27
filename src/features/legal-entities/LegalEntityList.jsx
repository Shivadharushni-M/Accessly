import React, { useEffect, useState } from 'react';
import useLegalEntityStore from '../../store/legalEntityStore';
import { useForm } from 'react-hook-form';
import { RBACWrapper } from '../../components/RBACWrapper';
import SkeletonTable from '../../components/SkeletonTable';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const LegalEntityForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: initialData || {} });
  useEffect(() => { reset(initialData || {}); }, [initialData, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input {...register('name', { required: true })} placeholder="Entity Name" className="w-full p-2 border rounded bg-black text-white placeholder-gray-400" />
      <input {...register('type', { required: true })} placeholder="Type" className="w-full p-2 border rounded bg-black text-white placeholder-gray-400" />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded">Save</button>
        {onCancel && <button type="button" onClick={onCancel} className="bg-gray-700 text-white px-4 py-2 rounded">Cancel</button>}
      </div>
    </form>
  );
};

const LegalEntityList = () => {
  const tenantId = '1'; // For demo, use tenant 1
  const { legalEntities, loading, error, fetchLegalEntities, createLegalEntity, updateLegalEntity, deleteLegalEntity } = useLegalEntityStore();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { t } = useTranslation();

  useEffect(() => { fetchLegalEntities(tenantId); }, [fetchLegalEntities, tenantId]);

  const handleCreate = async (data) => {
    await createLegalEntity(tenantId, data);
    setShowForm(false);
    toast.success('Entity created');
  };
  const handleEdit = async (data) => {
    await updateLegalEntity(tenantId, editing.id, data);
    setEditing(null);
    toast.success('Entity updated');
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this entity?')) {
      await deleteLegalEntity(tenantId, id);
      toast.success('Entity deleted');
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
          }}>{t('Legal Entities')}</h1>
          <RBACWrapper resource="legal-entities" action="create">
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
              + {t('New Entity')}
            </button>
          </RBACWrapper>
        </div>
        {showForm && <LegalEntityForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}
        {editing && <LegalEntityForm initialData={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />}
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
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Type</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {legalEntities.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', background: 'none' }}
                    onMouseEnter={ev => ev.currentTarget.style.background = '#232323'}
                    onMouseLeave={ev => ev.currentTarget.style.background = 'none'}>
                    <td style={{ padding: '18px 24px', fontSize: 18, fontWeight: 500, fontFamily: 'Inter, Playfair Display, serif' }}>{e.name}</td>
                    <td style={{ padding: '18px 24px', fontSize: 18, fontWeight: 500, fontFamily: 'Inter, Playfair Display, serif' }}>{e.type}</td>
                    <td style={{ padding: '18px 24px', display: 'flex', gap: 8 }}>
                      <RBACWrapper resource="legal-entities" action="update">
                        <button
                          onClick={() => setEditing(e)}
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
                      <RBACWrapper resource="legal-entities" action="delete">
                        <button
                          onClick={() => handleDelete(e.id)}
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

export default LegalEntityList; 