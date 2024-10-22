import * as Yup from 'yup';

export const commonValidationSchema = {
  fullName: Yup.string().min(10, 'Full name must be at least 10 characters long').required('Full name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
    .required('Password is required'),
  newPassword: Yup.string()
    .min(8, 'New Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'New Password must contain at least one uppercase letter')
    .matches(/\d/, 'New Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'New Password must contain at least one special character')
    .required('New Password is required'),
  confirmedPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirmed password is required'),
  confirmedNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'New Passwords must match')
    .required('Confirmed password is required'),
  otp: Yup.string()
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
    .required('OTP is required'),
  dateOfBirt: Yup.date()
    .required('Date Of Birt is required')
    .nullable()
    .max(new Date(), 'Date Of Birt cannot be in the future'),
};

export const createValidationSchema = (customFields) => {
  return Yup.object().shape({
    ...customFields,
  });
};
