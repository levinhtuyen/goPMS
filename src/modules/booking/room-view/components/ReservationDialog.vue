<script setup lang="ts">
export interface IReservationDialog {
  setupReservationDialog(
    roomTypeSn: number | null,
    roomSn: number | null,
    hourNum: number | null,
    useSuggestedPriced?: number,
  ): void;
}
import { computed, reactive, ref, watch } from 'vue';
import { useNotify } from '~/composable/useNotify';
import { createNewDate } from '~/composable/useCreateDate';
import { isMinStartSmallerThanEnd } from '~/composable/useValidate';
import { useBookingSourcesQuery } from '~/apis/commons/useAppendixQuery';
import { usePricingPlanQuery } from '../apis/usePricingPlanQuery';
import { useRoomTypeListQuery } from '~/modules/room-settings/apis/useRoomTypeListQuery';
import { useRoomListQuery } from '../apis/useRoomListQuery';
import { usePoliciesQuery } from '../apis/usePoliciesQuery';
import { useGuestListQuery, IGuest } from '../apis/useGuestListQuery';
import { date, ValidationRule } from 'quasar';
import { useCreateReservationMutation } from '../apis/useCreateReservationMutation';
import { validateEmail } from '~/composable/useValidate';
import { useI18n } from '~/composable/useI18n';
import { formatMoney, changeMoney } from '~/composable/useFormat';
import { useQuasar } from 'quasar';
import { FORMAT_DATE_TIME_UI, GUESTS_ACTIONS } from '~/constants';
import useCalCulator from '../composable/useCalculator';
// import { DEPOSIT_METHOD_OPTIONS } from '../const';
// interface
interface IEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'createSuccess'): void;
}
interface IProps {
  modelValue: boolean;
}
interface IBookingTypeOption {
  value: number;
  label: string;
}

// prop, emits
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
// ref dom
const reservationFomRef = ref<HTMLFormElement>();
// data
const $q = useQuasar();
const { addToDate, subtractFromDate, formatDate } = date;
const { t } = useI18n();
const guestInputType = ref(GUESTS_ACTIONS.NEW_GUEST);
const { notifyCreateSuccess } = useNotify();
const inputActive = reactive({
  extraFee: false,
  amountDeposit: false,
  discount: false,
});
const initialData = {
  useSuggestedPrice: 0 as number | null,
  roomTypeSn: null as number | null,
  roomSn: null as number | null,
  bookingTypeSn: null as number | null,
  checkIn: '' as string,
  checkOut: '' as string,
  bookingSourceSn: '',
  guestName: '',
  extraFee: 0,
  pricingPlanName: '' as string | undefined,
  roomPrice: 0,
  guestInfo: null as IGuest | null,
  identityNumber: '' as string | null,
  guestEmail: null as string | null,
  guestPhone: '' as string | null,
  totalCharge: 0,
  depositMethod: null as number | null,
  amountDeposit: 0,
  discount: 0,
  balance: 0,
  note: '',
  bookingStatusSn: null as number | null,
  pricingPlanSn: null as number | null,
  depositMethodSn: null as number | null,
};
let formData = reactive({ ...initialData });
const guestOptions = ref<IGuest[]>();
const { calculateBookingAmount } = useCalCulator(formData);
const createReservationMutation = useCreateReservationMutation();
const roomTypeSn = ref<number | null>(null);
const keySearchGuest = ref<string>('');
const enabled = computed(() => (roomTypeSn.value ? true : false));
const emailRules: ValidationRule<string>[] = [
  (value) => 100 >= value.length || t('the_length_is_from_0_to_100_characters'),
  (value) => validateEmail(value) || t('invalid_email_format'),
];
const checkInRules = ref([
  (val: string) => !!val || t('this_field_is_required'),
  () =>
    isMinStartSmallerThanEnd(formatDate(new Date(), 'DD/MM/YYYY HH:mm'), formData.checkIn) ||
    t('the_time_must_be_greater_than_current_time'),
]);
const checkOutRules = ref([
  (val: string) => !!val || t('this_field_is_required'),
  () =>
    isMinStartSmallerThanEnd(formData.checkIn, formData.checkOut) ||
    t('the_time_must_be_greater_than_arrival_date_time'),
]);
const { data: bookingSourceOptions, refetch: refetchBookingSource } = useBookingSourcesQuery({
  enabled: enabled.value,
});
const { data: pricingPlanData } = usePricingPlanQuery(roomTypeSn, {
  enabled: true,
});
const { data: roomListData, isFetching: roomListFetching } = useRoomListQuery(roomTypeSn, {
  enabled: true,
});
const { data: guestListData } = useGuestListQuery(keySearchGuest, {
  enabled: true,
});
const { data: policiesData } = usePoliciesQuery();
const { data: roomTypeListData } = useRoomTypeListQuery();
// watch
watch(pricingPlanData, () => {
  formData.pricingPlanName = pricingPlanData.value?.pricingPlan?.name;
  formData.pricingPlanSn = pricingPlanData.value?.pricingPlan?.sn || null;
  if (formData.checkIn && formData.checkOut) {
    calculateBookingAmount();
  }
});
watch(guestInputType, () => {
  clearGuestName();
});
watch(guestListData, () => {
  guestOptions.value = guestListData.value;
});
// computed
const bookingTypeOptions = computed(() => {
  if (!pricingPlanData.value) {
    return [];
  }
  const options: IBookingTypeOption[] = [];
  if (pricingPlanData?.value?.bookingTypeList) {
    pricingPlanData?.value?.bookingTypeList.forEach((el: number | null) => {
      switch (el) {
        case 1:
          options.push({
            label: t('hourly'),
            value: 1,
          });
          break;
        case 2:
          options.push({
            label: t('overnight'),
            value: 2,
          });
          break;
        case 3:
          options.push({
            label: t('daily'),
            value: 3,
          });
          break;
        default:
          break;
      }
    });
  }
  return options;
});
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emits('update:modelValue', value);
  },
});
const bookingSourceRule = computed(() => {
  if (formData.depositMethodSn === 4) {
    return [(value: number) => !!value || t('booking_source_required')];
  } else {
    return [];
  }
});
const DEPOSIT_METHOD_OPTIONS = computed(() => [
  {
    value: 1,
    label: t('cash'),
  },
  {
    value: 2,
    label: t('credit_card'),
  },
  {
    value: 3,
    label: t('bank_transfer'),
  },
  {
    value: 4,
    label: t('debt'),
  },
]);
// method
const resetFormData = () => {
  roomTypeSn.value = null;
  keySearchGuest.value = '';
  Object.assign(formData, initialData);
};
const checkInOptions = (date: string) => {
  return new Date(date) >= subtractFromDate(new Date(), { day: 1 });
};
const checkOutOptions = (date: string) => {
  const checkIn = formData.checkIn ? createNewDate(formData.checkIn) : '';
  if (checkIn) {
    checkIn.setHours(0, 0, 0);
  }
  if (formData.bookingTypeSn === 1) {
    return checkIn
      ? new Date(date) >= new Date(checkIn)
      : new Date(date) >= subtractFromDate(new Date(), { day: 1 });
  } else if (formData.bookingTypeSn === 2 || formData.bookingTypeSn === 3) {
    return checkIn ? new Date(date) > checkIn : new Date(date) >= new Date();
  }
  return new Date(date) >= subtractFromDate(new Date(), { day: 1 });
};
const changeGuestName = () => {
  if (!formData.guestName) {
    formData.guestName = t('guest_make');
  }
};
const setupReservationDialog = async (
  romType: number | null,
  room: number | null,
  hourNum: number | null,
  useSuggestedPriced?: number,
) => {
  roomTypeSn.value = romType;
  formData.roomTypeSn = romType;
  formData.roomSn = room;
  formData.guestName = t('guest_make');
  formData.useSuggestedPrice = useSuggestedPriced || 0;
  if (typeof useSuggestedPriced !== 'undefined') {
    formData.bookingTypeSn = 1;
    const startDate = addToDate(new Date(), { hours: 0 });
    const endDate = addToDate(new Date(), { hours: Number(hourNum) || 0 });
    formData.checkIn = formatDate(startDate, 'DD/MM/YYYY HH:mm');
    formData.checkOut = formatDate(endDate, 'DD/MM/YYYY HH:mm');
  }
  refetchBookingSource.value();
};
const submitForm = (action: string) => {
  reservationFomRef.value?.validate().then((success: boolean) => {
    if (success) {
      $q.dialog({
        message:
          action === 'makeAReservation'
            ? t('are_you_sure_create_a_new_booking')
            : t('are_you_sure_create_and_check_in_a_new_booking'),
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
        const params = {
          roomTypeSn: formData.roomTypeSn,
          roomSn: formData.roomSn,
          bookingTypeSn: formData.bookingTypeSn,
          checkIn: Number(formatDate(createNewDate(formData.checkIn), 'X')),
          checkOut: Number(formatDate(createNewDate(formData.checkOut), 'X')),
          bookingSourceSn: formData.bookingSourceSn,
          extraFee: formData.extraFee,
          pricingPlanSn: formData.pricingPlanSn,
          guestSn:
            guestInputType.value === GUESTS_ACTIONS.AVAILABLE_GUEST ? formData.guestInfo?.sn : null,
          guestName:
            guestInputType.value === GUESTS_ACTIONS.AVAILABLE_GUEST
              ? formData.guestInfo?.fullName
              : formData.guestName,
          guestIdentity: formData.identityNumber,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          totalCharge: formData.totalCharge,
          depositMethodSn: formData.depositMethodSn, // change UI not to change BE
          amountDeposit: formData.amountDeposit,
          discount: formData.discount,
          note: formData.note,
          bookingStatusSn: action === 'makeAReservation' ? null : 2,
          useSuggestedPrice: formData.useSuggestedPrice,
        };
        createReservationMutation.mutate(params, {
          onSuccess: (data) => {
            if (data) {
              notifyCreateSuccess();
              emits('createSuccess');
            }
          },
        });
      });
    } else {
      return false;
    }
  });
};
const changeRoomType = (val: number | null) => {
  roomTypeSn.value = val;
  formData.roomSn = null;
};
const changeBookingType = () => {
  if (formData.bookingTypeSn !== 1) {
    const startDate = new Date();
    const endDate = addToDate(new Date(), { days: 1 });
    const startTime =
      formData.bookingTypeSn === 2
        ? policiesData.value?.startOvernight.split(':')
        : policiesData.value?.startDaily.split(':');
    const endTime =
      formData.bookingTypeSn === 2
        ? policiesData.value?.endOvernight.split(':')
        : policiesData.value?.endDaily.split(':');
    if (startTime) {
      startDate.setHours(Number(startTime[0]), Number(startTime[1]));
    }
    if (endTime) {
      endDate.setHours(Number(endTime[0]), Number(endTime[1]));
    }
    formData.checkIn = formatDate(startDate, 'DD/MM/YYYY HH:mm');
    formData.checkOut = formatDate(endDate, 'DD/MM/YYYY HH:mm');
  } else {
    const startDate = addToDate(new Date(), { hours: 1 });
    const endDate = addToDate(new Date(), { hours: 3 });
    formData.checkIn = formatDate(startDate, 'DD/MM/YYYY HH:mm');
    formData.checkOut = formatDate(endDate, 'DD/MM/YYYY HH:mm');
  }
  calculateBookingAmount();
};
const filterGuest = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    guestOptions.value = guestListData?.value?.filter(
      (element) => String(element?.fullName).indexOf(String(val)) > -1,
    );
  });
};
const clearGuestName = () => {
  formData.guestInfo = null;
  formData.identityNumber = '';
  formData.guestEmail = null;
  formData.guestPhone = '';
};
const changeGuestInfo = (val: IGuest) => {
  if (!formData.guestInfo) {
    return false;
  }
  formData.identityNumber = val.identityNumber;
  formData.guestEmail = val.email;
  formData.guestPhone = val.mobile;
};
const setKeySearchGuestModel = (val: string) => {
  keySearchGuest.value = val;
};
const handleHideDialog = () => {
  resetFormData();
};
const onChangeDate = () => {
  reservationFomRef.value?.validate().then((success: boolean) => {
    if (success) {
      calculateBookingAmount();
    } else {
      return false;
    }
  });
};
// defineExpose
defineExpose<IReservationDialog>({
  setupReservationDialog,
});
</script>
<template>
  <q-dialog v-model="dialogVisible" full-width full-height @hide="handleHideDialog">
    <q-card style="padding: 3px 0px 27px 27px" class="no-scroll custom-dialog-reservation">
      <q-bar class="bg-white q-mt-md q-mr-md q-pa-none">
        <div class="custom-title-dialog text-bold">{{ t('make_reservation') }}</div>
        <q-space />
        <q-btn v-close-popup dense flat icon="close"> </q-btn>
      </q-bar>
      <q-separator style="margin-top: 10px; margin-right: 27px" />
      <q-card-section
        class="q-pa-none q-pb-md scroll q-pr-md"
        style="height: calc(100% - 112px); padding-top: 11px"
      >
        <q-form ref="reservationFomRef">
          <div>
            <div class="text-bold q-mb-md text-body1" style="font-size: 16px">
              {{ t('room_information') }}
            </div>
            <div class="row items-center q-mb-sm">
              <div class="col col-md-6 col-sm-6 col-xs-12 q-pr-md">
                <p class="q-mb-xs">{{ t('room_type_name') }}*</p>
                <q-select
                  v-model="formData.roomTypeSn"
                  filled
                  dense
                  :options="roomTypeListData || []"
                  option-label="name"
                  option-value="sn"
                  :label="t('select_room_type')"
                  clearable
                  map-options
                  emit-value
                  :rules="[(val) => !!val || t('this_field_is_required')]"
                  @update:model-value="changeRoomType"
                >
                </q-select>
              </div>
              <div class="col col-md-6 col-sm-6 col-xs-12">
                <p class="q-mb-xs">{{ t('room_name') }}*</p>
                <q-select
                  v-model="formData.roomSn"
                  :loading="roomListFetching"
                  filled
                  dense
                  :label="t('select_room')"
                  clearable
                  map-options
                  :options="roomListData || []"
                  emit-value
                  option-label="name"
                  option-value="sn"
                  :rules="[(val) => !!val || t('this_field_is_required')]"
                />
              </div>
            </div>
            <div class="row items-center q-mb-sm">
              <div class="col col-md-6 col-sm-6 col-xs-12 q-pr-md">
                <p class="q-mb-xs">{{ t('booking_type') }}*</p>
                <q-select
                  v-model="formData.bookingTypeSn"
                  filled
                  dense
                  :options="bookingTypeOptions"
                  option-value="value"
                  option-label="label"
                  emit-value
                  :label="t('select_booking_type')"
                  clearable
                  map-options
                  behavior="menu"
                  lazy-rules
                  :rules="[(val) => !!val || t('this_field_is_required')]"
                  @update:model-value="changeBookingType"
                >
                </q-select>
              </div>
              <div class="col col-md-3 col-sm-6 col-xs-12 q-pr-md">
                <p class="q-mb-xs">{{ t('arrival_date_time') }}*</p>
                <q-input
                  v-model="formData.checkIn"
                  :placeholder="t('select_date_time')"
                  filled
                  dense
                  debounce="500"
                  :rules="checkInRules"
                  @update:model-value="onChangeDate"
                >
                  <template #prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="formData.checkIn"
                          :mask="FORMAT_DATE_TIME_UI"
                          :options="checkInOptions"
                          @update:model-value="onChangeDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template #append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time
                          v-model="formData.checkIn"
                          :mask="FORMAT_DATE_TIME_UI"
                          format24h
                          @blur="onChangeDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col col-md-3 col-sm-6 col-xs-12">
                <p class="q-mb-xs">{{ t('departure_date_time') }}*</p>
                <q-input
                  v-model="formData.checkOut"
                  :placeholder="t('select_date_time')"
                  filled
                  dense
                  debounce="500"
                  :rules="checkOutRules"
                  @update:model-value="onChangeDate"
                >
                  <template #prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date
                          v-model="formData.checkOut"
                          :mask="FORMAT_DATE_TIME_UI"
                          :options="checkOutOptions"
                          @update:model-value="onChangeDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template #append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time
                          v-model="formData.checkOut"
                          :mask="FORMAT_DATE_TIME_UI"
                          format24h
                          @blur="onChangeDate"
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row items-center q-mb-sm">
              <div class="col col-md-6 col-sm-12 col-xs-12">
                <q-toggle
                  v-model="formData.useSuggestedPrice"
                  :false-value="0"
                  :true-value="1"
                  color="negative"
                  @update:model-value="calculateBookingAmount"
                />
                <span class="text-bold" style="font-size: 16px">
                  {{ t('suggested_price_make') }}
                </span>
              </div>
              <div class="col col-md-6 col-sm-12 col-xs-12">
                <p class="q-mb-xs">{{ t('room_price') }}</p>
                <q-field
                  v-model.number="formData.roomPrice"
                  filled
                  dense
                  class="col custom-input q-field--with-bottom custom-input-readonly"
                  suffix="VND"
                  bg-color="orange-1"
                  label-color="negative"
                  debounce="500"
                  color="negative"
                  standout
                  readonly
                >
                  <template #control="{ id, floatingLabel, modelValue: modelRoomPrice, emitValue }">
                    <input
                      v-show="floatingLabel"
                      :id="id"
                      readonly
                      class="q-field__input text-right text-negative text-bold text-body1"
                      :value="formatMoney(modelRoomPrice)"
                      @change="(e) => changeMoney(e, modelRoomPrice, emitValue)"
                    />
                  </template>
                </q-field>
              </div>
            </div>
            <div v-if="!formData.useSuggestedPrice" class="col col-md-3 col-sm-6 col-xs-12 q-pr-md">
              <p class="q-mb-xs">{{ t('pricing_plan_name') }}</p>
              <q-input
                v-model="formData.pricingPlanName"
                dense
                class="col q-field--with-bottom custom-input-readonly"
                bg-color="grey-5"
                filled
                readonly
              >
              </q-input>
            </div>
            <div class="row items-center q-mb-sm">
              <div class="col col-md-6 col-sm-12 col-xs-12 q-pr-md">
                <p class="q-mb-xs">{{ t('booking_source_name') }}</p>
                <q-select
                  v-model="formData.bookingSourceSn"
                  filled
                  dense
                  :options="bookingSourceOptions"
                  option-value="sn"
                  option-label="name"
                  map-options
                  :label="t('select_source')"
                  clearable
                  emit-value
                  behavior="menu"
                  class="q-field--with-bottom"
                  :rules="bookingSourceRule"
                />
              </div>
              <div class="col col-md-6 col-sm-12 col-xs-12 q-pr-md">
                <p class="q-mb-xs">{{ t('extra_fee') }}</p>
                <q-field
                  v-model.number="formData.extraFee"
                  filled
                  dense
                  class="col"
                  suffix="VND"
                  debounce="500"
                  :rules="[
                    (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
                    (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
                  ]"
                  type="number"
                  @blur="inputActive.extraFee = false"
                  @focus="inputActive.extraFee = true"
                  @update:model-value="calculateBookingAmount"
                >
                  <template #control="{ id, floatingLabel, modelValue: modelExtra, emitValue }">
                    <input
                      v-show="floatingLabel"
                      :id="id"
                      class="q-field__input text-right"
                      :value="inputActive.extraFee ? modelExtra : formatMoney(modelExtra)"
                      @change="(e) => changeMoney(e, modelExtra, emitValue)"
                    />
                  </template>
                </q-field>
              </div>
            </div>
          </div>
          <q-separator />
          <div class="text-bold q-my-md" style="font-size: 16px">{{ t('guest_information') }}</div>
          <div class="q-pb-md q-ma-none">
            <div class="q-gutter-x-md">
              <q-radio
                v-model="guestInputType"
                dense
                val="Available guest"
                :label="t('available_guest')"
                color="negative"
                class="text-bold"
              />
              <q-radio
                v-model="guestInputType"
                dense
                :val="GUESTS_ACTIONS.NEW_GUEST"
                :label="t('new_guest')"
                color="negative"
                class="text-bold"
              />
            </div>
          </div>
          <div class="q-mb-md row items-center">
            <div class="col col-md-3 col-sm-6 col-xs-12 q-pr-md">
              <p class="q-mb-xs text-bold required">{{ t('guest_name') }}</p>
              <q-select
                v-if="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST"
                v-model="formData.guestInfo"
                filled
                dense
                fill-input
                use-input
                use-chips
                behavior="menu"
                hide-selected
                input-debounce="500"
                :options="guestListData"
                :placeholder="t('input_guest_name')"
                map-options
                option-label="fullName"
                option-value="sn"
                lazy-rules
                :rules="[(val) => !!val || t('this_field_is_required')]"
                @filter="filterGuest"
                @input-value="setKeySearchGuestModel"
                @update:model-value="changeGuestInfo"
              >
                <template v-if="formData.guestInfo" #append>
                  <q-icon
                    name="cancel"
                    class="cursor-pointer text-caption"
                    @click.stop="clearGuestName"
                  />
                </template>
              </q-select>
              <q-input
                v-else-if="guestInputType === GUESTS_ACTIONS.NEW_GUEST"
                v-model="formData.guestName"
                :placeholder="t('guest_make')"
                filled
                dense
                class="q-field--with-bottom"
                :rules="[
                  (val) => !val || val.length <= 50 || t('the_length_is_from_1_to_50_characters'),
                ]"
                @blur="changeGuestName"
              >
              </q-input>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12 q-pr-md">
              <p class="q-mb-xs text-bold">{{ t('identity_number') }}</p>
              <q-input
                v-model="formData.identityNumber"
                dense
                :placeholder="t('input_identity_number')"
                class="col q-field--with-bottom"
                :class="
                  guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? 'custom-input-readonly' : ''
                "
                filled
                type="number"
                :bg-color="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? 'grey-5' : ''"
                :readonly="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST"
                input-style="border: none;"
                :rules="[
                  (val) => !val || val.length >= 9 || t('the_length_is_from_9_to_15_characters'),
                  (val) => !val || val.length <= 15 || t('the_length_is_from_9_to_15_characters'),
                ]"
              >
              </q-input>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12 q-pr-md">
              <p class="q-mb-xs text-bold">{{ t('email') }}</p>
              <q-input
                v-model="formData.guestEmail"
                dense
                :placeholder="t('input_email')"
                class="col q-field--with-bottom"
                :class="
                  guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? 'custom-input-readonly' : ''
                "
                filled
                type="email"
                :rules="formData.guestEmail ? emailRules : []"
                :bg-color="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? 'grey-5' : ''"
                :readonly="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST"
              >
              </q-input>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              <p class="q-mb-xs text-bold">{{ t('phone') }}</p>
              <q-input
                v-model="formData.guestPhone"
                dense
                :placeholder="t('input_phone_number')"
                :class="
                  guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? 'custom-input-readonly' : ''
                "
                class="col q-field--with-bottom"
                filled
                type="number"
                :bg-color="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? 'grey-5' : ''"
                :readonly="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST"
                :rules="[
                  (val) => !val || val.length >= 8 || t('the_length_is_from_8_to_12_characters'),
                  (val) => !val || val.length <= 12 || t('the_length_is_from_8_to_12_characters'),
                ]"
              >
              </q-input>
            </div>
            <q-separator />
          </div>
          <q-separator />
          <div class="row justify-between items-center" style="padding: 11px 0">
            <div class="text-bold col q-mr-md" style="font-size: 16px">
              {{ t('total_charges') }}
            </div>
            <div class="text-bold col q-mr-md"></div>
            <div class="text-bold col q-mr-md"></div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              <q-field
                v-model.number="formData.totalCharge"
                filled
                dense
                class="col custom-input custom-input-readonly"
                suffix="VND"
                bg-color="orange-1"
                label-color="negative"
                debounce="500"
                color="negative"
                standout
                readonly
              >
                <template #control="{ id, floatingLabel, modelValue: modelTotalCharge, emitValue }">
                  <input
                    v-show="floatingLabel"
                    :id="id"
                    readonly
                    class="q-field__input text-right text-negative text-bold text-body1"
                    :value="formatMoney(modelTotalCharge)"
                    @change="(e) => changeMoney(e, modelTotalCharge, emitValue)"
                  />
                </template>
              </q-field>
            </div>
          </div>
          <q-separator />
          <div class="text-bold col q-mr-md" style="padding: 21px 0 12px 0; font-size: 16px">
            {{ t('deposit') }}
          </div>
          <div class="row justify-between items-center q-pb-md">
            <div class="col col-md-4 col-sm-6 col-xs-12">
              <p class="q-mb-xs text-bold">{{ t('deposit_method') }}</p>
              <q-select
                v-model="formData.depositMethodSn"
                class="col col-md-4 col-sm-6 col-xs-12 q-pr-md q-field--with-bottom"
                filled
                dense
                :options="DEPOSIT_METHOD_OPTIONS"
                option-label="label"
                option-value="value"
                :label="t('select_method')"
                clearable
                map-options
                emit-value
                behavior="menu"
              ></q-select>
            </div>
            <div class="col col-md-4 col-sm-6 col-xs-12">
              <p class="q-mb-xs text-bold">{{ t('amount') }}</p>
              <q-field
                v-model="formData.amountDeposit"
                filled
                dense
                class="col col-md-4 col-sm-6 col-xs-12 q-pr-md"
                suffix="VND"
                debounce="500"
                :rules="[
                  (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
                  (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
                ]"
                type="number"
                @blur="inputActive.amountDeposit = false"
                @focus="inputActive.amountDeposit = true"
                @update:model-value="calculateBookingAmount"
              >
                <template
                  #control="{ id, floatingLabel, modelValue: modelAmountDeposit, emitValue }"
                >
                  <input
                    v-show="floatingLabel"
                    :id="id"
                    class="q-field__input text-right"
                    :value="
                      inputActive.amountDeposit
                        ? modelAmountDeposit
                        : formatMoney(modelAmountDeposit)
                    "
                    @change="(e) => changeMoney(e, modelAmountDeposit, emitValue)"
                  />
                </template>
              </q-field>
            </div>
            <div class="col col-md-4 col-sm-6 col-xs-12">
              <p class="q-mb-xs text-bold">{{ t('discount') }}</p>
              <q-field
                v-model="formData.discount"
                filled
                dense
                :placeholder="t('input_discount')"
                behavior="menu"
                suffix="VND"
                debounce="500"
                :rules="[
                  (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
                  (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
                ]"
                type="number"
                @blur="inputActive.discount = false"
                @focus="inputActive.discount = true"
                @update:model-value="calculateBookingAmount"
              >
                <template #control="{ id, floatingLabel, modelValue: modelDiscount, emitValue }">
                  <input
                    v-show="floatingLabel"
                    :id="id"
                    class="q-field__input text-right"
                    :value="inputActive.discount ? modelDiscount : formatMoney(modelDiscount)"
                    @change="(e) => changeMoney(e, modelDiscount, emitValue)"
                  />
                </template>
              </q-field>
            </div>
          </div>
          <q-separator />
          <div class="row justify-between items-center" style="padding: 11px 0">
            <div class="text-bold col q-mr-md" style="font-size: 16px">{{ t('balance') }}</div>
            <div class="text-bold col q-mr-md"></div>
            <div class="text-bold col q-mr-md"></div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              <q-field
                v-model.number="formData.balance"
                filled
                dense
                class="col custom-input custom-input-readonly"
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
          <q-separator />
          <div class="col">
            <p class="q-mb-xs text-bold" style="padding: 21px 0 0 0; font-size: 16px">
              {{ t('note') }}
            </p>
            <q-input
              v-model="formData.note"
              filled
              dense
              :placeholder="t('input_note')"
              behavior="menu"
              :rules="[
                (val) => !val || val.length <= 200 || t('the_length_is_from_0_to_200_characters'),
              ]"
            ></q-input>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions
        align="right"
        class="bg-white text-teal text-right custom-padding-bottom q-mr-md"
      >
        <q-btn
          no-caps
          outline
          color="grey-8"
          class="custom-botton-modal"
          @click="submitForm('makeAReservation')"
        >
          {{ t('make_reservation') }}</q-btn
        >
        <q-btn
          no-caps
          color="negative"
          class="custom-botton-modal"
          @click="submitForm('quickCheckIn')"
          >{{ t('quick_check_in') }}</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
<style lang="scss" scoped>
.custom-dialog-reservation {
  width: 962px !important;
  .custom-title-dialog {
    font-size: 20px;
    font-weight: 600;
  }
  .custom-padding-bottom {
    padding-top: 14px;
  }
}
.custom-botton-modal {
  padding: 8px 20px;
  @media only screen and (max-width: 600px) {
    padding: 8px;
  }
}
.custom-input :deep(.q-field__suffix) {
  color: var(--q-negative);
  font-size: 16px;
  font-weight: 500;
}
.custom-input-readonly :deep(.q-field__control) {
  &::before {
    border: none;
  }
}
.custom-input-readonly :deep(.q-field__control-container) {
  overflow: hidden;
}
.q-separator--horizontal {
  display: block;
  height: 0.5px;
}
</style>
