import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { IRoomTypeListQueryResDatum } from './useRoomTypeListQuery';

//====================================
// Interfaces
//====================================

export interface ICreateRoomTypeMutationVariables {
  name: string; // Name of Room Type (length: 255)
  code: string; // Code of Room Type (length: 255)
  numOfAdult: number; // Number of Adult
  numOfChildren: number; // Number of Children
  numOfBed: number; // Number of Beds
}

export interface ICreateRoomTypeMutationResData {
  sn: number;
}

export type TCreateRoomTypeMutationResErr = {
  [key in string]?: string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICreateRoomTypeMutationVariables) => {
  const { data } = await axiosClient.post('/configuration/room/createRoomType', payload);
  return data;
};

//====================================
// Main Function
//====================================

export const useCreateRoomTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ICreateRoomTypeMutationResData,
    AxiosError<TCreateRoomTypeMutationResErr>,
    ICreateRoomTypeMutationVariables
  >(fetchFn, {
    onSuccess: (resData, variables) => {
      const prevCache = queryClient.getQueryData<IRoomTypeListQueryResDatum[]>(
        QUERY_KEY.ROOM_TYPES,
      );
      if (!prevCache) return;
      queryClient.setQueryData<IRoomTypeListQueryResDatum[]>(QUERY_KEY.ROOM_TYPES, () => {
        return [...prevCache, { ...variables, sn: resData.sn, numOfRoom: 0 }];
      });
    },
  });
};
