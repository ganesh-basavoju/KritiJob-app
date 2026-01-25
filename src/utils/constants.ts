
//src/utils/constants.ts

const device_Ip = "192.168.31.242"

export const API_BASE_URL = "https://kriti-job-backend.vercel.app/api"

//export const SOCKET_URL = `http://${device_Ip}:5000`


export const ITEMS_PER_PAGE = 20;

export const JOB_TYPES = [
  {label: 'Full Time', value: 'full-time'},
  {label: 'Part Time', value: 'part-time'},
  {label: 'Contract', value: 'contract'},
  {label: 'Internship', value: 'internship'},
];

export const EXPERIENCE_LEVELS = [
  {label: 'Entry Level', value: '0-1'},
  {label: 'Mid Level', value: '2-5'},
  {label: 'Senior Level', value: '5+'},
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
