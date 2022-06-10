import { date } from 'quasar';
// import { FORMAT_DATE_TIME_UI, FORMAT_DATE_TIME_PICKER } from '~/constants';
const $date = date.formatDate;
export const createNewDate = (date: string) => {
  const [dateComponents, timeComponents] = date.split(' ');
  const [day, month, year] = dateComponents.split('/');
  const [hours, minutes] = timeComponents.split(':');
  const dateReturn = new Date(+year, Number(month) - 1, +day, +hours, +minutes);
  return dateReturn;
};
export const convertTimeZone = (timeStamp: number, isUTC = true) => {
  const date = new Date(timeStamp);
  const UTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getDate(), 0, 0, 0);
  const localTimeZone = new Date(new Date(timeStamp).toLocaleString());
  return isUTC ? UTC : localTimeZone.getTime();
};
export const newDateStamp = (date: number, formatDate: string) => {
  return $date(new Date(date * 1000), formatDate);
};
