import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
//====================================
// Interfaces
//====================================

export interface productData {
  data: object;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async (params: any) => {
  const { data } = await axiosClient.get<ResponseDto>('/appendix/getStockInventory', {
    params: params,
  });
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useProductHotelQuery = (params: any) => {
  return useQuery<ResponseDto | any>([QUERY_KEY.PRODUCT_SERVICES, { params }], () =>
    fetchFn(params),
  );
};
