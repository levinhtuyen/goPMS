import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================

export interface IPoliciesMutationParams {
  countrySn: number | undefined;
  currency: string | undefined;
  endDaily: string | undefined;
  endOvernight: string | undefined;
  hotelSn: number | undefined;
  roundUpHour: number | undefined;
  policySn: number | undefined;
  startDaily: string | undefined;
  startOvernight: string | undefined;
}

//====================================
// Response Error Interfaces
//====================================

/**
 * @todo Compare this interface with the real response data.
 */
export interface IUpdatePolicyResDatum {
  data: string[];
  error: string[];
}
export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IPoliciesMutationParams) => {
  const { data } = await axiosClient.post<ResponseDto>(
    '/configuration/policy/updatePolicy',
    payload,
  );

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdatePoliciesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IUpdatePolicyResDatum, AxiosError<TMutationResErr>, IPoliciesMutationParams>(
    fetchFn,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY.POLICIES);
      },
    },
  );
};
