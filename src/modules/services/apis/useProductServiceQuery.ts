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

// const fetchFn = async ({ pageParam = 1, queryKey }: QueryFunctionContext<QueryKey>) => {
//   console.log('getProductList');

//   if (typeof pageParam == 'number') {
//     const { data } = await axiosClient.get<ResponseDto>(
//       `/inventory/extraProperty/getProductList?page=${pageParam ? pageParam : 1}&categorySn=${
//         queryKey && queryKey[1] ? queryKey[1] : ''
//       }`,
//     );
//     return data.data;
//   }
// };

const fetchFn = async (categorySn: 0) => {
  const { data } = await axiosClient.get<ResponseDto>(
    `/inventory/extraProperty/getProductList?limit=-1&categorySn=${categorySn ? categorySn : ''}`,
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

// export const useProductServiceQuery = (categorySn: any) => {
//   console.log('useProductServiceQuery');
//   return useInfiniteQuery([QUERY_KEY.PRODUCT_SERVICES, categorySn], fetchFn, {
//     getNextPageParam: (lastPage, pages) => {
//       return pages.length + 1 <= lastPage.meta.lastPage ? pages.length + 1 : undefined;
//     },
//   });
// };

export const useProductServiceQuery = (categorySn: any) => {
  return useQuery([QUERY_KEY.PRODUCT_SERVICES, categorySn], () => fetchFn(categorySn.value));
};
