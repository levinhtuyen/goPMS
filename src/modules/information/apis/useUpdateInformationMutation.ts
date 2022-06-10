import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { ResponseDto } from '~/apis/@types';

//====================================
// Interfaces
//====================================

export interface IInformationMutationParams {
  hotelTypeSn: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}
export interface IInformationMutationResData {
  data: string[];
  error: string[];
}

//====================================
// Response Error Interfaces
//====================================

/**
 * @todo Compare this interface with the real response data.
 */

export interface IUpdateInformationResDatum {
  data: string[];
  error: string[];
}
export type TMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IInformationMutationParams) => {
  const { data } = await axiosClient.post<ResponseDto>('/configuration/hotel/updateHotel', payload);

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateInformationMutation = () => {
  // const queryClient = useQueryClient();
  return useMutation<
    IUpdateInformationResDatum,
    AxiosError<TMutationResErr>,
    IInformationMutationParams
  >(fetchFn, {
    // onSuccess: () => {
    //   // queryClient.invalidateQueries(QUERY_KEY.INFORMATION);
    // },
  });
};
