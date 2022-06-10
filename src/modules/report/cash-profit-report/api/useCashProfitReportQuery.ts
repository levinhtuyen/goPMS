import { useQuery } from 'vue-query';
import { axiosClient } from '~/apis/axiosClient';
import { QUERY_KEY } from '~/apis/queryKeys';
import { ResponseDto } from '~/apis/@types';
import { date } from 'quasar';
// import { ClientOffset } from '~/constants';

//====================================
// Interfaces
//====================================

export interface shiftHanoverReportData {
  data: object;
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
  // const { data } = await axiosClient.get<ResponseDto>(
  //   `/report/getCashProfitReportList?dateFrom=${reformatDate(
  //     params.startTime.value ? params.startTime.value : TODAY,
  //   )}&dateTo=${reformatDate(params.endTime.value)}`,
  // );
  const { data } = await axiosClient.get<ResponseDto>(
    `/report/getCashProfitReportList?dateFrom=${Number(
      date.formatDate(reformatDate(params.startTime.value ? params.startTime.value : TODAY), 'X'),
    )}&dateTo=${Number(date.formatDate(reformatDate(params.endTime.value), 'X'))}`,
  );
  return data.data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useShiftHanoverReportQuery = (params: any) => {
  return useQuery<ResponseDto | any>([QUERY_KEY.SHIFT_HANDOVER_REPORT, { params }], () =>
    fetchFn(params),
  );
};
