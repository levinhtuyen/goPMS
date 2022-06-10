import { reactive, Ref } from 'vue';
import { useQuery } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';

//====================================
// Interfaces
//====================================

interface IExportQueryResData {
  exportStock: {
    sn: number;
    receiptId: string;
    exportDate: number;
    note: string;
    totalPrice: number;
    deleteTime: string;
  };
  exportStockDetailList: {
    sn: number;
    categorySn: number;
    categoryName: string;
    productSn: number;
    productName: string;
    productUnitName: string;
    quantity: number;
    total: number;
    deleteTime: string;
  }[];
}

//====================================
// Fetch Function
//====================================

const fetchFn = async (exportStockSn: number | null) => {
  if (exportStockSn === null) return null;
  const { data } = await axiosClient.get<ResponseDto<IExportQueryResData>>(
    '/inventory/stock/getExportStockDetail',
    { params: { exportStockSn } },
  );
  return data.data;
};

export const useExportQuery = (stockSn: Ref<number | null>) => {
  return useQuery(reactive([QUERY_KEY.EXPORT_STOCKS, stockSn]), () => fetchFn(stockSn.value));
};
