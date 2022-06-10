import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { useQuery } from 'vue-query';

//====================================
// Interfaces
//====================================
export interface IParams {
  categorySn?: number | null;
  keyword?: string;
  bookingProductSnExceptList: string;
}
export interface IRet {
  sn: number;
  name: string;
  price: string;
  stock: string;
}
//====================================
// Fetch Function
//====================================

const fetchFn = async (params: IParams) => {
  if (params.keyword || params.categorySn) {
    const { data } = await axiosClient.get<ResponseDto>(
      `/inventory/extraProperty/getProductAvailableList`,
      {
        params: {
          keyword: params.keyword,
          categorySn: params.categorySn,
        },
      },
    );
    return data.data;
  }
  return false;
};

//====================================
// MAIN FUNCTION
//====================================

export const useProductServiceQuery = (params: IParams) => {
  return useQuery([QUERY_KEY.PRODUCT_SERVICES, params], () => fetchFn(params));
};
