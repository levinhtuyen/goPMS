// import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { useQuery } from 'vue-query';
// import { useInfiniteQuery } from 'vue-query';
// import { QueryFunctionContext, QueryKey } from 'vue-query/types';

//====================================
// Interfaces
//====================================

//====================================
// Fetch Function
//====================================

// const fetchFn = async ({ pageParam = 1, queryKey }: QueryFunctionContext<QueryKey>) => {
//   console.log('pageParam :', pageParam);
//   console.log('queryKey :', queryKey);
//   const { data } = await axiosClient.get<ResponseDto>(
//     `/inventory/extraProperty/getCategoryList?page=${pageParam}`,
//   );
//   return data.data;
// };

const fetchFn = async () => {
  const { data } = await axiosClient.get<ResponseDto>(
    `/inventory/extraProperty/getCategoryList?limit=-1`,
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

// export const useCategoryServiceQuery = () => {
//   return useInfiniteQuery(QUERY_KEY.CATEGORY_SERVICES, fetchFn, {
//     getNextPageParam: (lastPage) => {
//       if (lastPage.meta.currentPage == lastPage.meta.lastPage) {
//         return undefined;
//       } else {
//         return lastPage.meta.currentPage + 1;
//       }
//     },
//   });
// };

//====================================
// MAIN FUNCTION
//====================================

export const useCategoryServiceQuery = () => {
  return useQuery(QUERY_KEY.CATEGORY_SERVICES, fetchFn);
};
