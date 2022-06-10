import { AxiosError } from 'axios';
import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IProfilesSelectionQueryResDatum {
  id: number;
  name: 'Front Desk' | 'Owner';
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<IProfilesSelectionQueryResDatum[]>(
    '/accounts/profiles/list-for-selection',
  );
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useProfilesSelectionQuery = () => {
  return useQuery<IProfilesSelectionQueryResDatum[], AxiosError<unknown>>(
    [QUERY_KEY.PROFILES, 'selection'],
    fetchFn,
  );
};
