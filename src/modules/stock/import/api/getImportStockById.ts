import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
//====================================
// Interfaces & Types
//====================================
export interface IImportStockByIdQuery {
  stockDetail: {
    sn: number;
    receiptId: string;
    importDate: string;
    note: string;
    totalPrice: string;
    isDeleted: number;
  };
  importStockList: [
    {
      sn: number;
      categorySn: number;
      categoryName: string;
      productSn: number;
      productName: string;
      productUnitName: string;
      quantity: number;
      importPrice: string;
      total: string;
    },
  ];
}
interface IImportStockByIdQueryResDatum {
  data: IImportStockByIdQuery;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async (params: any) => {
  if (!params.stockSn.value || params.stockSn.value === -1) return;
  const { data } = await axiosClient.get<IImportStockByIdQueryResDatum>(
    `/inventory/stock/getImportStockDetail?importStockSn=${params.stockSn.value}&isDelete=${params.isDelete}`,
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useImportStockByIdQuery = (params: any) => {
  return useQuery<ResponseDto | any>([QUERY_KEY.IMPORT_STOCK, { params }], () => fetchFn(params));
};
