import { useCalculateBookingAmountMutation } from '../apis/useCalculateBookingAmountMutation';
import { date } from 'quasar';
import { FORMAT_DATE_TIME_PICKER } from '~/constants';
import { createNewDate } from '~/composable/useCreateDate';
import { isValidDate, isStartSmallerThanEnd } from '~/composable/useValidate';

export default function useCalCulator(formData: {
  useSuggestedPrice: number | null;
  roomTypeSn: number | null;
  roomSn: number | null;
  bookingTypeSn: number | null;
  checkIn: string;
  checkOut: string;
  bookingSourceSn: string;
  guestName: string;
  extraFee: number;
  pricingPlanName: string | undefined;
  roomPrice: number;
  guestInfo: any | null;
  identityNumber: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  totalCharge: number;
  depositMethod: number | null;
  amountDeposit: number;
  discount: number;
  balance: number;
  note: string;
  bookingStatusSn: number | null;
  pricingPlanSn: number | null;
}) {
  const { formatDate } = date;
  const calculatorBookingAmountMutation = useCalculateBookingAmountMutation();
  const calculateBookingAmount = () => {
    if (!formData.checkIn || !formData.checkOut || !formData.bookingTypeSn) {
      return false;
    }
    if (
      !isStartSmallerThanEnd(
        formatDate(formData.checkIn, FORMAT_DATE_TIME_PICKER),
        formatDate(formData.checkOut, FORMAT_DATE_TIME_PICKER),
      ) &&
      !isValidDate(formatDate(createNewDate(formData.checkIn), FORMAT_DATE_TIME_PICKER)) &&
      !isValidDate(formatDate(createNewDate(formData.checkOut), FORMAT_DATE_TIME_PICKER))
    ) {
      return false;
    }
    const params = {
      useSuggestedPrice: formData.useSuggestedPrice,
      pricingPlanSn: formData.pricingPlanSn,
      bookingType: formData.bookingTypeSn,
      checkinDateTime: Number(formatDate(createNewDate(formData.checkIn), 'X')),
      checkoutDateTime: Number(formatDate(createNewDate(formData.checkOut), 'X')),
      discount: formData.discount || 0,
      extraFee: formData.extraFee || 0,
      amountDeposit: formData.amountDeposit || 0,
    };
    calculatorBookingAmountMutation.mutate(params, {
      onSuccess: (data) => {
        formData.roomPrice = data.roomPrice;
        formData.totalCharge = data.totalCharge;
        formData.balance = data.balance;
      },
    });
  };
  return { calculateBookingAmount };
}
