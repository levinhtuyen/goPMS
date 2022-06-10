import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import type { ICreateRoomMutationVariables } from './useCreateRoomMutation';
import type { IRoomTypeFloorInfoQueryResDatum } from './useRoomTypeFloorInfoQuery';
import type { IRoomTypeListQueryResDatum } from './useRoomTypeListQuery';
import { useRoomTypeListQuery } from './useRoomTypeListQuery';

//====================================
// Interfaces
//====================================

export interface IUpdateRoomMutationVariables extends ICreateRoomMutationVariables {
  sn: number;
}

export interface IUpdateRoomMutationResData {
  code: number;
  message: string;
  error: string | null;
  data: null; // Response data is not defined yet.
  timestamp: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TUpdateRoomMutationResErr = {
  [key in string]?: string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (variables: IUpdateRoomMutationVariables) => {
  const { data } = await axiosClient.post('/configuration/room/updateRoom', variables);
  return data;
};

//====================================
// Main Function
//====================================

export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient();
  const { findRoomTypeBySn } = useRoomTypeListQuery();

  const updateRoomTypeFloorInfoCache = (variables: IUpdateRoomMutationVariables) => {
    const prevCache = queryClient.getQueryData<IRoomTypeFloorInfoQueryResDatum[]>(QUERY_KEY.FLOORS);
    if (!prevCache) return;
    const prevRoom = prevCache
      .flatMap(({ roomList, sn, name }) =>
        roomList.map((room) => ({ ...room, floorSn: sn, floorName: name })),
      )
      .find((room) => room.sn === variables.sn);
    if (!prevRoom) return;

    const roomType = findRoomTypeBySn(variables.roomTypeSn);
    if (!roomType) return;

    queryClient.setQueryData<IRoomTypeFloorInfoQueryResDatum[]>(QUERY_KEY.FLOORS, () => {
      const isFloorUpdated = prevRoom.floorSn !== variables.floorSn;
      switch (isFloorUpdated) {
        case true:
          return prevCache.map((floor) => {
            if (floor.sn !== variables.floorSn) {
              return {
                ...floor,
                roomList: floor.roomList.filter((room) => room.sn !== variables.sn),
              };
            } else {
              return {
                ...floor,
                roomList: [
                  ...floor.roomList,
                  {
                    sn: variables.sn,
                    name: variables.name,
                    roomTypeCode: roomType.code,
                    roomTypeSn: variables.roomTypeSn,
                  },
                ],
              };
            }
          });
        case false:
          return prevCache.map((floor) => {
            if (floor.sn !== variables.floorSn) {
              return floor;
            } else {
              return {
                ...floor,
                roomList: floor.roomList.map((room) => {
                  if (room.sn !== variables.sn) return room;
                  return {
                    sn: variables.sn,
                    name: variables.name,
                    roomTypeCode: roomType.code,
                    roomTypeSn: variables.roomTypeSn,
                  };
                }),
              };
            }
          });
      }
    });

    return prevRoom.roomTypeCode;
  };

  const updateRoomTypesCache = (
    variables: IUpdateRoomMutationVariables,
    prevRoomTypeCode?: string,
  ) => {
    const prevCache = queryClient.getQueryData<IRoomTypeListQueryResDatum[]>(QUERY_KEY.ROOM_TYPES);
    if (!prevCache || !prevRoomTypeCode) return;
    queryClient.setQueryData<IRoomTypeListQueryResDatum[]>(QUERY_KEY.ROOM_TYPES, () => {
      return prevCache.map((roomType) => {
        if (roomType.sn === variables.roomTypeSn)
          return { ...roomType, numOfRoom: roomType.numOfRoom + 1 };
        if (roomType.code === prevRoomTypeCode)
          return { ...roomType, numOfRoom: roomType.numOfRoom - 1 };
        return roomType;
      });
    });
  };

  return useMutation<
    IUpdateRoomMutationResData,
    AxiosError<TUpdateRoomMutationResErr>,
    IUpdateRoomMutationVariables
  >(fetchFn, {
    onSuccess: (_, variables) => {
      const prevRoomTypeCode = updateRoomTypeFloorInfoCache(variables);
      updateRoomTypesCache(variables, prevRoomTypeCode);
    },
  });
};
