<script setup lang="ts">
import { ref } from 'vue';
import PaymentForm from '../components/payment-form.vue';
import InformationForm from '../components/infomation-form.vue';
import ChangeStayDateDialog from '../room-view/components/ChangeStayDateDialog.vue';
import CheckOutDialog from '../room-view/components/CheckOutDialog.vue';
import ChangeRoomDialog from '../room-view/components/ChangeRoomDialog.vue';
import CancelReservationDialog from '../room-view/components/CancelReservation.vue';
import ServicesTable from '../components/services-table.vue';
import useBookingDetail from '../composable/useBookingDetails';
import useOpenDialog from '../room-view/composable/useOpenDialog';
import { setBookingStatus } from '../composable/useBookingStatus';
import { useAuth } from '~/composable/useAuth';
import { useRoute } from 'vue-router';
import { useI18n } from '~/composable/useI18n';
import { useQuasar } from 'quasar';
import { useNotify } from '~/composable/useNotify';
import { useCheckInMutation } from '~/modules/booking/room-view/apis/useCheckInMutation';

let tab = ref();
const route = useRoute();
if (!route.params.tab) {
  tab.value = 'roomInformation';
} else {
  tab.value = route.params.tab;
}
const { notifyUpdateSuccess } = useNotify();
const checkInMutation = useCheckInMutation();
const $q = useQuasar();
const { t } = useI18n();
const { hasPermission } = useAuth();
// use vue-query
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
            refetchBookingDetails.value();
          }
        },
      },
    );
  });
};
const {
  isDisplayEarlyCheckIn,
  formPayment,
  formRoomInfo,
  serviceInfo,
  refetchBookingDetails,
  bookingDetailsFetching,
} = useBookingDetail();
const {
  ui,
  cancelReservationDialogRef,
  changeStayDateDialogRef,
  changeRoomDialogRef,
  checkOutDialogRef,
  openChangeStayDate,
  openCancelReservationDialog,
  openChangeRoomDialog,
  openCheckOutDialog,
} = useOpenDialog();
const handleSuccess = (actions: string) => {
  refetchBookingDetails.value();
  switch (actions) {
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
    default:
      break;
  }
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
  <ChangeStayDateDialog
    ref="changeStayDateDialogRef"
    v-model="ui.changeStayDateVisible"
    @change-success="handleSuccess('changeStayDate')"
  />
  <pms-sections
    :title="t('booking_detail')"
    class="relative-position"
    style="min-height: calc(100vh - 265px)"
  >
    <div class="row justify-between items-center" style="height: 100%">
      <p class="text-bold" style="font-size: 20px">
        {{ formRoomInfo?.roomTypeCode }} - {{ formRoomInfo?.roomName }}
      </p>
      <div class="row items-center">
        <p style="font-size: 20px">#{{ formRoomInfo?.bookingNo }}</p>
        <q-btn
          class="q-mx-lg"
          no-caps
          unelevated
          :color="setBookingStatus(formRoomInfo?.bookingStatusSn)?.color"
        >
          <p class="text-bold">{{ setBookingStatus(formRoomInfo?.bookingStatusSn)?.typeName }}</p>
        </q-btn>
        <q-btn
          v-if="formRoomInfo?.bookingStatusSn !== 3 && formRoomInfo?.bookingStatusSn !== 6"
          class="bg-grey-1"
          icon="more_vert"
          flat
        >
          <q-menu transition-show="jump-down" transition-hide="jump-up">
            <q-list style="min-width: 200px">
              <q-item
                v-close-popup
                :class="hasPermission('edit-booking-detail') == false ? 'hidden' : ''"
                clickable
              >
                <q-item-section
                  class="row"
                  @click="
                    $router.push({
                      name: 'BookingEdit',
                      params: { sn: $route.params.sn },
                    })
                  "
                >
                  {{ t('edit_booking') }}
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item
                :class="hasPermission('check-out') == false ? 'hidden' : ''"
                v-if="formRoomInfo?.bookingStatusSn === 2 || formRoomInfo?.bookingStatusSn === 5"
                v-close-popup
                clickable
                @click="openCheckOutDialog(formRoomInfo?.sn)"
              >
                <q-item-section class="row"> {{ t('check_out') }} </q-item-section>
              </q-item>
              <q-item
                :class="hasPermission('check-in') == false ? 'hidden' : ''"
                v-if="formRoomInfo?.bookingStatusSn === 4 || formRoomInfo?.bookingStatusSn === 1"
                v-close-popup
                clickable
                @click="handleCheckIn(formRoomInfo?.sn)"
              >
                <q-item-section class="row"> {{ t('check_in') }} </q-item-section>
              </q-item>
              <q-item
                :class="hasPermission('change-stay-date') == false ? 'hidden' : ''"
                v-if="
                  formRoomInfo?.bookingStatusSn === 1 ||
                  formRoomInfo?.bookingStatusSn === 4 ||
                  formRoomInfo?.bookingStatusSn === 2 ||
                  formRoomInfo?.bookingStatusSn === 5
                "
                v-close-popup
                clickable
                @click="
                  openChangeStayDate(
                    formRoomInfo?.sn,
                    `${formRoomInfo?.roomTypeCode} - ${formRoomInfo?.roomName}`,
                    formRoomInfo?.guest[0]?.fullName,
                    Number(formRoomInfo?.checkIn),
                    Number(formRoomInfo?.checkOut),
                    formRoomInfo?.roomStatusSn,
                  )
                "
              >
                <q-item-section class="row"> {{ t('change_stay_date') }} </q-item-section>
              </q-item>
              <q-item
                :class="hasPermission('change-room') == false ? 'hidden' : ''"
                v-if="
                  formRoomInfo?.bookingStatusSn === 1 ||
                  formRoomInfo?.bookingStatusSn === 4 ||
                  formRoomInfo?.bookingStatusSn === 2 ||
                  formRoomInfo?.bookingStatusSn === 5
                "
                v-close-popup
                clickable
                @click="
                  openChangeRoomDialog(
                    formRoomInfo?.roomSn,
                    `${formRoomInfo?.roomTypeCode} - ${formRoomInfo?.roomName}`,
                    formRoomInfo?.guest[0]?.fullName,
                    formRoomInfo?.sn,
                    formRoomInfo?.roomTypeSn,
                  )
                "
              >
                <q-item-section class="row"> {{ t('change_room') }} </q-item-section>
              </q-item>
              <q-separator />
              <q-item
                :class="hasPermission('cancel-booking') == false ? 'hidden' : ''"
                v-if="formRoomInfo?.bookingStatusSn === 1 || formRoomInfo?.bookingStatusSn === 4"
                v-close-popup
                clickable
                @click="openCancelReservationDialog(formRoomInfo?.sn)"
              >
                <q-item-section class="row"> {{ t('cancel_booking') }} </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
    <q-separator class="q-my-md" />
    <div class="row justify-center q-mb-md">
      <q-tabs
        v-model="tab"
        dense
        active-color="white"
        align="justify"
        indicator-color="transparent"
        class="box-shadow-tabs col-lg-5 col-md-8 col-xs-12 row"
        active-bg-color="negative"
      >
        <q-tab
          name="roomInformation"
          class="col custom-tab"
          :label="t('room_information')"
          no-caps
        />
        <q-tab name="services" class="col custom-tab" :label="t('services')" no-caps />
        <q-tab name="payment" class="col custom-tab" :label="t('payment')" no-caps />
      </q-tabs>
    </div>
    <div>
      <q-tab-panels v-model="tab" class="overflow-auto">
        <q-tab-panel name="roomInformation">
          <InformationForm :data="formRoomInfo" page="details" />
        </q-tab-panel>
      </q-tab-panels>
      <q-tab-panels v-model="tab" class="overflow-auto">
        <q-tab-panel name="services">
          <ServicesTable :data="serviceInfo" :room-info="formRoomInfo" page="services" />
        </q-tab-panel>
      </q-tab-panels>
      <q-tab-panels v-model="tab" class="overflow-auto">
        <q-tab-panel name="payment">
          <PaymentForm
            :form-room-info="formRoomInfo"
            :data="formPayment"
            page="details"
            :is-display-early-check-in="isDisplayEarlyCheckIn"
          />
        </q-tab-panel>
      </q-tab-panels>
      <div class="flex justify-end text-body1 q-mt-md text-grey-6">
        <router-link style="text-decoration: none" class="custom-link" :to="{ name: 'RoomView' }">{{
          t('back_to_room_view_mode')
        }}</router-link>
      </div>
    </div>
    <q-inner-loading :showing="bookingDetailsFetching">
      <div lass="full-width full-height q-mt-md row justify-center">
        <q-spinner color="negative" :thickness="2" size="2em" />
      </div>
    </q-inner-loading>
  </pms-sections>
</template>
<style scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
<style lang="scss" scoped>
.custom-link {
  color: $grey-9;
  transition: all 0.2s ease-in;
  &:hover {
    color: var(--q-negative);
  }
}

.box-shadow-tabs {
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
}

.custom-tab {
  color: #9a9a9a;
  width: 186px;
  border-radius: 4px;
}

.q-tab-panel {
  padding: 1px;
}

p {
  margin: 0;
}
</style>
