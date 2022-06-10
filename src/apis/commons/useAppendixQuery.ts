import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================
interface IBookingSourcesQuery {
  code: string;
  description: string;
  name: string;
  sn: number;
}

export interface IRoomTypeQuery {
  code: string;
  name: string;
  numOfAdult: number;
  numOfBed: number;
  numOfChildren: number;
  numOfRoom: number;
  sn: number;
}
//====================================
// Fetch Function
//====================================

const fetchRoomType = async () => {
  const { data } = await axiosClient.get<ResponseDto>('/appendix/getRoomTypeList');
  return data.data;
};

const fetchBookingResource = async () => {
  const { data } = await axiosClient.get<ResponseDto>('/appendix/getBookingSourceList');

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRoomTypeQuery = ({ enabled }: { enabled: boolean }) => {
  return useQuery<IRoomTypeQuery[] | undefined>(QUERY_KEY.ROOM_TYPES, fetchRoomType, {
    enabled,
    select: (data) => data || [],
  });
};

export const useBookingSourcesQuery = ({ enabled }: { enabled: boolean }) => {
  return useQuery<IBookingSourcesQuery[] | undefined>(
    QUERY_KEY.BOOKING_SOURCES,
    fetchBookingResource,
    {
      enabled,
      select: (data) => data || [],
    },
  );
};
