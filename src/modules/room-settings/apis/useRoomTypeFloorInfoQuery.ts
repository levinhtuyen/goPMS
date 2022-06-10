import { useQuery } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IRoomTypeFloorInfoQueryResDatum__room {
  sn: number;
  roomTypeCode: string;
  name: string;
}

export interface IRoomTypeFloorInfoQueryResDatum {
  sn: number;
  name: string;
  roomList: IRoomTypeFloorInfoQueryResDatum__room[];
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<ResponseDto<IRoomTypeFloorInfoQueryResDatum[]>>(
    '/configuration/room/getRoomTypeFloorInfo',
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRoomTypeFloorInfoQuery = () => {
  const useQueryResult = useQuery<IRoomTypeFloorInfoQueryResDatum[] | null>(
    QUERY_KEY.FLOORS,
    fetchFn,
    {
      staleTime: 10000,
    },
  );

  const findRoomByRoomSn = (roomSn?: number): IRoomTypeFloorInfoQueryResDatum__room | null => {
    if (!roomSn) return null;
    const floors = useQueryResult.data.value;
    if (!floors) return null;
    let result: IRoomTypeFloorInfoQueryResDatum__room | null = null;
    for (let i = 0; i < floors.length; i++) {
      const rooms = floors[i].roomList;
      for (let j = 0; j < rooms.length; j++) {
        const room = rooms[j];
        if (room.sn === roomSn) {
          result = room;
          break;
        }
      }
    }
    return result;
  };

  const findFloorByRoomSn = (roomSn?: number) => {
    if (!roomSn) return null;
    const floors = useQueryResult.data.value;
    if (!floors) return null;
    const floor = floors.find(({ roomList }) => roomList.some(({ sn }) => sn === roomSn));
    return floor;
  };

  const findRoomsByFloorSn = (floorSn?: number): IRoomTypeFloorInfoQueryResDatum__room[] | null => {
    if (!floorSn) return null;
    const floors = useQueryResult.data.value;
    return floors?.find((floor) => floor.sn === floorSn)?.roomList ?? null;
  };

  return { ...useQueryResult, findRoomByRoomSn, findRoomsByFloorSn, findFloorByRoomSn };
};
