import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';

//====================================
// Interfaces
//====================================

export interface ICaculatorImportStockParams {
  categorySn: number;
  importPrice: string;
  productSn: number;
  productUnitName: string;
  quantity: number;
  sn: number;
  total: string;
}
export interface IImportStockQuery {
  stockSn: number;
  note: string;
  importStock: [
    {
      categorySn: number;
      productSn: number;
      quantity: number;
      importPrice: number;
    },
  ];
}
export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICaculatorImportStockParams) => {
  const { data } = await axiosClient.post<ResponseDto>(
    '/inventory/stock/calculateAmountImportStock',
    payload,
  );
  return data;
};

//====================================
// Main Function
//====================================

export const useCalculateImportStockMutaion = () => {
  return useMutation<any, AxiosError<TMutationResErr>, ICaculatorImportStockParams>(fetchFn, {
    // onSuccess: () => {
    //   // updateFloorsQueryCache(resData);
    //   // updateRoomssQueryCache(resData);
    // },
  });
};
