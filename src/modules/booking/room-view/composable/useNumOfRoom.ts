import { computed, Ref, ref } from 'vue';
import { useNumOfRoomByStatusQuery } from '../apis/useNumOfRoomByStatusQuery';
import { ROOM_STATUS_TYPES } from '../const';
export default function useNumOfRoom(roomStatusSn: Ref<number | null>, dirty: Ref<number>) {
  const statusActive = ref<number | null>(-1);
  const {
    data: numOfRoom,
    isFetching: numOfRoomFetching,
    refetch: refetchNumOfRoom,
  } = useNumOfRoomByStatusQuery();
  const statusOptions = computed(() => {
    if (!numOfRoom.value) {
      return ROOM_STATUS_TYPES;
    }
    return ROOM_STATUS_TYPES.map((item) => ({
      ...item,
      ...numOfRoom.value?.find(({ sn }) => sn === item.roomStatusSn),
    }));
  });
  const setIcon = (status: number | null) => {
    switch (status) {
      case 1:
        return 'meeting_room';
      case 2:
      case 4:
        return 'event_available';
      case 3:
        return 'king_bed';
      case 5:
        return 'update';
      case 6:
        return 'cleaning_services';
      default:
        return 'settings';
    }
  };
  const setColor = (status: number | null) => {
    switch (status) {
      case 1:
        return 'blue-12';
      case 2:
        return 'orange-11';
      case 4:
        return 'deep-orange-11';
      case 3:
        return 'green-11';
      case 5:
        return 'amber-11';
      case 6:
        return 'light-blue-11';
      default:
        return '';
    }
  };
  const changeStatus = (sn: number | null) => {
    statusActive.value = statusActive?.value === sn ? -1 : sn;
    if (sn === null) {
      roomStatusSn.value = null;
      dirty.value = statusActive.value === null ? 1 : 0;
      return true;
    }
    if (statusActive.value === -1) {
      roomStatusSn.value = -1;
      return true;
    }
    roomStatusSn.value = sn;
    dirty.value = 0;
  };
  return {
    statusActive,
    numOfRoomFetching,
    statusOptions,
    changeStatus,
    setIcon,
    setColor,
    refetchNumOfRoom,
  };
}
