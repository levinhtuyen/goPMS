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
    `/inventory/extraProperty/getCategoryList?limit=-1`,
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================
export const useCategoryServiceGetAllQuery = () => {
  return useQuery(QUERY_KEY.CATEGORY_SERVICES_ALL, fetchFn);
};
