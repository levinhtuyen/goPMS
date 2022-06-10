import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { date } from 'quasar';
//====================================
// Interfaces
//====================================
export interface IPayload {
  address: string;
  country: {
    sn: number;
    name: string;
    isoCode: string;
    countryCode: string;
    currency: string;
  };
  countrySn: number;
  email: string;
  fullName: string;
  gender: number;
  guestSn: number;
  identityNumber: string;
  mobile: string;
  birthday: number | string;
  note: string;
  sn: number;
}
export interface IUpdateGuestVariables {
  data: object;
}
const TODAY = date.formatDate(new Date(), 'DD/MM/YYYY');

const reformatDate = (viVNDate = TODAY) => {
  const [day, month, year] = viVNDate.split('/');
  const dateTime = `${year}-${month}-${day}`;
  const dayFormatTimestamp = Number(date.formatDate(new Date(dateTime), 'X'));
  return dayFormatTimestamp;
};
export interface IUpdateStatusGuestResErr {
  message: string[];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IPayload) => {
  if (payload.birthday) {
    payload.birthday = reformatDate(payload.birthday as never);
  }
  const { data } = await axiosClient.post('/guest/updateGuest', payload);
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateGuestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseDto<null>,
    AxiosError<IUpdateStatusGuestResErr>,
    any | IUpdateGuestVariables
  >(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.GUESTS);
    },
  });
};
