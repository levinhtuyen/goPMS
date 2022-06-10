import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { useQuery } from 'vue-query';

//====================================
// Interfaces
//====================================

interface ICategoriesQueryResData {
  categoryList: {
    isProduct: boolean;
    name: string;
    sn: number;
    status: number;
  }[];
  meta: {
    currentPage: number;
    from: number;
    lastPage: number;
    perPage: number;
    to: number;
    total: number;
  };
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<ResponseDto<ICategoriesQueryResData>>(
    `/inventory/extraProperty/getCategoryList?limit=1000&isActive=1`,
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useCategoriesQuery = () => {
  return useQuery(QUERY_KEY.CATEGORY_LIST_STOCKS, fetchFn);
};
