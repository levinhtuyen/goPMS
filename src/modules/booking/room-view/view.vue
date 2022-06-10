<script setup lang="ts">
import ReservationDialog from './components/ReservationDialog.vue';
import ChangeStayDateDialog from './components/ChangeStayDateDialog.vue';
import CheckOutDialog from './components/CheckOutDialog.vue';
import ChangeRoomDialog from './components/ChangeRoomDialog.vue';
import ReservationListDialog from './components/ReservationListDialog.vue';
import { useQuasar } from 'quasar';
import { useUpdateDirtyRoomMutation } from '~/modules/booking/room-view/apis/useUpdateDirtyRoomMutation';
import { useNotify } from '~/composable/useNotify';
import ChangeAddServiceDialog from './components/ChangeAddServiceDialog.vue';
import CancelReservationDialog from './components/CancelReservation.vue';
import { onMounted, ref, inject } from 'vue';
import { formatMoney } from '~/composable/useFormat';
import useRoomViews from './composable/useRoomView';
import useNumOfRoom from './composable/useNumOfRoom';
import useOpenDialog from './composable/useOpenDialog';
import { useAuth } from '~/composable/useAuth';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { FORMAT_DATE_TIME_UI } from '~/constants';
import { Emitter } from 'mitt';
import { useI18n } from '~/composable/useI18n';
import { useCheckInMutation } from '~/modules/booking/room-view/apis/useCheckInMutation';
import useBookingDetails from '~/modules/booking/composable/useBookingDetails';

const { t } = useI18n();
// data
const $q = useQuasar();
const updateDirtyRoomMutation = useUpdateDirtyRoomMutation();
const { notifyUpdateSuccess } = useNotify();
const modelView = ref('RoomView');
const { hasPermission } = useAuth();
const router = useRouter();
const tab = ref('floor');
const checkInMutation = useCheckInMutation();
const { refetchBookingDetails } = useBookingDetails();
const emitter = inject('emitter') as Emitter<any>;
// composables
const {
  roomStatusSn,
  dirty,
  floorsFetching,
  floors,
  refetchFloor,
  roomTypes,
  roomTypesFetching,
  refetchRoomType,
} = useRoomViews(tab);
// const { handleCheckIn } = useCheckIn(tab);
const {
  statusActive,
  numOfRoomFetching,
  statusOptions,
  changeStatus,
  setIcon,
  setColor,
  refetchNumOfRoom,
} = useNumOfRoom(roomStatusSn, dirty);
const {
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
} = useOpenDialog();
onMounted(() => {
  emitter.on('changeRoomViewMode', async () => {
    tab.value === 'floor' ? refetchFloor.value() : refetchRoomType.value();
    refetchNumOfRoom.value();
  });
});
// methos
const handleSuccess = (actions: string) => {
  tab.value === 'floor' ? refetchFloor.value() : refetchRoomType.value();
  refetchNumOfRoom.value();
  switch (actions) {
    case 'makeAReservation':
      ui.reservationDialogVisible = false;
      break;
    case 'cancelReservation':
      ui.cancelReservationVisible = false;
      break;
    case 'changeStayDate':
      ui.changeStayDateVisible = false;
      break;
    case 'changeRoom':
      ui.changeRoomVisible = false;
      break;
    case 'checkOut':
      ui.checkOutDialogVisible = false;
      break;
    case 'changeAddService':
      ui.changeAddServiceVisible = false;
      break;
    default:
      break;
  }
};
const changeView = (val: string) => {
  if (val === 'TimelineView' && hasPermission('timeline-view-mode')) {
    router.push({ name: 'Timeline' });
  }
};
const updateDirtyRoom = (roomSn: number | null, dirty: number) => {
  $q.dialog({
    message: dirty === 1 ? t('are_you_sure_set_cleaned') : t('are_you_sure_set_dirty'),
    cancel: {
      color: 'grey-8',
      label: t('cancel'),
      noCaps: true,
      dense: true,
      outline: true,
    },
    color: 'negative',
    ok: {
      color: 'negative',
      label: t('confirm'),
      noCaps: true,
      dense: true,
    },
  }).onOk(() => {
    updateDirtyRoomMutation.mutate(
      { sn: roomSn, dirty: dirty === 1 ? 0 : 1 },
      {
        onSuccess: (data) => {
          if (data) {
            notifyUpdateSuccess();
            tab.value === 'floor' ? refetchFloor.value() : refetchRoomType.value();
            refetchNumOfRoom.value();
          }
        },
      },
    );
  });
};
const handleCheckIn = (bookingSn: number | null) => {
  $q.dialog({
    message: t('check_in_room_view'),
    cancel: {
      color: 'grey-8',
      label: t('cancel'),
      noCaps: true,
      dense: true,
      outline: true,
    },
    color: 'negative',
    ok: {
      color: 'negative',
      label: t('confirm'),
      noCaps: true,
      dense: true,
    },
  }).onOk(() => {
    checkInMutation.mutate(
      { bookingSn: bookingSn ? String(bookingSn) : '' },
      {
        onSuccess: (data: any) => {
          if (data) {
            notifyUpdateSuccess();
            refetchFloor.value();
            refetchRoomType.value();
            refetchBookingDetails.value();
          }
        },
      },
    );
  });
};
</script>
<template>
  <ChangeRoomDialog
    ref="changeRoomDialogRef"
    v-model="ui.changeRoomVisible"
    @change-success="handleSuccess('changeRoom')"
  />
  <CancelReservationDialog
    ref="cancelReservationDialogRef"
    v-model="ui.cancelReservationVisible"
    @cancel-success="handleSuccess('cancelReservation')"
  />
  <CheckOutDialog
    ref="checkOutDialogRef"
    v-model="ui.checkOutDialogVisible"
    @check-out-success="handleSuccess('checkOut')"
  />
  <ReservationListDialog ref="reservationListDialogRef" v-model="ui.reservationListDialogVisible" />
  <ReservationDialog
    ref="reservationDialogRef"
    v-model="ui.reservationDialogVisible"
    @create-success="handleSuccess('makeAReservation')"
  />
  <ChangeAddServiceDialog
    ref="changeAddServiceDialogRef"
    v-model="ui.changeAddServiceVisible"
    :is-room-view="true"
    :room-name="''"
    :booking-product-sn-delete-list="[]"
    @change-success="handleSuccess('changeAddService')"
  />
  <ChangeStayDateDialog
    ref="changeStayDateDialogRef"
    v-model="ui.changeStayDateVisible"
    @change-success="handleSuccess('changeStayDate')"
  />
  <pms-sections class="relative-position">
    <template #header>
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h5 text-bold q-ma-none col-lg-6 col-md 8">{{ t('room_view_mode') }}</div>
        <q-btn-toggle
          v-model="modelView"
          spread
          no-caps
          toggle-color="negative"
          class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-10 box-shadow-tabs rounded-borders"
          :options="
            hasPermission('timeline-view-mode')
              ? [
                  { label: t('timeline_view'), value: 'TimelineView' },
                  { label: t('room_view'), value: 'RoomView' },
                ]
              : [{ label: t('room_view'), value: 'RoomView' }]
          "
          @update:model-value="changeView"
        />
      </div>
    </template>
    <div class="row q-col-gutter-md">
      <div
        v-for="(item, index) in statusOptions"
        :key="index"
        class="q-pt-md col col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12"
        @click="changeStatus(item.roomStatusSn)"
      >
        <div
          class="row justify-between cursor-pointer q-px-md q-py-md rounded-borders"
          style="box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.04)"
          :class="[
            item.color ? `card-${item.color}` : '',
            item.roomStatusSn === statusActive ? `bg-${item.color} text-white` : '',
          ]"
        >
          <div class="column">
            <p class="q-ma-none q-mb-sm text-bold text-body1">{{ t(`${item.typeName}`) }}</p>
            <p
              class="q-ma-none"
              :class="
                item.roomStatusSn === statusActive
                  ? `bg-${item.color} text-white`
                  : `text-${item.color}`
              "
            >
              {{ item.numOfRoom }}
            </p>
          </div>
          <div
            class="full-height row items-center text-h4"
            :class="
              item.roomStatusSn === statusActive
                ? `bg-${item.color} text-white`
                : `text-${item.color}`
            "
          >
            <q-icon :name="item.icon"></q-icon>
          </div>
        </div>
      </div>
    </div>
    <q-inner-loading :showing="numOfRoomFetching">
      <div lass="full-width full-height q-mt-md row justify-center">
        <q-spinner color="negative" :thickness="2" size="2em" />
      </div>
    </q-inner-loading>
  </pms-sections>
  <pms-sections class="q-mt-md">
    <div class="row justify-center q-mb-sm">
      <q-tabs
        v-model="tab"
        dense
        active-color="white"
        align="justify"
        indicator-color="transparent"
        class="row box-shadow-tabs"
        active-bg-color="negative"
      >
        <q-tab name="floor" :label="t('floor')" class="col rounded-borders custom-tab" no-caps />
        <q-tab
          name="roomType"
          :label="t('room_type')"
          class="col rounded-borders custom-tab"
          no-caps
        />
      </q-tabs>
    </div>
    <div>
      <q-tab-panels v-model="tab" class="overflow-auto">
        <q-tab-panel name="floor">
          <div class="relative-position" style="min-height: 200px">
            <div v-for="(floor, indexFloor) in floors" :key="indexFloor">
              <div class="row items-center text-bold text-h5 q-mb-md">
                <p class="q-ma-none q-mr-sm">{{ floor?.name }}</p>
                <q-chip color="negative" text-color="white" :label="String(floor?.numOfRoom)" />
              </div>
              <div class="row q-col-gutter-md">
                <div
                  v-for="(room, indexRoom) in floor?.roomList"
                  :key="indexRoom"
                  class="q-pa-md col-lg-4 col-xl-3 col-md-4 col-sm-6 col-xs-12"
                >
                  <q-card class="q-mb-md" style="box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08)">
                    <q-card-section class="full-height q-pa-none">
                      <div
                        class="row q-pa-sm text-white justify-between items-center"
                        :class="`bg-${setColor(room.roomStatusSn)}`"
                      >
                        <p class="q-mb-none col text-bold">{{ room.name }}</p>
                        <div class="bg-white rounded-borders q-pa-xs q-mr-sm row">
                          <q-icon
                            :class="`text-h6 text-${setColor(room.roomStatusSn)}`"
                            :name="setIcon(room.roomStatusSn)"
                          >
                          </q-icon>
                        </div>
                        <div v-if="Boolean(room.dirty)" class="bg-white rounded-borders q-pa-xs">
                          <q-icon
                            name="cleaning_services"
                            class="text-light-blue-11 text-h6"
                          ></q-icon>
                        </div>
                      </div>
                      <div
                        v-if="room.roomStatusSn === 1"
                        class="row cursor-pointer text-bold full-width items-center justify-center self-center"
                        style="height: 120px"
                      >
                        {{ t('Available') }}
                        <q-menu transition-show="jump-down" transition-hide="jump-up">
                          <q-list style="min-width: 200px">
                            <q-item
                              v-close-popup
                              :class="hasPermission('make-a-reservation') == false ? 'hidden' : ''"
                              clickable
                            >
                              <q-item-section
                                class="row"
                                @click="openReservationDialog(room.roomTypeSn, room.sn)"
                              >
                                {{ t('make_a_reservation') }}
                              </q-item-section>
                            </q-item>
                            <q-separator class="q-my-xs" />
                            <q-item
                              v-close-popup
                              :class="hasPermission('dirty-cleaned-room') == false ? 'hidden' : ''"
                              clickable
                              @click="updateDirtyRoom(room.sn, room.dirty)"
                            >
                              <q-item-section class="row">
                                {{ room.dirty === 1 ? t('cleaned_room') : t('dirty_room') }}
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-close-popup
                              :class="hasPermission('reservations-list') == false ? 'hidden' : ''"
                              clickable
                              @click="openReservationListDialog(room.sn, room.bookingNo)"
                            >
                              <q-item-section class="row">
                                {{ t('reservation_list') }}
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </div>
                      <div v-else class="row items-center q-pa-md cursor-pointer content-room">
                        <div>
                          <p class="text-bold q-ma-none q-mb-sm">{{ room.guestName }}</p>
                          <div class="row items-center q-mb-sm">
                            <q-icon class="block q-mr-sm" name="events"></q-icon>
                            <p class="q-ma-none">
                              {{
                                date.formatDate(
                                  new Date(Number(room.checkIn) * 1000),
                                  FORMAT_DATE_TIME_UI,
                                )
                              }}
                              <span class="q-mx-xs">-</span>
                              {{
                                date.formatDate(
                                  new Date(Number(room.checkOut) * 1000),
                                  FORMAT_DATE_TIME_UI,
                                )
                              }}
                            </p>
                          </div>
                          <p class="font-weight-600 q-ma-none q-mb-sm">
                            <span>{{ room?.bookingTypeName }} - </span>
                            <span v-if="room?.bookingPrice">
                              {{ formatMoney(room?.bookingPrice) }}
                            </span>
                            <span v-else>0</span> <span class="q-mr-xs">VND</span>
                          </p>
                        </div>
                        <q-menu transition-show="jump-down" transition-hide="jump-up">
                          <q-list style="min-width: 200px">
                            <q-item
                              v-close-popup
                              :class="hasPermission('booking-detail') == false ? 'hidden' : ''"
                              clickable
                              @click="
                                $router.push({
                                  name: 'BookingDetails',
                                  params: { sn: room.bookingSn },
                                })
                              "
                            >
                              <q-item-section class="row">
                                {{ t('booking_detail') }}
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-if="room.roomStatusSn !== 3 && room.roomStatusSn !== 5"
                              v-close-popup
                              :class="hasPermission('check-in') == false ? 'hidden' : ''"
                              clickable
                              @click="handleCheckIn(room.bookingSn)"
                            >
                              <q-item-section class="row">{{ t('check_in') }}</q-item-section>
                            </q-item>
                            <q-item
                              v-else
                              v-close-popup
                              :class="hasPermission('check-out') == false ? 'hidden' : ''"
                              clickable
                              @click="openCheckOutDialog(room.bookingSn)"
                            >
                              <q-item-section class="row"> {{ t('check_out') }} </q-item-section>
                            </q-item>
                            <q-separator class="q-my-xs" />
                            <q-item
                              v-if="room.roomStatusSn !== 6"
                              v-close-popup
                              :class="hasPermission('add-services') === false ? 'hidden' : ''"
                              clickable
                              @click="openChangeAddService(room.bookingSn, room.bookingNo)"
                            >
                              <q-item-section class="row"> {{ t('add_services') }} </q-item-section>
                            </q-item>
                            <q-item
                              v-close-popup
                              :class="hasPermission('change-stay-date') == false ? 'hidden' : ''"
                              clickable
                              @click="
                                openChangeStayDate(
                                  room.bookingSn,
                                  room.name,
                                  room.guestName,
                                  Number(room.checkIn),
                                  Number(room.checkOut),
                                  room.roomStatusSn,
                                )
                              "
                            >
                              <q-item-section class="row">{{
                                t('change_stay_date')
                              }}</q-item-section>
                            </q-item>
                            <q-item
                              v-close-popup
                              :class="hasPermission('change-room') == false ? 'hidden' : ''"
                              clickable
                              @click="
                                openChangeRoomDialog(
                                  room.sn,
                                  room.name,
                                  room.guestName,
                                  room.bookingSn,
                                  room.roomTypeSn,
                                )
                              "
                            >
                              <q-item-section class="row">{{ t('change_room') }} </q-item-section>
                            </q-item>
                            <q-separator class="q-my-xs" />
                            <q-item
                              v-if="room.roomStatusSn !== 3 && room.roomStatusSn !== 5"
                              v-close-popup
                              :class="hasPermission('cancel-booking') == false ? 'hidden' : ''"
                              clickable
                              @click="openCancelReservationDialog(room.bookingSn)"
                            >
                              <q-item-section class="row">
                                {{ t('cancel_booking') }}
                              </q-item-section>
                            </q-item>
                            <q-separator
                              v-if="room.roomStatusSn !== 3 && room.roomStatusSn !== 5"
                              class="q-my-xs"
                            />
                            <q-item
                              v-close-popup
                              :class="hasPermission('dirty-cleaned-room') == false ? 'hidden' : ''"
                              clickable
                              @click="updateDirtyRoom(room.sn, room.dirty)"
                            >
                              <q-item-section class="row">
                                {{ room.dirty === 1 ? t('cleaned_room') : t('dirty_room') }}
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-close-popup
                              :class="hasPermission('reservations-list') == false ? 'hidden' : ''"
                              clickable
                              @click="openReservationListDialog(room.sn, room.bookingNo)"
                            >
                              <q-item-section class="row"
                                >{{ t('reservation_list') }}
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
            <q-inner-loading :showing="floorsFetching">
              <div lass="full-width full-height q-mt-md row justify-center">
                <q-spinner color="negative" :thickness="2" size="2em" />
              </div>
            </q-inner-loading>
          </div>
          <div class="row q-col-gutter-md"></div>
        </q-tab-panel>
      </q-tab-panels>
      <q-tab-panels v-model="tab" class="overflow-auto">
        <q-tab-panel name="roomType">
          <div class="relative-position" style="min-height: 200px">
            <div v-for="(roomType, indexRoomType) in roomTypes" :key="indexRoomType">
              <div class="row items-center text-bold text-h5 q-mb-md">
                <p class="q-ma-none q-mr-sm">{{ roomType?.code }}</p>
                <q-chip color="negative" text-color="white" :label="String(roomType?.numOfRoom)" />
              </div>
              <div class="row q-col-gutter-md">
                <div
                  v-for="(room, indexRoom) in roomType?.roomList"
                  :key="indexRoom"
                  class="q-pa-md col-lg-4 col-xl-3 col-md-4 col-sm-6 col-xs-12"
                >
                  <q-card style="box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08)">
                    <q-card-section class="full-height q-pa-none">
                      <div
                        class="row q-pa-sm text-white justify-between items-center"
                        :class="`bg-${setColor(room.roomStatusSn)}`"
                      >
                        <p class="q-mb-none col text-bold">{{ room.name }}</p>
                        <div class="bg-white rounded-borders q-pa-xs q-mr-sm">
                          <q-icon
                            :class="`text-h6 text-${setColor(room.roomStatusSn)}`"
                            :name="setIcon(room.roomStatusSn)"
                          >
                          </q-icon>
                        </div>
                        <div v-if="Boolean(room.dirty)" class="bg-white rounded-borders q-pa-xs">
                          <q-icon
                            name="cleaning_services"
                            class="text-light-blue-11 text-h6"
                          ></q-icon>
                        </div>
                      </div>
                      <div
                        v-if="room.roomStatusSn === 1"
                        class="row cursor-pointer text-bold full-width items-center justify-center self-center"
                        style="height: 120px"
                      >
                        {{ t('available') }}
                        <q-menu transition-show="jump-down" transition-hide="jump-up">
                          <q-list style="min-width: 200px">
                            <q-item
                              v-close-popup
                              :class="hasPermission('make-a-reservation') == false ? 'hidden' : ''"
                              clickable
                            >
                              <q-item-section
                                class="row"
                                @click="openReservationDialog(roomType.sn, room.sn)"
                              >
                                {{ t('make_a_reservation') }}
                              </q-item-section>
                            </q-item>
                            <q-separator class="q-my-xs" />
                            <q-item
                              v-close-popup
                              :class="hasPermission('dirty-cleaned-room') == false ? 'hidden' : ''"
                              clickable
                              @click="updateDirtyRoom(room.sn, room.dirty)"
                            >
                              <q-item-section class="row">
                                {{ room.dirty === 1 ? t('cleaned_room') : t('dirty_room') }}
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-close-popup
                              :class="hasPermission('reservations-list') == false ? 'hidden' : ''"
                              clickable
                              @click="openReservationListDialog(room.sn, room.bookingNo)"
                            >
                              <q-item-section class="row"> Reservation list </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </div>
                      <div
                        v-else
                        style="height: 120px"
                        class="row items-center q-pa-md cursor-pointer content-room"
                      >
                        <div>
                          <p class="text-bold q-ma-none q-mb-sm">{{ room.guestName }}</p>
                          <div class="row items-center q-mb-sm">
                            <q-icon class="block q-mr-sm" name="events"></q-icon>
                            <p class="q-ma-none">
                              {{
                                date.formatDate(
                                  new Date(Number(room.checkIn) * 1000),
                                  FORMAT_DATE_TIME_UI,
                                )
                              }}
                              <span class="q-mx-xs">-</span>
                              {{
                                date.formatDate(
                                  new Date(Number(room.checkOut) * 1000),
                                  FORMAT_DATE_TIME_UI,
                                )
                              }}
                            </p>
                          </div>
                          <p class="font-weight-600 q-ma-none q-mb-sm">
                            <span>{{ room?.bookingTypeName }} - </span>
                            <span v-if="room?.bookingPrice">
                              {{ formatMoney(room?.bookingPrice) }}
                            </span>
                            <span class="q-mr-xs"> VND</span>
                          </p>
                        </div>
                        <q-menu transition-show="jump-down" transition-hide="jump-up">
                          <q-list style="min-width: 200px">
                            <q-item
                              v-close-popup
                              :class="hasPermission('booking-detail') == false ? 'hidden' : ''"
                              clickable
                              @click="
                                $router.push({
                                  name: 'BookingDetails',
                                  params: { sn: room.bookingSn },
                                })
                              "
                            >
                              <q-item-section class="row"> Booking Detail </q-item-section>
                            </q-item>
                            <q-item
                              v-if="room.roomStatusSn !== 3 && room.roomStatusSn !== 5"
                              v-close-popup
                              :class="hasPermission('check-in') == false ? 'hidden' : ''"
                              clickable
                              @click="handleCheckIn(room.bookingSn)"
                            >
                              <q-item-section class="row">Check in</q-item-section>
                            </q-item>
                            <q-item
                              v-else
                              v-close-popup
                              :class="hasPermission('check-out') == false ? 'hidden' : ''"
                              clickable
                              @click="openCheckOutDialog(room.bookingSn)"
                            >
                              <q-item-section class="row"> Check out </q-item-section>
                            </q-item>
                            <q-separator class="q-my-xs" />
                            <q-item
                              v-if="room.roomStatusSn !== 6"
                              v-close-popup
                              clickable
                              @click="openChangeAddService(room.bookingSn, room.name)"
                            >
                              <q-item-section class="row"> Add Services </q-item-section>
                            </q-item>
                            <q-item
                              v-close-popup
                              :class="hasPermission('change-stay-date') == false ? 'hidden' : ''"
                              clickable
                              @click="
                                openChangeStayDate(
                                  room.bookingSn,
                                  room.name,
                                  room.guestName,
                                  Number(room.checkIn),
                                  Number(room.checkOut),
                                  room.roomStatusSn,
                                )
                              "
                            >
                              <q-item-section class="row"> Change stay date </q-item-section>
                            </q-item>
                            <q-item
                              v-close-popup
                              :class="hasPermission('change-room') == false ? 'hidden' : ''"
                              clickable
                              @click="
                                openChangeRoomDialog(
                                  room.sn,
                                  room.name,
                                  room.guestName,
                                  room.bookingSn,
                                  roomType.sn,
                                )
                              "
                            >
                              <q-item-section class="row"> Change room </q-item-section>
                            </q-item>
                            <q-separator class="q-my-xs" />
                            <q-item
                              v-if="room.roomStatusSn !== 3 && room.roomStatusSn !== 5"
                              v-close-popup
                              :class="hasPermission('cancel-booking') == false ? 'hidden' : ''"
                              clickable
                              @click="openCancelReservationDialog(room.bookingSn)"
                            >
                              <q-item-section class="row"> Cancel Booking </q-item-section>
                            </q-item>
                            <q-separator
                              v-if="room.roomStatusSn !== 3 && room.roomStatusSn !== 5"
                              class="q-my-xs"
                            />
                            <q-item
                              v-close-popup
                              :class="hasPermission('dirty-cleaned-room') == false ? 'hidden' : ''"
                              clickable
                              @click="updateDirtyRoom(room.sn, room.dirty)"
                            >
                              <q-item-section class="row">
                                {{ room.dirty === 1 ? t('cleaned_room') : t('dirty_room') }}
                              </q-item-section>
                            </q-item>
                            <q-item
                              v-close-popup
                              :class="hasPermission('reservations-list') == false ? 'hidden' : ''"
                              clickable
                              @click="openReservationListDialog(room.sn, room.bookingNo)"
                            >
                              <q-item-section class="row"> Reservation list </q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
            <q-inner-loading :showing="roomTypesFetching">
              <div lass="full-width full-height q-mt-xl row justify-center">
                <q-spinner color="negative" :thickness="2" size="2em" />
              </div>
            </q-inner-loading>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </pms-sections>
</template>

<style lang="scss" scoped>
.custom-tab :deep(.q-tab__label) {
  font-size: 16px;
  font-weight: bold;
}
.card-primary.is-active {
  background-color: $blue-1;
}
.card-primary {
  &:hover {
    background-color: $blue-1;
  }
}
.card-secondary {
  &:hover {
    background-color: $teal-1;
  }
}
.card-green-9 {
  &:hover {
    background-color: $green-1;
  }
}
.card-red-10 {
  &:hover {
    background-color: $deep-orange-1;
  }
}
.card-warning {
  &:hover {
    background-color: $amber-1;
  }
}
.card-accent {
  &:hover {
    background-color: $purple-1;
  }
}
.content-room {
  height: 120px;
  @media only screen and (max-width: $breakpoint-xs) {
    height: 140px;
  }
}

.box-shadow-tabs {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  color: #9a9a9a;

  button {
    span {
      font-weight: bold;
      color: #9a9a9a;
    }
  }
}

.box-shadow-tabs::v-deep(.q-btn__content) {
  span {
    font-weight: bold;
    font-size: 16px;
  }
}

.box-shadow-tabs::v-deep(.q-btn) {
  border-radius: 4px;
}

.custom-tab {
  width: 176px;
}

.font-weight-600 {
  font-weight: 600;
}
.q-tab-panel {
  padding: 0;
  overflow: hidden;
}
</style>
