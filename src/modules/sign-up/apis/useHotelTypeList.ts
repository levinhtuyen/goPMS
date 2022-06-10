import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IHotelTypeListQueryResDatum {
  data: any;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<IHotelTypeListQueryResDatum>('/appendix/getHotelTypeList');
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useHotelTypeListQuery = () => {
  return useQuery(QUERY_KEY.HOTEL_TYPE_LIST, fetchFn);
};
