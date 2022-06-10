<script setup lang="ts">
import { ref } from 'vue';
import { useUpdateBookingDetailMutation } from './apis/useUpdateBookingDetailMutation';
import PaymentForm from '../components/payment-form.vue';
import InformationForm from '../components/infomation-form.vue';
import ChangeStayDateDialog from '../room-view/components/ChangeStayDateDialog.vue';
import CheckOutDialog from '../room-view/components/CheckOutDialog.vue';
import { useI18n } from '~/composable/useI18n';
import ChangeRoomDialog from '../room-view/components/ChangeRoomDialog.vue';
import CancelReservationDialog from '../room-view/components/CancelReservation.vue';
import ServicesTable from '../components/services-table.vue';
import useBookingDetail from '../composable/useBookingDetails';
import { useNotify } from '~/composable/useNotify';
import { useQuasar } from 'quasar';
import useCheckIn from '../composable/useCheckIn';
import useOpenDialog from '../room-view/composable/useOpenDialog';
import { setBookingStatus } from '../composable/useBookingStatus';
import { useRoute, useRouter } from 'vue-router';
// data
const { notifyUpdateSuccess } = useNotify();
const { t } = useI18n();
const $q = useQuasar();
const tab = ref('roomInformation');
const route = useRoute();
const router = useRouter();
const formInforRef = ref<HTMLFormElement>();
const formPaymentRef = ref<HTMLFormElement>();
// composables
const updateBookingDetailMutation = useUpdateBookingDetailMutation();
const { handleCheckIn } = useCheckIn();
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
// methods
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
const onSubmitForm = () => {
  $q.dialog({
    message: t('confirm_edit_pricing'),
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
    const serviceInfoPost = serviceInfo.value.map(function (item: any) {
      return {
        createBy: item.createBy,
        deleteBy: item.deleteBy,
        deleteReason: item.deleteReason,
        deleteTime: item.deleteTime,
        productName: item.productName,
        productSn: item.productSn,
        quantity: item.quantity,
        sn: item.sn,
        totalPrice: item.totalPrice,
        unitPrice: item.unitPrice,
      };
    });
    const params = {
      bookingSn: formRoomInfo.value.sn,
      bookingTypeSn: formRoomInfo.value.bookingTypeSn,
      bookingSourceSn: formRoomInfo.value.bookingSourceSn,
      note: formRoomInfo.value.note,
      guest: formRoomInfo.value.guest,
      extraFee: formPayment.value.extraFee,
      depositMethodSn: formPayment.value.depositMethodSn,
      amountDeposit: formPayment.value.amountDeposit,
      discount: formPayment.value.discount,
      service: serviceInfoPost,
    };
    updateBookingDetailMutation.mutate(params, {
      onSuccess: () => {
        notifyUpdateSuccess();
        refetchBookingDetails.value();
        router.push({ name: 'BookingDetails', params: { sn: formRoomInfo.value.sn } });
      },
    });
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
  <ChangeStayDateDialog
    ref="changeStayDateDialogRef"
    v-model="ui.changeStayDateVisible"
    @change-success="handleSuccess('changeStayDate')"
  />
  <pms-sections :title="t('edit_booking_detail')" class="relative-position">
    <div class="row justify-between items-center" style="height: 100%">
      <p class="text-bold" style="font-size: 20px">
        {{ formRoomInfo?.roomTypeCode }} - {{ formRoomInfo?.roomName }}
      </p>
      <div class="row items-center">
        <p style="font-size: 20px; margin-right: 16px">#{{ formRoomInfo?.bookingNo }}</p>
        <q-btn no-caps unelevated :color="setBookingStatus(formRoomInfo?.bookingStatusSn)?.color">
          <p class="text-bold">{{ setBookingStatus(formRoomInfo?.bookingStatusSn)?.typeName }}</p>
        </q-btn>
        <q-btn v-if="route.name !== 'BookingEdit'" class="bg-grey-1" icon="more_vert" flat>
          <q-menu transition-show="jump-down" transition-hide="jump-up">
            <q-list style="min-width: 200px">
              <q-separator />
              <q-item
                v-if="formRoomInfo?.bookingStatusSn === 2 || formRoomInfo?.bookingStatusSn === 5"
                v-close-popup
                clickable
                @click="openCheckOutDialog(formRoomInfo?.sn)"
              >
                <q-item-section class="row"> {{ t('check_out') }} </q-item-section>
              </q-item>
              <q-item
                v-if="formRoomInfo?.bookingStatusSn === 4 || formRoomInfo?.bookingStatusSn === 1"
                v-close-popup
                clickable
                @click="handleCheckIn(formRoomInfo?.sn)"
              >
                <q-item-section class="row"> {{ t('check_in') }} </q-item-section>
              </q-item>
              <q-item
                v-if="
                  formRoomInfo?.bookingStatusSn === 1 ||
                  formRoomInfo?.bookingStatusSn === 4 ||
                  formRoomInfo?.bookingStatusSn === 2
                "
                v-close-popup
                clickable
                @click="
                  openChangeStayDate(
                    formRoomInfo?.sn,
                    formRoomInfo?.roomName,
                    formRoomInfo?.guest[0]?.fullName,
                    Number(formRoomInfo?.checkIn),
                    Number(formRoomInfo?.checkOut),
                    formRoomInfo?.bookingStatusSn,
                  )
                "
              >
                <q-item-section class="row"> {{ t('change_stay_date') }} </q-item-section>
              </q-item>
              <q-item
                v-if="
                  formRoomInfo?.bookingStatusSn === 1 ||
                  formRoomInfo?.bookingStatusSn === 4 ||
                  formRoomInfo?.bookingStatusSn === 2
                "
                v-close-popup
                clickable
                @click="
                  openChangeRoomDialog(
                    formRoomInfo?.roomSn,
                    formRoomInfo?.roomName,
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
          <InformationForm ref="formInforRef" :data="formRoomInfo" page="edit" />
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
            ref="formPaymentRef"
            :form-room-info="formRoomInfo"
            :data="formPayment"
            page="edit"
            :is-display-early-check-in="isDisplayEarlyCheckIn"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <div class="text-right q-mt-md">
      <q-btn
        class="q-mr-md"
        dense
        outline
        no-caps
        color="grey-8"
        style="padding: 8px 20px"
        label="Cancel"
        @click="
          $router.push({
            name: 'BookingDetails',
            params: { sn: $route.params.sn },
          })
        "
      >
      </q-btn>

      <q-btn class="" color="negative" label="Save" no-caps @click="onSubmitForm" />
    </div>
    <q-inner-loading :showing="bookingDetailsFetching">
      <div lass="full-width full-height q-mt-md row justify-center">
        <q-spinner color="negative" :thickness="2" size="2em" />
      </div>
    </q-inner-loading>
  </pms-sections>
</template>
<style lang="scss" scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
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
