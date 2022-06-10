import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { IRoomTypeFloorInfoQueryResDatum } from './useRoomTypeFloorInfoQuery';
import { IRoomTypeListQueryResDatum, useRoomTypeListQuery } from './useRoomTypeListQuery';

//====================================
// Interfaces
//====================================
export interface ICreateRoomMutationVariables {
  roomTypeSn: number; // Index of Room Type
  floorSn: number; // Index of Floor
  name: string; // Name of Room (length: 255)
}

export interface ICreateRoomMutationResData {
  sn: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TCreateRoomMutationResErr = {
  [key in string]?: string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICreateRoomMutationVariables) => {
  const { data } = await axiosClient.post('/configuration/room/createRoom', payload);
  return data;
};

//====================================
// Main Function
//====================================

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();
  const { findRoomTypeBySn } = useRoomTypeListQuery();

  const updateFloorInfoCache = (
    resData: ICreateRoomMutationResData,
    variables: ICreateRoomMutationVariables,
  ) => {
    const prevCache = queryClient.getQueryData<IRoomTypeFloorInfoQueryResDatum[]>(QUERY_KEY.FLOORS);
    const roomTypeCode = findRoomTypeBySn(variables.roomTypeSn);
    if (!prevCache || !roomTypeCode) return;
    queryClient.setQueryData<IRoomTypeFloorInfoQueryResDatum[]>(QUERY_KEY.FLOORS, () => {
      return prevCache.map((floor) => {
        if (floor.sn !== variables.floorSn) return floor;
        return {
          ...floor,
          roomList: [
            ...floor.roomList,
            { sn: resData.sn, name: variables.name, roomTypeCode: roomTypeCode.name },
          ],
        };
      });
    });
  };

  const updateRoomTypesCache = (variables: ICreateRoomMutationVariables) => {
    const prevCache = queryClient.getQueryData<IRoomTypeListQueryResDatum[]>(QUERY_KEY.ROOM_TYPES);
    if (!prevCache) return;
    queryClient.setQueryData<IRoomTypeListQueryResDatum[]>(QUERY_KEY.ROOM_TYPES, () => {
      return prevCache.map((roomType) => {
        if (roomType.sn !== variables.roomTypeSn) return roomType;
        return { ...roomType, numOfRoom: roomType.numOfRoom + 1 };
      });
    });
  };

  return useMutation<
    ICreateRoomMutationResData,
    AxiosError<TCreateRoomMutationResErr>,
    ICreateRoomMutationVariables
  >(fetchFn, {
    onSuccess: (resData, variables) => {
      updateRoomTypesCache(variables);
      updateFloorInfoCache(resData, variables);
    },
  });
};
