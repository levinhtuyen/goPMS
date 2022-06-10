import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { IRoomQuery } from './useRoomViewModeRoomTypeQuery';
//====================================
// Interfaces
//====================================
export interface INumOfRumByStatusQuery {
  name: string;
  numOfRoom: number | null;
  sn: number | null;
  roomList: IRoomQuery[];
}
//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<ResponseDto>('reservation/getNumOfRoomByStatusList');
  return data.data;
};
//====================================
// MAIN FUNCTION
//====================================

export const useNumOfRoomByStatusQuery = () => {
  return useQuery<INumOfRumByStatusQuery[]>(QUERY_KEY.NUM_OF_ROOM_BY_STATUS, fetchFn);
};
