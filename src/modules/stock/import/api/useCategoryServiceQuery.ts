// import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { useInfiniteQuery } from 'vue-query';

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

export const useCategoryServiceQuery = () => {
  return useInfiniteQuery(QUERY_KEY.CATEGORY_SERVICES, fetchFn, {
    // getNextPageParam: (lastPage, pages) => lastPage.meta.lastPage,
  });
};
