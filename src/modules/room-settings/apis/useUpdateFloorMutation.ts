import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import type { IRoomTypeFloorInfoQueryResDatum } from './useRoomTypeFloorInfoQuery';

//====================================
// Interfaces
//====================================

export interface IUpdateFloorMutationVariables {
  sn: number; // Index of Floor
  name: string; // Name of Floor (length: 255)
}

export type TUpdateFloorMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (variables: IUpdateFloorMutationVariables) => {
  const { data } = await axiosClient.post('/configuration/room/updateFloor', variables);
  return data;
};

//====================================
// Main Function
//====================================

export const useUpdateFloorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<null, AxiosError<TUpdateFloorMutationResErr>, IUpdateFloorMutationVariables>(
    fetchFn,
    {
      onSuccess: (_, variables) => {
        const prevCache = queryClient.getQueryData<IRoomTypeFloorInfoQueryResDatum[]>(
          QUERY_KEY.FLOORS,
        );
        if (!prevCache) return;
        queryClient.setQueryData<IRoomTypeFloorInfoQueryResDatum[]>(QUERY_KEY.FLOORS, () =>
          prevCache.map((floor) =>
            floor.sn !== variables.sn ? floor : { ...floor, ...variables },
          ),
        );
      },
    },
  );
};
