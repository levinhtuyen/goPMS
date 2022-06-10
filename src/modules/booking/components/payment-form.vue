<script setup lang="ts">
// interface IEmits {
//   (e: 'update:modelValue', value: boolean): void;
import { IPayment, IRoomInformation } from '../booking-details/apis/useBookingDetailQuery';
import { toRef, reactive, computed } from 'vue';
import { useCalculateBookingAmountMutation } from '../room-view/apis/useCalculateBookingAmountMutation';
// import { DEPOSIT_METHOD_OPTIONS } from '../room-view/const';
import { formatMoney, changeMoney } from '~/composable/useFormat';
import { useI18n } from '~/composable/useI18n';
// import { FORMAT_DATE_TIME_PICKER } from '~/constants';
// interface
interface IProps {
  data: IPayment;
  formRoomInfo: IRoomInformation;
  page: string;
  isDisplayEarlyCheckIn: boolean;
}
// data
const { t } = useI18n();
const inputActive = reactive({
  extraFee: false,
  amountPaid: false,
  discount: false,
});
// const TODAY = date.formatDate(new Date(), 'DD/MM/YYYY HH:mm');
// const reformatDate = (viVNDate = TODAY) => {
//   const [time, hour] = viVNDate.split(' ');
//   const [day, month, year] = time.split('/');
//   return `${year}-${month}-${day} ${hour}`;
// };
const props = defineProps<IProps>();
const formPayment = toRef(props, 'data');
// vue-query
const calculateBookingAmountMutaion = useCalculateBookingAmountMutation();
const calculateBookingAmount = () => {
  const params = {
    pricingPlanSn: props.formRoomInfo.pricingPlanSn,
    bookingType: props.formRoomInfo.bookingTypeSn,
    checkinDateTime: Number(
      props.formRoomInfo.checkInActual
        ? props.formRoomInfo.checkInActual
        : props.formRoomInfo.checkIn,
    ),
    checkoutDateTime: Number(props.formRoomInfo.checkOut),
    discount: formPayment.value.discount || 0,
    extraFee: formPayment.value.extraFee || 0,
    amountDeposit: formPayment.value.amountDeposit || 0,
  };

  calculateBookingAmountMutaion.mutate(params, {
    onSuccess: (data) => {
      formPayment.value.amountRoomPrice = data.roomPrice;
      formPayment.value.total = data.totalCharge;
      formPayment.value.balance = data.balance;
      formPayment.value.paid = data.amountDeposit;
    },
  });
};
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
const checkShowTextDepositMethod = (sn: number | null) => {
  if (!sn) {
    return;
  }
  switch (sn) {
    case null:
      return '';
    case 1:
      return '(Cash)';
    case 2:
      return '(Credit card)';
    case 3:
      return '(Bank transfer)';
    case 4:
      return '(Debt)';
    default:
      return '';
  }
};
// watch
// methods
</script>
<template>
  <q-form>
    <div class="row items-start justify-between">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-sm q-mr-lg">
        <div>
          <p class="q-mb-xs text-weight-bold">{{ t('room_price') }}</p>
          <q-field
            v-model.number="formPayment.amountRoomPrice"
            filled
            dense
            suffix="VND"
            :prefix="formPayment.roomPrice"
            bg-color="grey-5"
            input-class="text-right"
            readonly
            class="custom-input-readonly"
          >
            <template #control="{ id, floatingLabel, modelValue: modelBalance, emitValue }">
              <input
                v-show="floatingLabel"
                :id="id"
                readonly
                class="q-field__input text-right text-grey-10"
                :value="formatMoney(modelBalance)"
                @change="(e) => changeMoney(e, modelBalance, emitValue)"
              />
            </template>
          </q-field>
        </div>
        <div>
          <p class="q-mb-xs text-weight-bold">{{ t('early_check_in_label') }}</p>
          <q-field
            v-model.number="formPayment.amountEarlyCheckIn"
            filled
            dense
            suffix="VND"
            :prefix="formPayment.earlyCheckIn"
            :bg-color="isDisplayEarlyCheckIn ? '' : 'grey-5'"
            input-class="text-right"
            readonly
            class="custom-input-readonly"
          >
            <template #control="{ id, floatingLabel, modelValue: modelBalance, emitValue }">
              <input
                v-show="floatingLabel"
                :id="id"
                readonly
                class="q-field__input text-right text-grey-10"
                :value="formatMoney(modelBalance)"
                @change="(e) => changeMoney(e, modelBalance, emitValue)"
              />
            </template>
          </q-field>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <p class="q-mb-xs text-weight-bold">{{ t('lately_check_out_label') }}</p>
          <q-field
            v-model.number="formPayment.amountLateCheckOut"
            filled
            dense
            suffix="VND"
            :prefix="formPayment.lateCheckOut"
            bg-color="grey-5"
            input-class="text-right"
            readonly
            class="custom-input-readonly"
          >
            <template #control="{ id, floatingLabel, modelValue: modelBalance, emitValue }">
              <input
                v-show="floatingLabel"
                :id="id"
                class="q-field__input text-right text-grey-10"
                :value="formatMoney(modelBalance)"
                readonly
                @change="(e) => changeMoney(e, modelBalance, emitValue)"
              />
            </template>
          </q-field>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <p class="q-mb-xs text-weight-bold">{{ t('extra_fee') }}</p>
          <q-field
            v-model.number="formPayment.extraFee"
            filled
            dense
            class="col"
            suffix="VND"
            debounce="500"
            :rules="[
              (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
              (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
            ]"
            :bg-color="props.page === 'details' ? 'grey-5' : ''"
            :readonly="props.page === 'details'"
            type="number"
            :class="props.page === 'details' ? 'custom-input-readonly' : ''"
            @blur="inputActive.extraFee = false"
            @focus="inputActive.extraFee = true"
            @update:model-value="calculateBookingAmount"
          >
            <template #control="{ id, modelValue: modelExtra, emitValue }">
              <input
                :id="id"
                class="q-field__input text-right"
                :readonly="props.page === 'details'"
                :value="inputActive.extraFee ? modelExtra : formatMoney(modelExtra)"
                @change="(e) => changeMoney(e, modelExtra, emitValue)"
              />
            </template>
          </q-field>
        </div>
        <div class="row items-center">
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 style-pr-res">
            <p class="q-mb-xs text-weight-bold">{{ t('deposit_method') }}</p>
            <q-select
              v-model="formPayment.depositMethodSn"
              filled
              :options="DEPOSIT_METHOD_OPTIONS"
              behavior="menu"
              dense
              option-label="label"
              debounce="500"
              option-value="value"
              class="q-field--with-bottom"
              :label="t('select_method')"
              clearable
              map-options
              emit-value
              :readonly="props.page === 'details'"
              :bg-color="props.page === 'details' ? 'grey-5' : ''"
              :class="props.page === 'details' ? 'custom-input-readonly' : ''"
            >
            </q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <p class="q-mb-xs text-weight-bold">{{ t('deposit_amount') }}</p>
            <q-field
              v-model.number="formPayment.amountDeposit"
              filled
              dense
              class="col"
              suffix="VND"
              debounce="500"
              :rules="[
                (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
                (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
              ]"
              :readonly="props.page === 'details'"
              :bg-color="props.page === 'details' ? 'grey-5' : ''"
              type="number"
              :class="props.page === 'details' ? 'custom-input-readonly' : ''"
              @blur="inputActive.amountPaid = false"
              @focus="inputActive.amountPaid = true"
              @update:model-value="calculateBookingAmount"
            >
              <template #control="{ id, modelValue: modelAmountPayment, emitValue }">
                <input
                  :id="id"
                  class="q-field__input text-right"
                  :value="
                    inputActive.amountPaid ? modelAmountPayment : formatMoney(modelAmountPayment)
                  "
                  :readonly="props.page === 'details'"
                  @change="(e) => changeMoney(e, modelAmountPayment, emitValue)"
                />
              </template>
            </q-field>
          </div>
        </div>
        <div class="col">
          <p class="q-mb-xs text-weight-bold">{{ t('discount') }}</p>
          <q-field
            v-model.number="formPayment.discount"
            filled
            dense
            class="col"
            suffix="VND"
            debounce="500"
            type="number"
            :readonly="props.page === 'details'"
            :bg-color="props.page === 'details' ? 'grey-5' : ''"
            :class="props.page === 'details' ? 'custom-input-readonly' : ''"
            :rules="[
              (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
              (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
            ]"
            @blur="inputActive.discount = false"
            @focus="inputActive.discount = true"
            @update:model-value="calculateBookingAmount"
          >
            <template #control="{ id, modelValue: modelDiscount, emitValue }">
              <input
                :id="id"
                :readonly="props.page === 'details'"
                class="q-field__input text-right"
                :value="inputActive.discount ? modelDiscount : formatMoney(modelDiscount)"
                @change="(e) => changeMoney(e, modelDiscount, emitValue)"
              />
            </template>
          </q-field>
        </div>
      </div>
      <q-separator class="q-mr-lg" vertical />
      <div class="col">
        <div class="bg-grey-2 q-px-lg q-py-md rounded-borders">
          <div class="row items-center justify-between">
            <p class="text-weight-bold">{{ t('total') }}</p>
            <p>{{ formatMoney(formPayment.total) }} <span class="q-ml-xs">VND</span></p>
          </div>
          <div class="row items-center justify-between">
            <p class="text-weight-bold">{{ t('services_price') }}</p>
            <p>{{ formatMoney(formPayment.servicesPrice) }} <span class="q-ml-xs">VND</span></p>
          </div>
          <div class="row items-center justify-between">
            <p class="text-weight-bold">{{ t('deposit') }}</p>
            <p>{{ formatMoney(formPayment.amountDeposit) }} <span class="q-ml-xs">VND</span></p>
          </div>
          <div class="row items-center justify-between">
            <p class="q-ma-none text-weight-bold">{{ t('discount') }}</p>
            <p class="q-ma-none">
              {{ formatMoney(formPayment.discount) }} <span class="q-ml-xs">VND</span>
            </p>
          </div>
        </div>
        <div
          class="row bg-orange-1 text-negative text-h6 q-mt-md items-center justify-between q-px-lg q-py-md rounded-borders"
        >
          <p class="q-ma-none">
            <span class="text-bold q-ma-none text-weight-bold">{{ t('balance') }}</span>
            <span class="text-color q-ma-none">
              {{ checkShowTextDepositMethod(formPayment.paymentMethodSn) }}</span
            >
          </p>
          <p class="q-ma-none">
            {{ formatMoney(formPayment.balance) }} <span class="q-ml-xs">VND</span>
          </p>
        </div>
      </div>
    </div>
  </q-form>
</template>
<style lang="scss" scoped>
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
.text-color {
  color: $grey-10;
}
.style-pr-res {
  padding-right: 0px;
  @media screen and (min-width: $breakpoint-sm-min) {
    padding-right: 8px;
  }
}
</style>
