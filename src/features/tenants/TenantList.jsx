import React, { useEffect, useState, useMemo } from 'react';
import useTenantStore from '../../store/tenantStore';
import { useForm } from 'react-hook-form';
import { RBACWrapper } from '../../components/RBACWrapper';
import Modal from '../../components/atoms/Modal';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { toast } from 'react-toastify';
import TenantSettings from './TenantSettings';
import { FieldRBAC } from '../../components/RBACWrapper';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';

const TenantForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialData || {} });
  useEffect(() => { reset(initialData || {}); }, [initialData, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Tenant Name" {...register('name', { required: 'Tenant name is required' })} error={errors.name?.message} placeholder="Tenant Name" />
      <div className="mb-4">
        <label className="block mb-2 text-white font-medium">Status</label>
        <select {...register('status', { required: 'Status is required' })} className="w-full px-4 py-3 rounded-lg bg-black text-white border border-gray-700 focus:border-white focus:ring-2 focus:ring-white transition-all">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status.message}</div>}
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="submit" variant="primary">Save</Button>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
};

const TenantList = () => {
  const { tenants, loading, error, fetchTenants, createTenant, updateTenant, deleteTenant } = useTenantStore();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(null);
  const [showSettings, setShowSettings] = useState(null);
  // Filters and pagination state
  const [filterStatus, setFilterStatus] = useState('');
  const [filterName, setFilterName] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const { t } = useTranslation();

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

  // Filtering and sorting
  const filteredTenants = useMemo(() => {
    let data = tenants;
    if (filterStatus) data = data.filter(t => t.status === filterStatus);
    if (filterName) data = data.filter(t => t.name.toLowerCase().includes(filterName.toLowerCase()));
    if (sortBy === 'created') {
      data = [...data].sort((a, b) => (sortDir === 'desc' ? (b.createdAt || 0) - (a.createdAt || 0) : (a.createdAt || 0) - (b.createdAt || 0)));
    } else if (sortBy === 'name') {
      data = [...data].sort((a, b) => sortDir === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
    }
    return data;
  }, [tenants, filterStatus, filterName, sortBy, sortDir]);
  const totalPages = Math.ceil(filteredTenants.length / pageSize);
  const paginatedTenants = filteredTenants.slice((page - 1) * pageSize, page * pageSize);

  // Overview card data
  const totalActive = tenants.filter(t => t.status === 'active').length;
  const totalInactive = tenants.filter(t => t.status === 'inactive').length;

  const handleCreate = async (data) => {
    await createTenant(data);
    setShowForm(false);
    toast.success(t('Tenant created'));
  };
  const handleEdit = async (data) => {
    await updateTenant(editing.id, data);
    setEditing(null);
    toast.success(t('Tenant updated'));
  };
  const handleDelete = async (id) => {
    await deleteTenant(id);
    setShowDelete(null);
    toast.success(t('Tenant deleted'));
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
        {/* Overview Card */}
        <div style={{
          display: 'flex',
          gap: 32,
          marginBottom: 32,
          background: '#18181b',
          borderRadius: 24,
          boxShadow: '0 4px 32px #000a',
          padding: 32,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{t('Tenants Overview')}</div>
            <div style={{ color: '#bdbdbd', fontSize: 18 }}>{t('Total')}: <b>{tenants.length}</b> | {t('Active')}: <b>{totalActive}</b> | {t('Inactive')}: <b>{totalInactive}</b></div>
          </div>
          <div style={{ color: '#a8a8a8', fontSize: 16 }}>{t('Page')} {page} {t('of')} {totalPages || 1}</div>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'center' }}>
          <input
            type="text"
            placeholder={t('Search by name...')}
            value={filterName}
            onChange={e => { setFilterName(e.target.value); setPage(1); }}
            style={{ padding: '12px 18px', borderRadius: 10, background: '#111', color: '#fff', border: '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none', minWidth: 220 }}
          />
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            style={{ padding: '12px 18px', borderRadius: 10, background: '#111', color: '#fff', border: '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none' }}
          >
            <option value="">{t('All Statuses')}</option>
            <option value="active">{t('Active')}</option>
            <option value="inactive">{t('Inactive')}</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: '12px 18px', borderRadius: 10, background: '#111', color: '#fff', border: '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none' }}
          >
            <option value="created">{t('Sort by Created')}</option>
            <option value="name">{t('Sort by Name')}</option>
          </select>
          <select
            value={sortDir}
            onChange={e => setSortDir(e.target.value)}
            style={{ padding: '12px 18px', borderRadius: 10, background: '#111', color: '#fff', border: '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none' }}
          >
            <option value="desc">{t('Desc')}</option>
            <option value="asc">{t('Asc')}</option>
          </select>
          <CSVLink
            data={filteredTenants}
            filename="tenants.csv"
            style={{
              background: '#4ade80',
              color: '#000',
              borderRadius: 10,
              padding: '12px 24px',
              fontWeight: 600,
              fontFamily: 'Inter, Playfair Display, serif',
              textDecoration: 'none',
              fontSize: 16,
              border: '1.5px solid #333',
              marginLeft: 8
            }}
          >
            Export CSV
          </CSVLink>
        </div>
        <div className="flex justify-between items-center mb-10">
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            letterSpacing: '-0.03em',
            textShadow: '0 2px 24px #fff2, 0 1px 0 #fff4',
          }}>{t('Tenants')}</h1>
          <FieldRBAC resource="tenants" action="create">
            <RBACWrapper resource="tenants" action="create">
              <Button onClick={() => setShowForm(true)} variant="primary">+ {t('New Tenant')}</Button>
            </RBACWrapper>
          </FieldRBAC>
        </div>
        <Modal open={showForm} onClose={() => setShowForm(false)} title={t('Create Tenant')}>
          <TenantForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Modal>
        <Modal open={!!editing} onClose={() => setEditing(null)} title={t('Edit Tenant')}>
          <TenantForm initialData={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
        </Modal>
        <Modal open={!!showDelete} onClose={() => setShowDelete(null)} title={t('Confirm Delete')}>
          <div className="mb-6 text-lg">{t('Are you sure you want to delete this tenant?')}</div>
          <div className="flex gap-2 justify-end">
            <Button variant="danger" onClick={() => handleDelete(showDelete)}>{t('Delete')}</Button>
            <Button variant="secondary" onClick={() => setShowDelete(null)}>{t('Cancel')}</Button>
          </div>
        </Modal>
        <Modal open={!!showSettings} onClose={() => setShowSettings(null)} title={t('Tenant Settings')}>
          {showSettings && <TenantSettings tenantId={showSettings.id} onClose={() => setShowSettings(null)} />}
        </Modal>
        {loading ? (
          <div style={{ margin: '40px 0' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: 48, background: '#18181b', borderRadius: 12, width: '100%', marginBottom: 16, opacity: 0.7, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : error ? <div style={{ color: '#ff4444', fontWeight: 500 }}>{error}</div> : (
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
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>{t('Name')}</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>{t('Status')}</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 600, color: '#bdbdbd', fontFamily: 'Inter, Playfair Display, serif', fontSize: 18 }}>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTenants.map(tenant => (
                  <tr key={tenant.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', background: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#232323'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <td style={{ padding: '18px 24px', fontSize: 18, fontWeight: 500, fontFamily: 'Inter, Playfair Display, serif' }}>{tenant.name}</td>
                    <td style={{ padding: '18px 24px', textTransform: 'capitalize', color: tenant.status === 'active' ? '#4ade80' : '#f87171', fontWeight: 600 }}>{tenant.status}</td>
                    <td style={{ padding: '18px 24px', display: 'flex', gap: 8 }}>
                      <RBACWrapper resource="tenants" action="update">
                        <Button variant="secondary" onClick={() => setEditing(tenant)}>{t('Edit')}</Button>
                      </RBACWrapper>
                      <RBACWrapper resource="tenants" action="delete">
                        <Button variant="danger" onClick={() => setShowDelete(tenant.id)}>{t('Delete')}</Button>
                      </RBACWrapper>
                      <Button variant="calligraphic" onClick={() => setShowSettings(tenant)}>{t('Settings')}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, margin: '32px 0' }}>
              <Button variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{t('Prev')}</Button>
              <span style={{ color: '#bdbdbd', fontSize: 16 }}>{t('Page')} {page} {t('of')} {totalPages || 1}</span>
              <Button variant="secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>{t('Next')}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantList; 