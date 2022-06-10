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

const fetchFn = async (keyword: 1) => {
  const { data } = await axiosClient.get<ResponseDto>(
    `/inventory/extraProperty/getProductUnitList?keyword=${keyword}`,
  );

  return data.data ? data.data : [];
};

//====================================
// MAIN FUNCTION
//====================================

export const useProductUnitQuery = (keyword: any) => {
  return useQuery([QUERY_KEY.UNIT_PRODUCT_SERVICES, keyword], () => fetchFn(keyword.value));
};
