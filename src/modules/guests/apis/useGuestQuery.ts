import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
//====================================
// Interfaces
//====================================

export interface guestData {
  data: object;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async (params: any) => {
  const { data } = await axiosClient.get<ResponseDto>(
    `/guest/getGuestList?page=${params.page?.value?.currentPage}&limit=${params.limit}&keyword=${params.keyword.value}&countrySn=${params.countrySn.value}`,
  );
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useGuestQuery = (params: any) => {
  return useQuery<ResponseDto | any>([QUERY_KEY.GUESTS, { params }], () => fetchFn(params));
};
