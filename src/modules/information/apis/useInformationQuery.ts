import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IInformationVariables {
  hotelTypeSn: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

export interface IInformationQueryResDatum {
  data: object;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<IInformationQueryResDatum>(
    '/configuration/hotel/getHotelInfo',
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useInformationQuery = () => {
  return useQuery<any>(QUERY_KEY.INFORMATION, fetchFn);
};
