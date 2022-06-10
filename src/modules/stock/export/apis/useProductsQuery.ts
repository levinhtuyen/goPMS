import { computed, ComputedRef } from 'vue';
import { useQueries } from 'vue-query';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

interface IProductsQueryResData {
  categorySn: number;
  productList: {
    sn: number;
    categorySn: number;
    name: string;
    status: number;
    price: number;
    productUnitSn: number;
    productUnitName: string;
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

const fetchFn = async (context: QueryFunctionContext<QueryKey, unknown>) => {
  const [, categorySn] = context.queryKey;
  const { data } = await axiosClient.get<ResponseDto<Omit<IProductsQueryResData, 'categorySn'>>>(
    '/inventory/extraProperty/getProductList',
    { params: { categorySn, limit: 1000, isActive: 1 } },
  );
  if (data.data) {
    Object.assign(data.data, { categorySn });
  }
  return data.data as IProductsQueryResData;
};

//====================================
// MAIN FUNCTION
//====================================

export const useProductsQuery = (categorySns: ComputedRef<number[]>) => {
  return useQueries(
    computed(() =>
      categorySns.value.map((categorySn) => ({
        queryKey: [QUERY_KEY.PRODUCT_LIST_STOCKS, categorySn],
        queryFn: fetchFn,
      })),
    ),
  );
};
