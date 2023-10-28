import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  password: yup.string().required('No password provided.').min(8, 'Password is too short - should be 8 chars minimum.'),
  email: yup.string().required('Please enter email').email('Please enter valid email').trim(),
});

export const registerSchema = yup.object().shape({
  gender: yup.string().required('Please select gender').nullable().min(0).max(1),
  email: yup.string().optional().email('Please enter valid email').trim(),
  lastName: yup.string().required('Please enter last name').trim(),
  firstName: yup.string().required('Please enter first name').trim(),
});

export const OtpSchema = yup.object().shape({
  otp: yup.string().required('Please enter otp').min(4, 'Otp is too short - should be 4 chars minimum.'),
  mobile: yup.string().required('Please enter phone number'),
});

export const emailValidate = yup.object().shape({
  email: yup.string().required('Please enter email').email('Please enter valid email').trim(),
});

export const postAJobValidate = yup.object().shape({
  skills: yup.array().min(1, 'Skills field must have at least 1 item').required('Please add at least one skills'),
  interview_process: yup.array().min(1, 'Interview must have 1 step').required('Please add at least one skills'),
  to: yup.string().required('Please enter to').trim(),
  from: yup.string().required('Please enter from').trim(),
  select_timepriode: yup.string().required('Please select time period').trim(),
  qualification: yup.array().min(1, 'Qualification field must have at least 1 item').required(),
  resposiblities: yup.array().min(1, 'Responsibilities field must have at least 1 item').required(),
  department: yup.string().required('Please select department').trim(),
  description: yup.string().required('Please enter description').trim(),
  employment_type: yup.string().required('Please select employment type').trim(),
  min_education_requirement: yup.string().required('Please enter minimum education').trim(),
  workplace_type: yup.string().required('Please select work type').trim(),
  name: yup.string().required('Please enter job title').trim(),
});

export const editSchema = yup.object().shape({
  email: yup.string().required('Please enter email').email('Please enter valid email').trim(),
  phone_no: yup.string().required('Please enter phone number').trim(),
  country_code: yup.string().required('Please enter country code'),
  zipcode: yup.string().required('Please select zipcode').trim(),
  city: yup.string().required('Please select city'),
  state: yup.string().required('Please select state').nullable(),
  country: yup.string().required('Please select country ').trim(),
  street_address: yup.string().required('Please enter street address').trim(),
  address: yup.string().required('Please enter address').trim(),
  about_company: yup.string().required('Please enter about company').trim(),
  company_type: yup.string().required('Please select company type'),
  company_size: yup.string().required('Please select company size').nullable().default('1'),
  industry_name: yup.string().required('Please enter industry name').trim(),
  website_url: yup.string().required('Please enter websiteUrl').url('Invalid website url').trim(),
  tagline: yup.string().required('Please enter tagline').trim(),
  name: yup.string().required('Please enter company name').trim(),
  logo: yup.string().required('Please upload image').nullable(),
});

export const validateNumber = yup.string().min(10, 'Please enter valid phone number').max(10).required('Please enter valid phone number');
