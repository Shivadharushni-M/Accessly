import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const DynamicForm = ({ schema, initialData = {}, onSubmit, autoSave = false }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty, isSubmitting } } = useForm({ defaultValues: initialData });

  useEffect(() => {
    if (autoSave) {
      const subscription = watch((data) => {
        if (isDirty) onSubmit(data, { auto: true });
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, isDirty, onSubmit, autoSave]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 480, margin: '0 auto' }}>
      {schema.fields.map(field => (
        <div key={field.name} style={{ marginBottom: 24 }}>
          <label style={{ color: '#fff', fontWeight: 500, marginBottom: 8, display: 'block' }}>{field.label}</label>
          {field.type === 'text' && (
            <input {...register(field.name, { required: field.required && `${field.label} required` })}
              style={{ width: '100%', padding: '14px 20px', borderRadius: 10, background: '#111', color: '#fff', border: errors[field.name] ? '1.5px solid #f87171' : '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none', marginBottom: 4 }}
            />
          )}
          {field.type === 'select' && (
            <select {...register(field.name, { required: field.required && `${field.label} required` })}
              style={{ width: '100%', padding: '14px 20px', borderRadius: 10, background: '#111', color: '#fff', border: errors[field.name] ? '1.5px solid #f87171' : '1.5px solid #333', fontSize: 16, fontFamily: 'Inter, Playfair Display, serif', outline: 'none', marginBottom: 4 }}>
              <option value="">Select {field.label}</option>
              {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          )}
          {field.type === 'checkbox' && (
            <input type="checkbox" {...register(field.name)} />
          )}
          {errors[field.name] && <div style={{ color: '#f87171', fontSize: 14 }}>{errors[field.name].message}</div>}
        </div>
      ))}
      <button type="submit" disabled={isSubmitting}
        style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 12, fontFamily: 'Inter, Playfair Display, serif', fontWeight: 600, fontSize: 18, padding: '12px 24px', cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: '0 2px 12px #0008', transition: 'background 0.2s, box-shadow 0.2s', opacity: isSubmitting ? 0.6 : 1 }}>
        Save
      </button>
    </form>
  );
};

export default DynamicForm; 