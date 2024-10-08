import moment from 'moment';

export const formatDate = (isoString: string): string => {
  return moment(isoString).format('DD/MM/YYYY HH:mm:ss');
};

