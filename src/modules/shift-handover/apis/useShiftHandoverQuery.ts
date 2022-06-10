import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================
export interface IShiftHandoverVariables {
  startingBalance: number;
  totalCashReceipts: number;
  totalCashPayments: number;
  endBalance: number;
  startedAt: string;

  cashInSafe: number;
  cashForTheNextShift: number;
  cashWithdrawals: number;
  cashReceiver: number;
  note: string;
  password: string;
}

export interface IPoliciesQueryResDatum {
  data: IShiftHandoverVariables;
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};
//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<ResponseDto>('/shiftHandover/getShiftHandoverInfo');
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useShiftHandoverQuery = () => {
  return useQuery<IShiftHandoverVariables>(QUERY_KEY.SHIFT_HANDOVER, fetchFn);
};
