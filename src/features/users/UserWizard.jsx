import React, { useState } from 'react';
import DynamicForm from '../../components/atoms/DynamicForm';
import useOrganizationStore from '../../store/organizationStore';
import useRoleStore from '../../store/roleStore';
import { toast } from 'react-toastify';

const steps = [
  {
    label: 'Basic Info',
    schema: {
      fields: [
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'text', required: true },
        { name: 'status', label: 'Status', type: 'select', required: true, options: [ { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' } ] }
      ]
    }
  },
  {
    label: 'Organization',
    schema: {
      fields: [
        { name: 'organizationId', label: 'Organization', type: 'select', required: true, options: [] }
      ]
    }
  },
  {
    label: 'Roles',
    schema: {
      fields: [
        { name: 'roles', label: 'Roles', type: 'select', required: true, options: [], multiple: true }
      ]
    }
  }
];

const UserWizard = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const { organizations, fetchOrganizations } = useOrganizationStore();
  const { roles, fetchRoles } = useRoleStore();

  React.useEffect(() => { fetchOrganizations('1'); fetchRoles('1'); }, [fetchOrganizations, fetchRoles]);
  React.useEffect(() => {
    steps[1].schema.fields[0].options = organizations.map(o => ({ value: o.id, label: o.name }));
    steps[2].schema.fields[0].options = roles.map(r => ({ value: r.id, label: r.name }));
  }, [organizations, roles]);

  const handleNext = async (formData) => {
    setData(prev => ({ ...prev, ...formData }));
    if (step < steps.length - 1) setStep(s => s + 1);
    else {
      // Final submit
      try {
        // Simulate API call
        toast.success('User created!');
        onComplete && onComplete();
      } catch (e) {
        toast.error('Failed to create user');
      }
    }
  };

  const handlePrev = () => setStep(s => Math.max(0, s - 1));

  return (
    <div style={{ background: 'var(--card)', borderRadius: 24, boxShadow: 'var(--shadow)', padding: 32, maxWidth: 520, margin: '0 auto', color: 'var(--text)' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= step ? '#fff' : '#333' }} />
        ))}
      </div>
      <h2 style={{ color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 16 }}>{steps[step].label}</h2>
      <DynamicForm schema={steps[step].schema} initialData={data} onSubmit={handleNext} autoSave={true} />
      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        <button onClick={handlePrev} disabled={step === 0} style={{ background: '#232323', color: '#fff', border: '1.5px solid #333', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '8px 18px', cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.6 : 1 }}>Previous</button>
        <button onClick={() => handleNext(data)} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 16, padding: '8px 18px', cursor: 'pointer' }}>{step === steps.length - 1 ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
};

export default UserWizard; 