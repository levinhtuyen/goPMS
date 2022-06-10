import { BOOKING_STATUS_TYPES } from '~/modules/booking/room-view/const';
export const setBookingStatus = (bookingStatusSn: number | null) => {
  return BOOKING_STATUS_TYPES.find((item) => item.bookingStatusSn === bookingStatusSn);
};
