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
  birthday: number | string;
  countrySn: number;
  email: string;
  fullName: string;
  gender: number;
  identityNumber: string;
  mobile: string;
  note: string;
}
export interface ICreateGuestVariables {
  data: object;
}

export interface ICreateGuestResErr {
  message: string[];
}
const TODAY = date.formatDate(new Date(), 'DD/MM/YYYY');

const reformatDate = (viVNDate = TODAY) => {
  const [day, month, year] = viVNDate.split('/');
  const dateTime = `${year}-${month}-${day}`;
  const dayFormatTimestamp = Number(date.formatDate(new Date(dateTime), 'X'));
  return dayFormatTimestamp;
};
//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IPayload) => {
  if (payload.birthday) {
    payload.birthday = reformatDate(payload.birthday as never);
  }
  const { data } = await axiosClient.post('/guest/createGuest', payload);
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCreateGuestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseDto<null>, AxiosError<ICreateGuestResErr>, any>(fetchFn, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY.STAFF);
    },
  });
};
