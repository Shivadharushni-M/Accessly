import React, { useState, useEffect } from 'react';
import { RBACWrapper } from './RBACWrapper';
import { errorHandler } from '../utils/errorHandler';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

export const CRUDList = ({
  store,
  resource,
  columns,
  CreateForm,
  EditForm
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { 
    items, 
    loading, 
    error, 
    fetchAll, 
    create, 
    update, 
    delete: deleteItem 
  } = store();
  const { t } = useTranslation();

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async (data) => {
    try {
      await create(data);
      setSelectedItem(null);
    } catch (err) {
      errorHandler.handle(err);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await update(selectedItem.id, data);
      setSelectedItem(null);
    } catch (err) {
      errorHandler.handle(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
    } catch (err) {
      errorHandler.handle(err);
    }
  };

  // Filtering
  const filtered = items.filter(item =>
    columns.some(col => String(item[col.key] || '').toLowerCase().includes(search.toLowerCase()))
  );
  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search..."
          style={{ padding: '10px 18px', borderRadius: 10, background: '#111', color: '#fff', border: '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none', minWidth: 200 }}
        />
        <CSVLink data={filtered} filename={`${resource}-export.csv`} style={{ color: '#fff', background: '#232323', border: '1.5px solid #333', borderRadius: 10, padding: '10px 18px', fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>Export CSV</CSVLink>
        <button onClick={() => {
          const ws = XLSX.utils.json_to_sheet(filtered);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, resource);
          XLSX.writeFile(wb, `${resource}-export.xlsx`);
        }} style={{ color: '#fff', background: '#232323', border: '1.5px solid #333', borderRadius: 10, padding: '10px 18px', fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Export Excel</button>
      </div>
      <RBACWrapper resource={resource} action="create">
        <CreateForm onSubmit={handleCreate} />
      </RBACWrapper>
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{t(col.label)}</th>
            ))}
            <th>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(item => (
            <tr key={item.id}>
              {columns.map(col => (
                <td key={col.key}>{item[col.key]}</td>
              ))}
              <td>
                <RBACWrapper resource={resource} action="update">
                  <button onClick={() => setSelectedItem(item)}>{t('Edit')}</button>
                </RBACWrapper>
                <RBACWrapper resource={resource} action="delete">
                  <button onClick={() => handleDelete(item.id)}>{t('Delete')}</button>
                </RBACWrapper>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: '#232323', color: '#fff', border: '1.5px solid #333', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '8px 18px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.6 : 1 }}>{t('Prev')}</button>
        <span style={{ color: '#fff', fontFamily: 'Inter, Playfair Display, serif', fontSize: 16 }}>{t('Page')} {page} {t('of')} {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: '#232323', color: '#fff', border: '1.5px solid #333', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '8px 18px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.6 : 1 }}>{t('Next')}</button>
      </div>
      {selectedItem && (
        <EditForm 
          initialData={selectedItem}
          onSubmit={handleUpdate}
          onCancel={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};