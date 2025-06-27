import React, { useState } from 'react';

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' }
];

const AdvancedFilter = ({ fields, onChange }) => {
  const [filters, setFilters] = useState([{ field: fields[0].name, operator: 'equals', value: '' }]);
  const [logic, setLogic] = useState('AND');

  const handleFilterChange = (idx, key, val) => {
    const updated = filters.map((f, i) => i === idx ? { ...f, [key]: val } : f);
    setFilters(updated);
    onChange({ logic, filters: updated });
  };

  const addFilter = () => {
    setFilters([...filters, { field: fields[0].name, operator: 'equals', value: '' }]);
  };

  const removeFilter = (idx) => {
    const updated = filters.filter((_, i) => i !== idx);
    setFilters(updated);
    onChange({ logic, filters: updated });
  };

  return (
    <div style={{ background: '#18181b', borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: '#fff', marginRight: 8 }}>Logic:</label>
        <select value={logic} onChange={e => { setLogic(e.target.value); onChange({ logic: e.target.value, filters }); }} style={{ padding: 6, borderRadius: 6 }}>
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      </div>
      {filters.map((f, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <select value={f.field} onChange={e => handleFilterChange(idx, 'field', e.target.value)} style={{ padding: 6, borderRadius: 6 }}>
            {fields.map(field => <option key={field.name} value={field.name}>{field.label}</option>)}
          </select>
          <select value={f.operator} onChange={e => handleFilterChange(idx, 'operator', e.target.value)} style={{ padding: 6, borderRadius: 6 }}>
            {operators.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
          <input value={f.value} onChange={e => handleFilterChange(idx, 'value', e.target.value)} style={{ padding: 6, borderRadius: 6, minWidth: 120 }} />
          <button onClick={() => removeFilter(idx)} style={{ color: '#fff', background: '#f87171', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Remove</button>
        </div>
      ))}
      <button onClick={addFilter} style={{ color: '#fff', background: '#232323', border: '1.5px solid #333', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', marginTop: 8 }}>Add Filter</button>
    </div>
  );
};

export default AdvancedFilter; 
