import { useQuery, useQueryClient } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

export interface IRoomTypeListQueryResDatum {
  sn: number;
  code: string;
  name: string;
  numOfAdult: number;
  numOfChildren: number;
  numOfBed: number;
  numOfRoom: number;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<ResponseDto<IRoomTypeListQueryResDatum[]>>(
    '/appendix/getRoomTypeList',
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRoomTypeListQuery = () => {
  const queryClient = useQueryClient();
  const useQueryResult = useQuery<IRoomTypeListQueryResDatum[] | null>(
    QUERY_KEY.ROOM_TYPES,
    fetchFn,
    {
      staleTime: 10000,
    },
  );

  const findRoomTypeBySn = (sn: number) => {
    const roomTypesCache = queryClient.getQueryData<IRoomTypeListQueryResDatum[]>(
      QUERY_KEY.ROOM_TYPES,
    );
    return roomTypesCache?.find((roomType) => roomType.sn === sn);
  };

  const findRoomTypeByCode = (code?: string) => {
    if (!code) return;
    const roomTypesCache = queryClient.getQueryData<IRoomTypeListQueryResDatum[]>(
      QUERY_KEY.ROOM_TYPES,
    );
    return roomTypesCache?.find((roomType) => roomType.code === code);
  };

  return { ...useQueryResult, findRoomTypeBySn, findRoomTypeByCode };
};
