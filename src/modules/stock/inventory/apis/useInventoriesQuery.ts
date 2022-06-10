import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { date } from 'quasar';
// import { ClientOffset } from '~/constants';
//====================================
// Interfaces
//====================================

export interface importStockData {
  data: object;
}

export interface IInventoryStock {
  sn: number;
  exportQuantity: number;
  importQuantity: number;
  startInventory: number;
  lastInventory: number;
  productUnitName: string;
  productPrice: number;
  productName: string;
}

interface IInventoriesQueryResData {
  stockInventoryList: IInventoryStock[];
  meta: {
    currentPage: number;
    from: number;
    lastPage: number;
    perPage: number;
    to: number;
    total: number;
  };
}

//====================================
// Helpers
//====================================

const TODAY = date.formatDate(new Date(), 'DD/MM/YYYY');

// const reformatDate = (viVNDate = TODAY) => {
//   const [day, month, year] = viVNDate.split('/');
//   const dateTime = `${year}/${month}/${day}`;
//   const dateConverUTC = new Date(dateTime + ` 0${Math.abs(ClientOffset / 60)}:00`);
//   const dateCOnverTimeStamp = Number(date.formatDate(dateConverUTC, 'X'));
//   return dateCOnverTimeStamp;
// };

const reformatDate = (viVNDate = TODAY) => {
  const [day, month, year] = viVNDate.split('/');
  return `${year}/${month}/${day}`;
};
//====================================
// Fetch Function
//====================================

const fetchFn = async (params: any) => {
  // const { data } = await axiosClient.get<ResponseDto<IInventoriesQueryResData>>(
  //   `/inventory/stock/getStockInventory?page=${params.page?.value?.currentPage}&categorySn=${
  //     params.categorySn.value
  //   }&limit=${params.limit}&startTime=${
  //     params.startTime.value
  //       ? reformatDate(params.startTime.value)
  //       : reformatDate(params.startWeek.value)
  //   }&endTime=${reformatDate(params.endTime.value)}`,
  // );
  const { data } = await axiosClient.get<ResponseDto<IInventoriesQueryResData>>(
    `/inventory/stock/getStockInventory?page=${params.page?.value?.currentPage}&categorySn=${
      params.categorySn.value
    }&limit=${params.limit}&startTime=${
      params.startTime.value
        ? Number(date.formatDate(reformatDate(params.startTime.value), 'X'))
        : Number(date.formatDate(reformatDate(params.startWeek.value), 'X'))
    }&endTime=${Number(date.formatDate(reformatDate(params.endTime.value), 'X'))}`,
  );

  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useStockInventoryQuery = (params: any) => {
  return useQuery<ResponseDto | any>([QUERY_KEY.STOCK_INVENTORIES, { params }], () =>
    fetchFn(params),
  );
};
