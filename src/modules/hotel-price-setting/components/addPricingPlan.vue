<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from '~/composable/useI18n';
import {
  useCreatePriceOfPricingPlanMutation,
  IPriceOfPricingPlanMutationVariables,
  IPriceOfTimeFrameMutationVariables,
} from '../apis/useCreatePricingMutation';
import { useRoomTypeQuery } from '~/apis/commons/useAppendixQuery';
import { QInput, useQuasar } from 'quasar';
import type { ValidationRule } from 'quasar';
import { formatMoney, changeMoney } from '~/composable/useFormat';
import { useNotify } from '~/composable/useNotify';

// interface
interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
}
const { notifyUpdateSuccess } = useNotify();
interface Props {
  modelValue: boolean;
}
interface IFormData {
  roomTypeSn: number;
  name: string;
}
// data
const $q = useQuasar();
const { t } = useI18n();
const formData: IFormData = reactive({
  roomTypeSn: 1,
  name: '',
});

const inputActive = reactive({
  price: false,
});

const setupPricingAddDialog = async (val: any) => {
  clearCol();
  timeFrame.value = 1;
  formData.roomTypeSn = val.sn;
};
const overnightFrame = ref('');
const dailyFrame = ref('');
const mutation = useCreatePriceOfPricingPlanMutation();
const { data: roomTypeData, isFetching } = useRoomTypeQuery({
  enabled: true,
});
const newHour = ref<IPriceOfTimeFrameMutationVariables[]>([]);
const newHourEarlyOv = ref<IPriceOfTimeFrameMutationVariables[]>([]);
const newHourLateOv = ref<IPriceOfTimeFrameMutationVariables[]>([]);
const newHourEarlyDl = ref<IPriceOfTimeFrameMutationVariables[]>([]);
const newHourLateDl = ref<IPriceOfTimeFrameMutationVariables[]>([]);
const timeArrFrame = ref<IPriceOfPricingPlanMutationVariables[]>([]);
const timeFrame = ref(1);
const roomTypeList = ref([]);
// prop, emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
// computed
const getLabelReset = computed(() => {
  let label;
  switch (timeFrame.value) {
    case 1:
      label = 'reset_hourly';
      break;
    case 2:
      label = 'reset_overnight';
      break;
    case 3:
      label = 'reset_daily';
      break;
    default:
      label = 'reset_hourly';
      break;
  }
  return label;
});
const framePrice = computed(() => {
  let label;
  switch (timeFrame.value) {
    case 2:
      label = 'overnight_price';
      break;
    case 3:
      label = 'daily_price';
      break;
    default:
      label = 'overnight_price';
      break;
  }
  return label;
});
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emits('update:modelValue', value);
  },
});
const nameRules: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => 50 >= value?.length || t('the_length_is_from_1_to_50_characters'),
];
const hourRules: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => (1 <= Number(value) && 24 >= Number(value)) || t('the_value_is_from_1_to_24'),
];
const moneyRules: ValidationRule<number>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => (0 <= value && 100000000000 >= value) || t('the_value_is_from_1_to_100_000_000_000'),
];
// watch
watch(isFetching, () => {
  if (!isFetching) return;
  roomTypeList.value = JSON.parse(JSON.stringify(roomTypeData.value));
});
// method
const onSave = () => {
  $q.dialog({
    // title: t('confirm'),
    message: t('are_you_sure_you_want_to_save_new_pricing_plan'),
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
    persistent: true,
  }).onOk(() => {
    timeArrFrame.value.splice(0, 1); // remove first index is empty
    overnightFrame.value &&
      timeArrFrame.value.push({
        bookingType: 2,
        price: overnightFrame.value,
      });
    dailyFrame.value &&
      timeArrFrame.value.push({
        bookingType: 3,
        price: dailyFrame.value,
      });
    const hour = newHour.value.map((val) => ({
      bookingType: val.bookingType,
      price: val.price,
      priceType: val.priceType,
      numberHour: val.numberHour,
    }));
    //
    const hourEarlyOv = newHourEarlyOv.value.map((val) => ({
      bookingType: val.bookingType,
      price: val.price,
      priceType: val.priceType,
      numberHour: val.numberHour,
    }));
    const hourLateOv = newHourLateOv.value.map((val) => ({
      bookingType: val.bookingType,
      price: val.price,
      priceType: val.priceType,
      numberHour: val.numberHour,
    }));
    const hourEarlyDl = newHourEarlyDl.value.map((val) => ({
      bookingType: val.bookingType,
      price: val.price,
      priceType: val.priceType,
      numberHour: val.numberHour,
    }));
    const hourLateDl = newHourLateDl.value.map((val) => ({
      bookingType: val.bookingType,
      price: val.price,
      priceType: val.priceType,
      numberHour: val.numberHour,
    }));
    // remove property inputActive
    mutation.mutate(
      {
        roomTypeSn: formData.roomTypeSn,
        name: formData.name,
        priceOfPricingPlan: timeArrFrame.value,
        priceOfTimeFrame: [...hour, ...hourEarlyOv, ...hourLateOv, ...hourEarlyDl, ...hourLateDl],
      },
      {
        onSuccess: (response) => {
          timeArrFrame.value = [];
          if (response?.code === 1) {
            notifyUpdateSuccess();
            setTimeout(() => {
              emits('close');
            }, 400);
          }
        },
      },
    );
  });
};
const onReset = (type: number) => {
  $q.dialog({
    // title: t('confirm'),
    message: t('on_' + getLabelReset.value),
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
    persistent: true,
  }).onOk(() => {
    switch (type) {
      case 1:
        newHour.value.splice(0, newHour.value.length);
        break;
      case 2:
        newHourEarlyOv.value.splice(0, newHourEarlyOv.value.length);
        newHourLateOv.value.splice(0, newHourLateOv.value.length);
        break;
      case 3:
        newHourEarlyDl.value.splice(0, newHourEarlyDl.value.length);
        newHourLateDl.value.splice(0, newHourLateDl.value.length);
        break;
    }
  });
};
const clearCol = () => {
  formData.name = '';
  overnightFrame.value = '';
  dailyFrame.value = '';
  timeArrFrame.value.splice(0, timeArrFrame.value.length);
  newHour.value.splice(0, newHour.value.length);
  newHourEarlyOv.value.splice(0, newHourEarlyOv.value.length);
  newHourLateOv.value.splice(0, newHourLateOv.value.length);
  newHourEarlyDl.value.splice(0, newHourEarlyDl.value.length);
  newHourLateDl.value.splice(0, newHourLateDl.value.length);
};
const isActiveTab = (val: any, timeFameType?: number) => {
  if (timeFameType === 1) {
    if (val > 0) return 'tab-active';
  } else {
    if (val > 0) return 'tab-active';
  }
  return '';
};
defineExpose({
  setupPricingAddDialog,
});
</script>

<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="padding: 0 20px 16px 20px; max-width: 1500px; width: 885px">
      <q-bar class="bg-white q-my-md q-mr-sm q-pa-none">
        <div class="text-h5 text-bold">{{ t('new_pricing_plan') }}</div>
        <q-space />
      </q-bar>
      <q-separator />
      <q-card-section class="q-pa-none q-py-lg">
        <q-form class="q-gutter-md" @submit.prevent.stop="onSave">
          <div class="row items-center">
            <div class="col q-mr-md">
              <p class="required text-weight-bold q-ma-none">{{ t('room_type') }}</p>
              <q-select
                v-model="formData.roomTypeSn"
                dense
                filled
                :options="roomTypeList"
                option-label="name"
                :label="t('select_room_type')"
                clearable
                option-value="sn"
                emit-value
                map-options
                :rules="[(val) => !!val || t('this_field_is_required')]"
              >
                <template #selected-item="scope">
                  <span class="ellipsis" style="width: 300px">
                    {{ scope.opt.name }}
                  </span>
                </template>
              </q-select>
            </div>
            <div class="col">
              <p class="required q-ma-none text-weight-bold">{{ t('pricing_plan_name') }}</p>
              <q-input
                v-model="formData.name"
                :placeholder="t('input_pricing_plan_name')"
                dense
                filled
                :rules="nameRules"
              />
            </div>
          </div>
          <div class="row full-height">
            <div class="col-md-6 column block">
              <p class="required q-ma-none text-weight-bold">{{ t('time_frame') }}</p>
              <q-tabs
                v-model="timeFrame"
                class="text-grey-7"
                dense
                active-color="negative"
                active-bg-color="deep-orange-2"
              >
                <q-tab
                  class="text-weight-bold"
                  :name="1"
                  :label="t('hourly')"
                  :class="isActiveTab(newHour?.length, 1)"
                />
                <q-tab
                  class="text-weight-bold"
                  :name="2"
                  :label="t('overnight')"
                  :class="isActiveTab(overnightFrame, 2)"
                />
                <q-tab
                  class="text-weight-bold"
                  :name="3"
                  :label="t('daily')"
                  :class="isActiveTab(dailyFrame, 2)"
                />
              </q-tabs>
            </div>
            <div class="col-md-6 text-right column block self-end">
              <q-btn
                class="text-weight-bold"
                flat
                no-caps
                :label="t(getLabelReset)"
                @click="onReset(timeFrame)"
              />
            </div>
            <div v-if="timeFrame === 2 || timeFrame === 3" class="col-md-6">
              <div class="row bg-grey-2 q-ma-sm q-pa-md">
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                  {{ t(framePrice) }}
                </div>
                <div class="col-lg-8 col-md-8 col-sm-8 text-left col-xs-8 text-right">
                  <q-field
                    v-if="timeFrame === 2"
                    v-model="overnightFrame"
                    filled
                    suffix="VND"
                    dense
                    class="col"
                    debounce="500"
                    type="number"
                    :rules="moneyRules"
                    @blur="inputActive.price = false"
                    @focus="inputActive.price = true"
                  >
                    <template #control="{ id, floatingLabel, modelValue: val, emitValue }">
                      <input
                        v-show="floatingLabel"
                        :id="id"
                        class="q-field__input text-right"
                        :value="inputActive.price ? val : formatMoney(val)"
                        @change="(e) => changeMoney(e, val, emitValue)"
                      />
                    </template>
                  </q-field>
                  <q-field
                    v-if="timeFrame === 3"
                    v-model.number="dailyFrame"
                    filled
                    suffix="VND"
                    dense
                    class="col"
                    debounce="500"
                    type="number"
                    :rules="moneyRules"
                    @blur="inputActive.price = false"
                    @focus="inputActive.price = true"
                  >
                    <template #control="{ id, floatingLabel, modelValue: priceHourVal, emitValue }">
                      <input
                        v-show="floatingLabel"
                        :id="id"
                        class="q-field__input text-right"
                        :value="inputActive.price ? priceHourVal : formatMoney(priceHourVal)"
                        @change="(e) => changeMoney(e, priceHourVal, emitValue)"
                      />
                    </template>
                  </q-field>
                </div>
              </div>
            </div>
          </div>
          <div>
            <q-tab-panels v-model="timeFrame">
              <q-tab-panel :name="1" class="scroll" style="height: 400px">
                <div class="row">
                  <div
                    v-for="(val, inx) in newHour"
                    :key="inx"
                    class="col-lg-6 col-md-6 col-sm-6 col-xs-12 column block"
                  >
                    <div class="row bg-grey-2 q-ma-xs text-left q-pa-sm">
                      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                        <q-input
                          v-model="val.numberHour"
                          outlined
                          dense
                          class="inline w-80 q-pb-md"
                          :rules="hourRules"
                        />
                        {{ t('hours') }}:
                      </div>
                      <div class="col-lg-8 col-md-8 col-sm-8 text-left col-xs-8 row">
                        <q-field
                          v-model.number="val.price"
                          filled
                          suffix="VND"
                          dense
                          class="col-lg-10 col-md-10 col-sm-10"
                          debounce="500"
                          :rules="moneyRules"
                          type="number"
                          @blur="val.inputActive = false"
                          @focus="val.inputActive = true"
                        >
                          <template
                            #control="{ id, floatingLabel, modelValue: priceHourVal, emitValue }"
                          >
                            <input
                              v-show="floatingLabel"
                              :id="id"
                              class="q-field__input text-right"
                              :value="val.inputActive ? priceHourVal : formatMoney(priceHourVal)"
                              @change="(e) => changeMoney(e, priceHourVal, emitValue)"
                            />
                          </template>
                        </q-field>
                        <q-btn
                          class="col-lg-2 col-md-2 col-sm-2"
                          flat
                          round
                          color="grey-6"
                          icon="delete"
                          style="max-height: 10px"
                          @click="newHour.splice(inx, 1)"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-mt-md">
                    <q-field
                      v-model.number="newHour.length"
                      dense
                      :rules="[
                        (val) =>
                          newHour.length !== 0 ||
                          !!overnightFrame ||
                          !!dailyFrame ||
                          t('validate_time_frame'),
                      ]"
                      color="white"
                    >
                      <q-btn
                        color="grey-4"
                        text-color="deep-orange"
                        no-caps
                        class="full-width q-mb-md text-weight-bold"
                        :label="$q.screen.gt.xs ? t('new_hour_price') : void 0"
                        icon="add_circle"
                        size="md"
                        @click="
                          newHour.push({
                            bookingType: 1,
                            priceType: 1,
                            numberHour: 1,
                            price: '0',
                            inputActive: false,
                          })
                        "
                      />
                    </q-field>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel :name="2" class="scroll" style="height: 400px">
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <p class="text-bold">{{ t('early_check_in') }}</p>
                    <div
                      v-for="(val, inx) in newHourEarlyOv"
                      :key="inx"
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                    >
                      <div class="row bg-grey-2 q-ma-xs text-left q-pa-sm">
                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                          <q-input
                            v-model="val.numberHour"
                            outlined
                            dense
                            class="inline w-80"
                            :rules="hourRules"
                          />
                          {{ t('hours') }}:
                        </div>
                        <div class="col-lg-8 col-md-8 col-sm-8 text-left col-xs-8 row">
                          <q-field
                            v-model.number="val.price"
                            filled
                            suffix="VND"
                            dense
                            class="col-lg-10 col-md-10 col-sm-10"
                            debounce="500"
                            :rules="moneyRules"
                            @blur="val.inputActive = false"
                            @focus="val.inputActive = true"
                          >
                            <template
                              #control="{ id, floatingLabel, modelValue: priceHourVal, emitValue }"
                            >
                              <input
                                v-show="floatingLabel"
                                :id="id"
                                class="q-field__input text-right"
                                :value="val.inputActive ? priceHourVal : formatMoney(priceHourVal)"
                                @change="(e) => changeMoney(e, priceHourVal, emitValue)"
                              />
                            </template>
                          </q-field>
                          <q-btn
                            class="col-lg-2 col-md-2 col-sm-2"
                            flat
                            round
                            color="grey-6"
                            icon="delete"
                            style="max-height: 10px"
                            @click="newHourEarlyOv.splice(inx, 1)"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="q-mt-md q-ma-sm">
                      <q-btn
                        color="grey-4"
                        text-color="deep-orange"
                        no-caps
                        :label="$q.screen.gt.xs ? t('new_hour_price') : void 0"
                        icon="add_circle"
                        size="md"
                        class="full-width text-weight-bold"
                        @click="
                          newHourEarlyOv.push({
                            bookingType: timeFrame,
                            priceType: 2,
                            numberHour: 1,
                            price: '0',
                            inputActive: false,
                          })
                        "
                      />
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <p class="text-bold">{{ t('late_check_out') }}</p>
                    <div
                      v-for="(val, inx) in newHourLateOv"
                      :key="inx"
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                    >
                      <div class="row bg-grey-2 q-ma-xs text-left q-pa-sm">
                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                          <q-input
                            v-model="val.numberHour"
                            outlined
                            dense
                            class="inline w-80"
                            :rules="hourRules"
                          />
                          {{ t('hours') }}:
                        </div>
                        <div class="col-lg-8 col-md-8 col-sm-8 text-left col-xs-8 row">
                          <q-field
                            v-model.number="val.price"
                            filled
                            suffix="VND"
                            dense
                            class="col-lg-10 col-md-10 col-sm-10"
                            debounce="500"
                            :rules="moneyRules"
                            @blur="val.inputActive = false"
                            @focus="val.inputActive = true"
                          >
                            <template
                              #control="{ id, floatingLabel, modelValue: priceHourVal, emitValue }"
                            >
                              <input
                                v-show="floatingLabel"
                                :id="id"
                                class="q-field__input text-right"
                                :value="val.inputActive ? priceHourVal : formatMoney(priceHourVal)"
                                @change="(e) => changeMoney(e, priceHourVal, emitValue)"
                              />
                            </template>
                          </q-field>
                          <q-btn
                            class="col-lg-2 col-md-2 col-sm-2"
                            flat
                            round
                            color="grey-6"
                            icon="delete"
                            style="max-height: 10px"
                            @click="newHourLateOv.splice(inx, 1)"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="q-mt-md q-ma-sm">
                      <q-btn
                        color="grey-4"
                        text-color="deep-orange"
                        no-caps
                        :label="$q.screen.gt.xs ? t('new_hour_price') : void 0"
                        icon="add_circle"
                        size="md"
                        class="full-width text-weight-bold"
                        @click="
                          newHourLateOv.push({
                            bookingType: timeFrame,
                            priceType: 3,
                            numberHour: 1,
                            price: '0',
                            inputActive: false,
                          })
                        "
                      />
                    </div>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel :name="3" class="scroll" style="height: 400px">
                <div class="row full-height">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <p class="text-bold">{{ t('early_check_in') }}</p>
                    <div
                      v-for="(val, inx) in newHourEarlyDl"
                      :key="inx"
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                    >
                      <div class="row bg-grey-2 q-ma-xs text-left q-pa-sm">
                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                          <q-input
                            v-model="val.numberHour"
                            outlined
                            dense
                            class="inline w-80"
                            :rules="hourRules"
                          />
                          {{ t('hours') }}:
                        </div>
                        <div class="col-lg-8 col-md-8 col-sm-8 text-left col-xs-8 row">
                          <q-field
                            v-model.number="val.price"
                            filled
                            suffix="VND"
                            dense
                            class="col-lg-10 col-md-10 col-sm-10"
                            debounce="500"
                            :rules="moneyRules"
                            @blur="val.inputActive = false"
                            @focus="val.inputActive = true"
                          >
                            <template
                              #control="{ id, floatingLabel, modelValue: priceHourVal, emitValue }"
                            >
                              <input
                                v-show="floatingLabel"
                                :id="id"
                                class="q-field__input text-right"
                                :value="val.inputActive ? priceHourVal : formatMoney(priceHourVal)"
                                @change="(e) => changeMoney(e, priceHourVal, emitValue)"
                              />
                            </template>
                          </q-field>
                          <q-btn
                            class="col-lg-2 col-md-2 col-sm-2"
                            flat
                            round
                            color="grey-6"
                            icon="delete"
                            style="max-height: 10px"
                            @click="newHourEarlyDl.splice(inx, 1)"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="q-mt-md q-ma-sm">
                      <q-btn
                        color="grey-4"
                        text-color="deep-orange"
                        no-caps
                        :label="$q.screen.gt.xs ? t('new_hour_price') : void 0"
                        icon="add_circle"
                        size="md"
                        class="full-width text-weight-bold"
                        @click="
                          newHourEarlyDl.push({
                            bookingType: timeFrame,
                            priceType: 2,
                            numberHour: 1,
                            price: '0',
                            inputActive: false,
                          })
                        "
                      />
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <p class="text-bold">{{ t('late_check_out') }}</p>
                    <div
                      v-for="(val, inx) in newHourLateDl"
                      :key="inx"
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
                    >
                      <div class="row bg-grey-2 q-ma-xs text-left q-pa-sm">
                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                          <q-input
                            v-model="val.numberHour"
                            outlined
                            dense
                            class="inline w-80"
                            :rules="hourRules"
                          />
                          {{ t('hours') }}:
                        </div>
                        <div class="col-lg-8 col-md-8 col-sm-8 text-left col-xs-8 row">
                          <q-field
                            v-model.number="val.price"
                            filled
                            suffix="VND"
                            dense
                            class="col-lg-10 col-md-10 col-sm-10"
                            debounce="500"
                            :rules="moneyRules"
                            @blur="val.inputActive = false"
                            @focus="val.inputActive = true"
                          >
                            <template
                              #control="{ id, floatingLabel, modelValue: priceHourVal, emitValue }"
                            >
                              <input
                                v-show="floatingLabel"
                                :id="id"
                                class="q-field__input text-right"
                                :value="val.inputActive ? priceHourVal : formatMoney(priceHourVal)"
                                @change="(e) => changeMoney(e, priceHourVal, emitValue)"
                              />
                            </template>
                          </q-field>
                          <q-btn
                            class="col-lg-2 col-md-2 col-sm-2"
                            flat
                            round
                            color="grey-6"
                            icon="delete"
                            style="max-height: 10px"
                            @click="newHourLateDl.splice(inx, 1)"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="q-mt-md q-ma-sm">
                      <q-btn
                        color="grey-4"
                        text-color="deep-orange"
                        no-caps
                        :label="$q.screen.gt.xs ? t('new_hour_price') : void 0"
                        icon="add_circle"
                        size="md"
                        class="full-width text-weight-bold"
                        @click="
                          newHourLateDl.push({
                            bookingType: timeFrame,
                            priceType: 3,
                            numberHour: 1,
                            price: '0',
                            inputActive: false,
                          })
                        "
                      />
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div class="bg-white text-teal text-right">
            <q-btn
              v-close-popup
              class="q-mr-md"
              dense
              no-caps
              outline
              color="grey-8"
              style="padding: 8px 20px"
            >
              {{ t('cancel') }}
            </q-btn>
            <q-btn type="submit" no-caps color="negative" style="padding: 8px 20px">{{
              t('save')
            }}</q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<style lang="scss" scoped>
.w-80 {
  max-width: 80px;
}
.w-120 {
  max-width: 120px;
}
.tab-active {
  background-color: $deep-orange-2;
  color: $deep-orange-9;
  font-weight: 500;
  &::after {
    content: '✔';
    margin-left: 4px;
  }
}
</style>
