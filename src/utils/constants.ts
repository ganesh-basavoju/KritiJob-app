
//src/utils/constants.tsob


// const device_ip = "192.168.31.242"

export const API_BASE_URL = `https://kriti-job-backend.vercel.app/api`
// export const API_BASE_URL = `http://${device_ip}:5000/api`

//export const SOCKET_URL = `http://${device_Ip}:5000`


export const ITEMS_PER_PAGE = 20;

export const JOB_TYPES = [
  {label: 'Full Time', value: 'Full-Time'},
  {label: 'Part Time', value: 'Part-Time'},
  {label: 'Contract', value: 'Contract'},
  {label: 'Internship', value: 'Internship'},
  {label: 'Freelance', value: 'Freelance'},
];

export const EXPERIENCE_LEVELS = [
  {label: 'Entry Level', value: 'Entry Level'},
  {label: 'Intermediate', value: 'Intermediate'},
  {label: 'Expert', value: 'Expert'},
];

export const APPLICATION_STATUS = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  accepted: 'Accepted',
};

export const NOTIFICATION_TYPES = {
  job_alert: 'Job Alert',
  application_status: 'Application Update',
  new_applicant: 'New Applicant',
  general: 'General',
};
