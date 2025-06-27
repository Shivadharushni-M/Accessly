import * as yup from 'yup';

// Advanced validation patterns
export const validationPatterns = {
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[1-9]\d{1,14}$/
};

export const validationSchemas = () => {
  const { t } = require('react-i18next').useTranslation();
  return {
    login: yup.object().shape({
      username: yup
        .string()
        .required(t('Username is required'))
        .matches(
          validationPatterns.username, 
          t('Username must be 3-20 characters, alphanumeric')
        ),
      password: yup
        .string()
        .required(t('Password is required'))
        .matches(
          validationPatterns.password,
          t('Password must include uppercase, lowercase, number, and special character')
        )
    }),
    user: yup.object().shape({
      firstName: yup
        .string()
        .required(t('First name is required'))
        .min(2, t('First name must be at least 2 characters'))
        .max(50, t('First name must be at most 50 characters')),
      lastName: yup
        .string()
        .required(t('Last name is required'))
        .min(2, t('Last name must be at least 2 characters'))
        .max(50, t('Last name must be at most 50 characters')),
      email: yup
        .string()
        .required(t('Email is required'))
        .matches(validationPatterns.email, t('Invalid email format')),
      phone: yup
        .string()
        .matches(validationPatterns.phone, t('Invalid phone number'))
        .optional(),
      role: yup
        .string()
        .required(t('Role is required'))
        .oneOf(['ADMIN', 'MANAGER', 'USER'], t('Invalid role')),
      status: yup
        .string()
        .oneOf(['ACTIVE', 'INACTIVE', 'SUSPENDED'], t('Invalid status'))
    }),
    tenant: yup.object().shape({
      name: yup
        .string()
        .required(t('Tenant name is required'))
        .min(2, t('Tenant name must be at least 2 characters'))
        .max(100, t('Tenant name must be at most 100 characters')),
      domain: yup
        .string()
        .required(t('Domain is required'))
        .matches(/^[a-z0-9-]+$/, t('Invalid domain format')),
      email: yup
        .string()
        .required(t('Contact email is required'))
        .matches(validationPatterns.email, t('Invalid email format'))
    })
  };
};

// Custom validation hook
export const useValidation = (schema) => {
  const [errors, setErrors] = useState({});

  const validate = async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        if (error.path) {
          validationErrors[error.path] = error.message;
        }
      });
      setErrors(validationErrors);
      return false;
    }
  };

  return { errors, validate };
};