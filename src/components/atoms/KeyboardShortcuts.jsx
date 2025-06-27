import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KeyboardShortcuts = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.querySelector('input[placeholder="Search..."]')?.focus();
      }
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        document.querySelector('button, input[type="submit"]')?.click();
      }
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        document.querySelector('button[type="submit"]')?.click();
      }
      if (e.altKey && e.key === 'l') {
        e.preventDefault();
        navigate('/logout');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
  return null;
};

export default KeyboardShortcuts; 