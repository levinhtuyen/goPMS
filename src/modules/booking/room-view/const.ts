export const DEPOSIT_METHOD_OPTIONS = [
  {
    value: 1,
    label: 'Cash',
  },
  {
    value: 2,
    label: 'Credit card',
  },
  {
    value: 3,
    label: 'Bank transfer',
  },
  {
    value: 4,
    label: 'Debt',
  },
];

export const ROOM_STATUS_TYPES = [
  {
    typeName: 'Available',
    icon: 'meeting_room',
    color: 'blue-12',
    roomStatusSn: 1,
    numOfRoom: 0,
  },
  {
    typeName: 'booked',
    icon: 'event_available',
    color: 'orange-11',
    roomStatusSn: 2,
    numOfRoom: 0,
  },
  {
    typeName: 'not_arrived_yet',
    icon: 'event_available',
    color: 'deep-orange-11',
    roomStatusSn: 4,
    numOfRoom: 0,
  },
  {
    typeName: 'checked_in',
    icon: 'king_bed',
    color: 'green-11',
    roomStatusSn: 3,
    numOfRoom: 0,
  },
  {
    typeName: 'not_gone_yet',
    icon: 'update',
    color: 'amber-11',
    roomStatusSn: 5,
    numOfRoom: 0,
  },
  {
    typeName: 'dirty',
    icon: 'cleaning_services',
    color: 'light-blue-11',
    roomStatusSn: null,
    numOfRoom: 0,
  },
];

export const BOOKING_TYPE_OPTIONS = [
  {
    label: 'Hourly',
    value: 1,
  },
  {
    label: 'Overnight',
    value: 2,
  },
  {
    label: 'Daily',
    value: 3,
  },
];

export const BOOKING_STATUS_TYPES = [
  {
    typeName: 'Created',
    icon: 'event_available',
    color: 'orange-11',
    bookingStatusSn: 1,
  },
  {
    typeName: 'Not arrived yet',
    icon: 'event_available',
    color: 'deep-orange-11',
    bookingStatusSn: 4,
  },
  {
    typeName: 'Checked in',
    icon: 'king_bed',
    color: 'green-11',
    bookingStatusSn: 2,
  },
  {
    typeName: ' Not gone yet',
    icon: 'update',
    color: 'amber-11',
    bookingStatusSn: 5,
  },
  {
    typeName: 'Checked out',
    icon: 'cleaning_services',
    color: 'blue-11',
    bookingStatusSn: 6,
  },
  {
    typeName: 'Cancelled',
    icon: 'cleaning_services',
    color: 'grey-11',
    bookingStatusSn: 3,
  },
];
