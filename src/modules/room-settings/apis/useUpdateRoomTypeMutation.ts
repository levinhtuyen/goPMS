import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import type { ICreateRoomTypeMutationVariables } from './useCreateRoomTypeMutation';
import { IRoomTypeFloorInfoQueryResDatum } from './useRoomTypeFloorInfoQuery';
import { IRoomTypeListQueryResDatum, useRoomTypeListQuery } from './useRoomTypeListQuery';

//====================================
// Interfaces
//====================================

export interface IUpdateRoomTypeMutationVariables extends ICreateRoomTypeMutationVariables {
  sn: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TUpdateRoomTypeMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (variables: IUpdateRoomTypeMutationVariables) => {
  const { data } = await axiosClient.post('/configuration/room/updateRoomType', variables);
  return data;
};

//====================================
// Main Function
//====================================

export const useUpdateRoomTypeMutation = () => {
  const queryClient = useQueryClient();
  const { findRoomTypeBySn } = useRoomTypeListQuery();

  const updateFloorInfoCache = (variables: IUpdateRoomTypeMutationVariables) => {
    const prevCache = queryClient.getQueryData<IRoomTypeFloorInfoQueryResDatum[]>(QUERY_KEY.FLOORS);
    const targetRoomTypeCode = findRoomTypeBySn(variables.sn);
    if (!prevCache || !targetRoomTypeCode) return;
    queryClient.setQueryData<IRoomTypeFloorInfoQueryResDatum[]>(QUERY_KEY.FLOORS, () => {
      return prevCache.map((floor) => {
        return {
          ...floor,
          roomList: floor.roomList.map((room) => {
            if (targetRoomTypeCode.code !== room.roomTypeCode) return room;
            return {
              ...room,
              roomTypeCode: variables.code,
            };
          }),
        };
      });
    });
  };

  const updateRoomTypesCache = (variables: IUpdateRoomTypeMutationVariables) => {
    const prevCache = queryClient.getQueryData<IRoomTypeListQueryResDatum[]>(QUERY_KEY.ROOM_TYPES);
    if (!prevCache) return;
    queryClient.setQueryData<IRoomTypeListQueryResDatum[]>(QUERY_KEY.ROOM_TYPES, () => {
      return prevCache.map((roomType) => {
        if (roomType.sn !== variables.sn) return roomType;
        return {
          ...variables,
          numOfRoom: roomType.numOfRoom,
        };
      });
    });
  };

  return useMutation<
    null,
    AxiosError<TUpdateRoomTypeMutationResErr>,
    IUpdateRoomTypeMutationVariables
  >(fetchFn, {
    onSuccess: (_, variables) => {
      updateFloorInfoCache(variables);
      updateRoomTypesCache(variables);
    },
  });
};
