import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { useInfiniteQuery } from 'vue-query';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';

//====================================
// Interfaces
//====================================
//====================================
// Fetch Function
//====================================

const fetchFn = async ({ pageParam = 1, queryKey }: QueryFunctionContext<QueryKey>) => {
  if (typeof pageParam === 'number') {
    const { data } = await axiosClient.get<ResponseDto>(
      `/inventory/extraProperty/getProductList?categorySn=${
        queryKey && queryKey[1] ? queryKey[1] : ''
      }&limit=1000&isActive=1`,
    );
    return data.data;
  }
};

//====================================
// MAIN FUNCTION
//====================================

export const useProductServiceQuery = (categorySn: any) => {
  return useInfiniteQuery([QUERY_KEY.PRODUCT_SERVICES, categorySn], fetchFn, {
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.meta.perPage < lastPage.meta.total) {
        return lastPage.meta.lastPage;
      } else {
        return false;
      }
    },
  });
};
