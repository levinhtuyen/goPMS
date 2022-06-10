import { ref, reactive } from 'vue';
import ReservationDialog from './components/ReservationDialog.vue';
import ChangeStayDateDialog from './components/ChangeStayDateDialog.vue';
import ChangeAddServiceDialog from './components/ChangeAddServiceDialog.vue';
import CheckOutDialog from './components/CheckOutDialog.vue';
import ChangeRoomDialog from './components/ChangeRoomDialog.vue';
import ReservationListDialog from './components/ReservationListDialog.vue';
import CancelReservationDialog from './components/CancelReservation.vue';
export default function useOpenDialog() {
  const reservationDialogRef = ref<InstanceType<typeof ReservationDialog> | null>(null);
  const reservationListDialogRef = ref<InstanceType<typeof ReservationListDialog> | null>(null);
  const cancelReservationDialogRef = ref<InstanceType<typeof CancelReservationDialog> | null>(null);
  const changeStayDateDialogRef = ref<InstanceType<typeof ChangeStayDateDialog> | null>(null);
  const changeAddServiceDialogRef = ref<InstanceType<typeof ChangeAddServiceDialog> | null>(null);
  const changeRoomDialogRef = ref<InstanceType<typeof ChangeRoomDialog> | null>(null);
  const checkOutDialogRef = ref<InstanceType<typeof CheckOutDialog> | null>(null);
  const ui = reactive({
    reservationDialogVisible: false,
    changeStayDateVisible: false,
    checkOutDialogVisible: false,
    reservationListDialogVisible: false,
    cancelReservationVisible: false,
    changeRoomVisible: false,
    changeAddServiceVisible: false,
  });
  const openChangeStayDate = (
    bookingSn: number | null,
    guestName: string | null,
    roomName: string | null,
    checkIn: number,
    checkOut: number,
    roomStatusSn: number | null,
  ) => {
    ui.changeStayDateVisible = true;
    (changeStayDateDialogRef.value as any)?.setupChangeStayDateDialog(
      bookingSn,
      guestName,
      roomName,
      checkIn,
      checkOut,
      roomStatusSn,
    );
  };
  const openChangeAddService = (bookingSn: number | null, bookingNo: string | null) => {
    ui.changeAddServiceVisible = true;
    (changeAddServiceDialogRef.value as any)?.setupAddServiceDialog(bookingSn, bookingNo);
  };
  const openChangeRoomDialog = (
    roomSn: number | null,
    roomName: string | null,
    guestName: string | null,
    bookingSn: number | null,
    roomTypeSn: number | null,
  ) => {
    ui.changeRoomVisible = true;
    (changeRoomDialogRef.value as any)?.setupChangeRoomDialog(
      roomSn,
      roomName,
      guestName,
      bookingSn,
      roomTypeSn,
    );
  };

  const openReservationListDialog = (roomSn: number | null, bookingNo: string | null) => {
    ui.reservationListDialogVisible = true;
    (reservationListDialogRef.value as any)?.setupReservationListDialog(roomSn, bookingNo);
  };
  const openReservationDialog = (roomTypeSn: number | null, roomSn: number | null) => {
    ui.reservationDialogVisible = true;
    (reservationDialogRef.value as any)?.setupReservationDialog(roomTypeSn, roomSn);
  };
  const openCheckOutDialog = (bookingSn: number | null) => {
    ui.checkOutDialogVisible = true;
    (checkOutDialogRef.value as any)?.setupCheckOutDialog(bookingSn);
  };
  const openCancelReservationDialog = (bookingSn: number | null) => {
    ui.cancelReservationVisible = true;
    (cancelReservationDialogRef.value as any)?.setupCancelReservationDialog(bookingSn);
  };
  return {
    ui,
    reservationDialogRef,
    reservationListDialogRef,
    cancelReservationDialogRef,
    changeStayDateDialogRef,
    changeAddServiceDialogRef,
    changeRoomDialogRef,
    checkOutDialogRef,
    openChangeStayDate,
    openChangeAddService,
    openReservationListDialog,
    openCancelReservationDialog,
    openChangeRoomDialog,
    openReservationDialog,
    openCheckOutDialog,
  };
}
