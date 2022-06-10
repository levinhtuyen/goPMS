import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
// import { QUERY_KEY } from '~/api/queryKeys';
import { ResponseDto } from '~/apis/@types';
//====================================
// Interfaces
//====================================

export interface IProductMutationVariables {
  categorySn: any;
}
export interface IProductMutationResData {
  access: string;
  refresh: string;
  data: string[];
  meta: string[];
}

//====================================
// Response Error Interfaces
//====================================

/**
 * @todo Compare this interface with the real response data.
 */
export type IProductMutationResErr = {
  [key in string]?: object[];
};

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IProductMutationVariables) => {
  const { data } = await axiosClient.get<ResponseDto>(
    `/inventory/extraProperty/getProductList?categorySn=${payload}&limit=1100&isActive=1`,
  );

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useProductMutation = () => {
  // const queryClient = useQueryClient();
  return useMutation<ResponseDto, AxiosError<IProductMutationResErr>, IProductMutationVariables>(
    fetchFn,
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(QUERY_KEY.PRODUCT_SERVICES);
      },
    },
  );
};
