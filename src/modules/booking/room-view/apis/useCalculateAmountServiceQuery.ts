import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================

export interface ICaculatorAddServiceParams {
  categorySn: number;
  importPrice: string;
  productSn: number;
  productUnitName: string;
  quantity: number;
  sn: number;
  total: string;
}

export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICaculatorAddServiceParams) => {
  const { data } = await axiosClient.post<ResponseDto>(
    '/inventory/stock/calculateAmountProduct',
    payload,
  );
  return data;
};

//====================================
// Main Function
//====================================

export const useCalculateAddServiceMutation = () => {
  return useMutation<any, AxiosError<TMutationResErr>, ICaculatorAddServiceParams>(fetchFn, {
    // onSuccess: () => {
    //   // updateFloorsQueryCache(resData);
    //   // updateRoomssQueryCache(resData);
    // },
  });
};
