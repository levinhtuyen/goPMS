import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { IRoomTypeFloorInfoQueryResDatum } from './useRoomTypeFloorInfoQuery';

//====================================
// Interfaces
//====================================

export interface ICreateFloorMutationVariables {
  name: string; // Name of Floor (length: 255)
}

export interface ICreateFloorMutationResData {
  sn: number;
}

export type TCreateFloorMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICreateFloorMutationVariables) => {
  const { data } = await axiosClient.post('/configuration/room/createFloor', payload);
  return data;
};

//====================================
// Main Function
//====================================

export const useCreateFloorMutation = () => {
  const queryClient = useQueryClient();

  const updateFloorInfoCache = (
    resData: ICreateFloorMutationResData,
    variables: ICreateFloorMutationVariables,
  ) => {
    const prevCache = queryClient.getQueryData<IRoomTypeFloorInfoQueryResDatum[]>(QUERY_KEY.FLOORS);
    if (!prevCache) return;
    queryClient.setQueryData<IRoomTypeFloorInfoQueryResDatum[]>(QUERY_KEY.FLOORS, () => {
      if (!prevCache || !resData) return prevCache;
      return [...prevCache, { sn: resData.sn, name: variables.name, roomList: [] }];
    });
  };

  // const updateRoomssQueryCache = (resData: ICreateFloorMutationResData) => {
  //   const prevCache = queryClient.getQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS);
  //   if (!prevCache) return;
  //   queryClient.setQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS, () => [
  //     ...prevCache,
  //     { room_floor_id: resData.id, room_floor_name: resData.name, list_rooms: [] },
  //   ]);
  // };

  return useMutation<
    ICreateFloorMutationResData,
    AxiosError<TCreateFloorMutationResErr>,
    ICreateFloorMutationVariables
  >(fetchFn, {
    onSuccess: (resData, variables) => {
      updateFloorInfoCache(resData, variables);
      // updateRoomssQueryCache(resData);
    },
  });
};
