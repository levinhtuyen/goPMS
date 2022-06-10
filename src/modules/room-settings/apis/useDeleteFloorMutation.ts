import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import type { IRoomTypeFloorInfoQueryResDatum } from './useRoomTypeFloorInfoQuery';

//====================================
// Interfaces
//====================================

export interface IDeleteFloorMutationVariables {
  sn: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TDeleteFloorMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (variables: IDeleteFloorMutationVariables) => {
  await axiosClient.post('/configuration/room/deleteFloor', variables);
  return;
};

//====================================
// Main Function
//====================================

export const useDeleteFloorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<TDeleteFloorMutationResErr>, IDeleteFloorMutationVariables>(
    fetchFn,
    {
      onSuccess: (_, variables) => {
        const prevCache = queryClient.getQueryData<IRoomTypeFloorInfoQueryResDatum[]>(
          QUERY_KEY.FLOORS,
        );

        if (!prevCache) return;

        queryClient.setQueryData<IRoomTypeFloorInfoQueryResDatum[]>(QUERY_KEY.FLOORS, () =>
          prevCache.filter((floor) => floor.sn !== variables.sn),
        );
      },
    },
  );
};
