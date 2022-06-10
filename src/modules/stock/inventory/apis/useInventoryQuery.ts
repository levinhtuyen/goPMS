import { useQuery } from 'vue-query';
import { ResponseDto } from '~/apis/@types';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { date } from 'quasar';
//====================================
// Interfaces
//====================================

export interface IImportExportStock {
  stockSn: number;
  exportQuantity: number;
  importQuantity: number;
  exportPrice: number;
  importPrice: number;
  receiptDate: string;
  receiptType: number;
  receiptId: string;
  note: string | null;
}

interface IInventoryQueryResData {
  importExportStockList: IImportExportStock[];
  total: {
    exportPrice: 63;
    exportQuantity: 2;
    importPrice: 1;
    importQuantity: 1;
  };
}
//====================================
// Helpers
//====================================

const TODAY = date.formatDate(new Date(), 'DD/MM/YYYY');

const reformatDate = (viVNDate = TODAY) => {
  const [day, month, year] = viVNDate.split('/');
  return `${year}/${month}/${day}`;
};
//====================================
// Fetch Function
//====================================

const fetchFn = async (params: any) => {
  const { data } = await axiosClient.get<ResponseDto<IInventoryQueryResData>>(
    `/inventory/stock/getStockInventoryDetail?limit=10&startTime=${
      params.startTime.value
        ? Number(date.formatDate(reformatDate(params.startTime.value), 'X'))
        : Number(date.formatDate(reformatDate(params.startWeek.value), 'X'))
    }&productSn=${params.productSn}&endTime=${Number(
      date.formatDate(reformatDate(params.endTime.value), 'X'),
    )}`,
  );
  return data.data;
};

export const useInventoryQuery = (params: any) => {
  return useQuery<ResponseDto | any>([QUERY_KEY.STOCK_INVENTORIES, { params }], () =>
    fetchFn(params),
  );
};
