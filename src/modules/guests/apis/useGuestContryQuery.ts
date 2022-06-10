import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================
interface IGuestContriesQuery {
  countryCode: string;
  currency: string;
  isoCode: string;
  name: string;
  sn: number;
}

export interface IGuestContryMutationVariables {
  limit: number;
  page: number;
  keyword: string;
  countrySn: number;
}

interface IGuestContryArrivalsRes {
  data: IGuestContriesQuery[];
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<ResponseDto>('/guest/getGuestCountryList');
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

// export const useGuestCountryQuery = () => {
//   return useQuery<ResponseDto>(QUERY_KEY.COUNTRY, fetchFn);
// };

export const useGuestCountryQuery = () => {
  return useQuery<IGuestContryArrivalsRes>(QUERY_KEY.COUNTRY, fetchFn, {
    select: (data) => data,
  });
};
