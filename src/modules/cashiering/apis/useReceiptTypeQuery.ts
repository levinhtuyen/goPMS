import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { useQuery } from 'vue-query';

//====================================
// Interfaces
//====================================
//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<ResponseDto>(
    `/configuration/cashiering/getCategoryReceiptTypeList`,
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useReceiptTypeQuery = () => {
  return useQuery(QUERY_KEY.RECEIPT_TYPES, fetchFn);
};
