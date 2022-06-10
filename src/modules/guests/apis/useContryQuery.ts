import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
//====================================
// Interfaces
//====================================

export interface countryData {
  data: any;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async (params: any) => {
  const { data } = await axiosClient.get<ResponseDto>(
    `/appendix/getCountryList?name=${params.value}&limit=-1`,
  );
  return data.data;
};

//======================== ============
// MAIN FUNCTION
//====================================

export const useCountryListQuery = (params: any) => {
  return useQuery<ResponseDto | any>([QUERY_KEY.GUESTS, params], () => fetchFn(params));
};
