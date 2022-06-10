<script setup lang="ts">
import { IRoomInformation } from '../booking-details/apis/useBookingDetailQuery';
import { useBookingSourcesQuery } from '~/apis/commons/useAppendixQuery';
import { IGuest } from '../room-view/apis/useGuestListQuery';
import AddGuestDialog from './add-guest-dialog.vue';
import { formatMoney, changeMoney } from '~/composable/useFormat';
import { toRefs, reactive, ref } from 'vue';
// import { BOOKING_TYPE_OPTIONS } from '../room-view/const';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { FORMAT_DATE_TIME_UI } from '~/constants';
import { date } from 'quasar';
import { computed } from 'vue';

// interface
interface IProps {
  data: IRoomInformation;
  page: string;
}
const BOOKING_TYPE_OPTIONS = computed(() => [
  {
    label: t('hourly'),
    value: 1,
  },
  {
    label: t('overnight'),
    value: 2,
  },
  {
    label: t('daily'),
    value: 3,
  },
]);
// ref dom
const infoFormRef = ref<HTMLFormElement>();
const route = useRoute();
// data
const { formatDate } = date;
const props = defineProps<IProps>();
const ui = reactive({
  addGuestDialogVisible: false,
});
const { t } = useI18n();
const { data: bookingSourceOptions, isFetching: useBookingSourcesFetching } =
  useBookingSourcesQuery({ enabled: true });
// const formRoomInfo = props.data;
const formRoomInfo = toRefs(props).data;
const addGuest = (guestNew: IGuest) => {
  ui.addGuestDialogVisible = false;
  formRoomInfo.value.guest.push(guestNew);
};
const deleteGuest = (guest: IGuest, index: number) => {
  formRoomInfo.value.guest.splice(index, 1);
};
</script>
<template>
  <AddGuestDialog v-model="ui.addGuestDialogVisible" @add-guest="addGuest" />
  <q-form ref="infoFormRef">
    <div class="row items-center">
      <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pr-sm">
        <p class="q-mb-xs text-weight-bold">{{ t('booking_type') }}*</p>
        <q-select
          v-model="formRoomInfo.bookingTypeSn"
          filled
          dense
          :options="BOOKING_TYPE_OPTIONS"
          behavior="menu"
          emit-value
          map-options
          :readonly="
            props.page === 'details' ||
            (formRoomInfo?.bookingStatusSn !== 1 && formRoomInfo?.bookingStatusSn !== 4)
          "
          :bg-color="
            props.page === 'details' ||
            (formRoomInfo?.bookingStatusSn !== 1 && formRoomInfo?.bookingStatusSn !== 4)
              ? 'grey-5'
              : ''
          "
          class="q-field--with-bottom"
          :class="
            props.page === 'details' ||
            (formRoomInfo?.bookingStatusSn !== 1 && formRoomInfo?.bookingStatusSn !== 4)
              ? 'custom-input-readonly'
              : ''
          "
        >
        </q-select>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pr-sm">
        <p class="q-mb-xs text-weight-bold">{{ t('booking_source_name') }}</p>
        <q-select
          v-model="formRoomInfo.bookingSourceSn"
          :loading="useBookingSourcesFetching"
          filled
          dense
          :options="bookingSourceOptions"
          option-value="sn"
          :label="t('select_source')"
          option-label="name"
          map-options
          clearable
          emit-value
          :bg-color="props.page === 'details' ? 'grey-5' : ''"
          :readonly="props.page === 'details'"
          class="q-field--with-bottom limit-text"
          :class="props.page === 'details' ? 'custom-input-readonly' : ''"
        >
        </q-select>
      </div>
      <div
        v-if="
          formRoomInfo?.bookingStatusSn === 1 ||
          formRoomInfo?.bookingStatusSn === 3 ||
          formRoomInfo?.bookingStatusSn === 4
        "
        class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pr-sm"
      >
        <p class="q-mb-xs text-weight-bold">{{ t('arrival_date_time') }}</p>
        <q-field
          v-model="formRoomInfo.checkIn"
          :placeholder="props.page === `${t('details')}` ? '' : `${t('select_date_time')}`"
          dense
          bg-color="grey-5"
          filled
          readonly
          class="q-field--with-bottom custom-input-readonly"
        >
          <template #prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                :style="route.name === 'BookingDetails' ? 'display:none' : ''"
                transition-hide="scale"
              >
                <q-date v-model="formRoomInfo.checkIn" readonly>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">
              {{ formatDate(new Date(Number(formRoomInfo?.checkIn) * 1000), FORMAT_DATE_TIME_UI) }}
            </div>
          </template>
        </q-field>
      </div>
      <div
        v-if="
          formRoomInfo?.bookingStatusSn === 2 ||
          formRoomInfo?.bookingStatusSn === 5 ||
          formRoomInfo?.bookingStatusSn === 6
        "
        class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pr-sm"
      >
        <p class="q-mb-xs text-weight-bold">{{ t('actual_check_in_date_time') }}</p>
        <q-field
          v-model="formRoomInfo.checkInActual"
          :placeholder="props.page === `${t('details')}` ? '' : `${t('select_date_time')}`"
          dense
          filled
          bg-color="grey-5"
          readonly
          class="q-field--with-bottom custom-input-readonly"
        >
          <template #prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                :style="route.name === 'BookingDetails' ? 'display:none' : ''"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formRoomInfo.checkInActual" readonly>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">
              {{
                formatDate(new Date(Number(formRoomInfo.checkInActual) * 1000), FORMAT_DATE_TIME_UI)
              }}
            </div>
          </template>
        </q-field>
      </div>
      <div
        v-if="formRoomInfo?.bookingStatusSn !== 6"
        class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pr-sm"
      >
        <p class="q-mb-xs text-weight-bold">{{ t('departure_date_time') }}</p>
        <q-field
          v-model="formRoomInfo.checkOut"
          :placeholder="props.page === `${t('details')}` ? '' : `${t('select_date_time')}`"
          dense
          filled
          bg-color="grey-5"
          readonly
          class="q-field--with-bottom custom-input-readonly"
        >
          <template #prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                :style="route.name === 'BookingDetails' ? 'display:none' : ''"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formRoomInfo.checkOut" readonly>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">
              {{ formatDate(new Date(Number(formRoomInfo.checkOut) * 1000), FORMAT_DATE_TIME_UI) }}
            </div>
          </template>
        </q-field>
      </div>
      <div
        v-if="formRoomInfo?.bookingStatusSn === 6"
        class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pr-sm"
      >
        <p class="q-mb-xs text-weight-bold">{{ t('actual_check_out_date_time') }}</p>
        <q-field
          v-model="formRoomInfo.checkOutActual"
          :placeholder="props.page === `${t('details')}` ? '' : `${t('select_date_time')}`"
          dense
          filled
          bg-color="grey-5"
          readonly
          class="q-field--with-bottom custom-input-readonly"
        >
          <template #prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                :style="route.name === 'BookingDetails' ? 'display:none' : ''"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formRoomInfo.checkOutActual" readonly>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">
              {{
                formatDate(
                  new Date(Number(formRoomInfo.checkOutActual) * 1000),
                  FORMAT_DATE_TIME_UI,
                )
              }}
            </div>
          </template>
        </q-field>
      </div>
    </div>
    <div class="row items-center">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-sm">
        <p class="q-mb-xs text-weight-bold">{{ t('pricing_plan_name') }}</p>
        <q-input
          v-model="formRoomInfo.pricingPlanName"
          dense
          filled
          bg-color="grey-5"
          readonly
          class="custom-input-readonly"
        >
        </q-input>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-sm">
        <p class="q-mb-xs text-weight-bold">{{ t('room_price') }}</p>
        <q-field
          v-model.number="formRoomInfo.roomPrice"
          filled
          dense
          class="custom-input custom-input-readonly"
          suffix="VND"
          bg-color="orange-1"
          label-color="negative"
          color="negative"
          readonly
        >
          <template #control="{ id, floatingLabel, modelValue: modelBalance, emitValue }">
            <input
              v-show="floatingLabel"
              :id="id"
              readonly
              class="q-field__input text-right text-negative text-bold text-body1"
              :value="formatMoney(modelBalance)"
              @change="(e) => changeMoney(e, modelBalance, emitValue)"
            />
          </template>
        </q-field>
      </div>
    </div>
    <div class="q-mt-md q-pr-sm">
      <p class="q-mb-xs text-weight-bold">{{ t('note') }}</p>
      <q-input
        v-model="formRoomInfo.note"
        filled
        dense
        :placeholder="props.page === `${t('details')}` ? '' : `${t('input_note')}`"
        behavior="menu"
        class="q-mb-lg"
        :class="props.page === 'details' ? 'custom-input-readonly' : ''"
        :readonly="props.page === 'details'"
        :bg-color="props.page === 'details' ? 'grey-5' : ''"
        :rules="[(val) => !val || val.length <= 200 || t('the_length_is_from_0_to_200_characters')]"
      ></q-input>
    </div>
    <q-separator />
    <div class="q-py-md row justify-between">
      <p class="text-bold text-body1 q-ma-none">{{ t('guest_information') }}</p>
      <q-btn
        v-if="props.page !== 'details'"
        class="q-ma-none text-negative"
        flat
        no-caps
        @click="ui.addGuestDialogVisible = true"
      >
        <q-icon class="text-caption q-mr-xs" name="add_circle"></q-icon>
        <span> {{ t('add_guest') }}</span>
      </q-btn>
    </div>
    <div
      v-for="(guest, indexGuest) in formRoomInfo.guest"
      :key="indexGuest"
      class="q-mt-none row items-center q-pa-md"
      style="background: #78788014"
    >
      <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pr-sm">
        <p class="q-mb-xs text-weight-bold">{{ t('guest_name') }}*</p>
        <q-input
          v-model="guest.fullName"
          filled
          dense
          behavior="menu"
          lazy-rules
          :rules="[(val) => !!val || 'Please input Guest name']"
          bg-color="grey-5"
          readonly
          class="custom-input-readonly"
        >
        </q-input>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pr-sm">
        <p class="q-mb-xs text-weight-bold">{{ t('identity_number') }}</p>
        <q-input
          v-model="guest.identityNumber"
          :placeholder="props.page === 'details' ? '' : t('input_identity_number')"
          filled
          class="q-field--with-bottom custom-input-readonly"
          bg-color="grey-5"
          readonly
          dense
        >
        </q-input>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pr-sm">
        <p class="q-mb-xs text-weight-bold">{{ t('email') }}</p>
        <q-input
          v-model="guest.email"
          :placeholder="props.page === `${t('details')}` ? '' : `${t('input_email')}`"
          class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-mr-none q-field--with-bottom custom-input-readonly"
          filled
          bg-color="grey-5"
          dense
          readonly
        >
        </q-input>
      </div>
      <div
        :class="props.page === 'edit' ? 'col-lg-2 col-md-2' : 'col-lg-3 col-md-3 '"
        class="col-sm-6 col-xs-12 q-pr-sm"
      >
        <p class="q-mb-xs text-weight-bold">{{ t('phone') }}</p>
        <q-input
          v-model="guest.mobile"
          :placeholder="props.page === `${t('details')}` ? '' : `${t('input_phone_number')}`"
          class="col q-field--with-bottom custom-input-readonly"
          dense
          filled
          bg-color="grey-5"
          readonly
        >
        </q-input>
      </div>
      <q-btn
        v-if="props.page === 'edit'"
        icon="delete"
        flat
        style="height: 40px"
        class="btn-delete"
        :class="guest.sn ? 'cursor-pointer' : 'cursor-inherit'"
        :disable="formRoomInfo.guest.length < 2"
        @click="deleteGuest(guest, indexGuest)"
      >
      </q-btn>
    </div>
  </q-form>
</template>
<style lang="scss" scoped>
.custom-input :deep(.q-field__suffix) {
  color: var(--q-negative);
  font-size: 16px;
  font-weight: 500;
  padding-right: 16px;
}
.btn-delete {
  margin-top: 5px;
  &:hover {
    background-color: none;
    color: $negative;
  }
}
.custom-input-readonly :deep(.q-field__control) {
  &::before {
    border: none;
  }
}
.limit-text :deep(span) {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: left;
}
</style>
