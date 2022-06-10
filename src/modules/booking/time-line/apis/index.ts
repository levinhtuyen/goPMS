import { axiosClient } from '~/apis/axiosClient';
import { ResponseDto } from '~/apis/@types';

interface ITimlineParams {
  dateFrom: string;
  dateTo: string;
}

export const fetchRoomListInTimelineViewMode = async () => {
  const data = await axiosClient.get<ResponseDto>('reservation/getRoomListInTimelineViewMode');
  return data.data;
};

export const fetchRoomTypeListInTimelineViewMode = async () => {
  const data = await axiosClient.get<ResponseDto>('reservation/getRoomTypeListInTimelineViewMode');
  return data.data;
};

export const fetchBookingsForTimeline = async (params: ITimlineParams) => {
  const { data } = await axiosClient.get<ResponseDto>(
    '/reservation/getBookingListInTimelineViewMode',
    { params: params },
  );
  return data.data;
};
