import { ref, Ref, computed } from 'vue';
import { useRoomViewFloorQuery } from '../apis/useRoomViewFloorQuery';
import { useRoomViewModeRoomTypeQuery } from '../apis/useRoomViewModeRoomTypeQuery';

export default function useRoomViews(tab: Ref<string>) {
  const dirty = ref(0);
  const roomStatusSn = ref<number | null>(-1);

  const enabledFloor = computed(() => {
    return tab.value === 'floor';
  });
  const enabledRoomType = computed(() => {
    return tab.value === 'roomType';
  });
  const {
    data: floors,
    isFetching: floorsFetching,
    refetch: refetchFloor,
  } = useRoomViewFloorQuery(dirty, roomStatusSn, enabledFloor);
  const {
    data: roomTypes,
    isFetching: roomTypesFetching,
    refetch: refetchRoomType,
  } = useRoomViewModeRoomTypeQuery(dirty, roomStatusSn, enabledRoomType);
  return {
    dirty,
    roomStatusSn,
    floorsFetching,
    floors,
    refetchFloor,
    roomTypes,
    roomTypesFetching,
    refetchRoomType,
  };
}
