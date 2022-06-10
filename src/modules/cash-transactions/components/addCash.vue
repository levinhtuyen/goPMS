<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { formatMoney, changeMoney } from '~/composable/useFormat';
import { date } from 'quasar';
import {
  useCreateCashTransactionMutation,
  ICashTransactionMutationVariables,
} from '../apis/useCreateCashTransactionMutation';
import { useQuasar } from 'quasar';
import { useReceiptTypeQuery } from '../../cashiering/apis/useReceiptTypeQuery';
import type { ValidationRule } from 'quasar';
import { FORMAT_DATE_UI, FORMAT_DATE_PICKER } from '~/constants';
import { useNotify } from '~/composable/useNotify';

// interface
interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
}
interface Props {
  modelValue: boolean;
}
const { notifyCreateSuccess } = useNotify();
// prop, emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const qDateRef = ref<any>(null);
// data
const $q = useQuasar();
const now = ref<number>(Date.now());

const createCashTransactionMutation = useCreateCashTransactionMutation();
const { data: dataReceipt } = useReceiptTypeQuery();
const { subtractFromDate } = date;
const { t } = useI18n();
const labelHeader = ref('');
const dataJson = reactive<ICashTransactionMutationVariables>({
  categorySn: 1,
  cashieringReceiptTypeSn: null,
  date: null,
  reason: '',
  dataDetail: [
    {
      description: '',
      amount: 0,
    },
  ],
  totalPrice: 0,
});
const temp = reactive({
  createBy: '',
  id: '',
});

// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emits('update:modelValue', value);
  },
});

const datePicker = computed({
  get: () => {
    return date.formatDate(new Date(Number(dataJson.date) * 1000), FORMAT_DATE_PICKER);
  },
  set: (val: any) => {
    dataJson.date = Number(date.formatDate(new Date(val), 'X'));
  },
});

const setupPricingAddDialog = async (value: any) => {
  clearData();
  labelHeader.value = value.labelType;
  dataJson.categorySn = value.categorySn;
  dataJson.cashieringReceiptTypeSn = value.categorySn === 1 ? 1 : null;
};

const reasonRules: ValidationRule<string>[] = [
  (value) => 200 >= value.length || t('the_length_is_from_0_to_200_characters'),
];
const descriptionRules: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => 200 >= value?.length || t('the_length_is_from_0_to_200_characters'),
];
const amountRules: ValidationRule<number>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => (0 <= value && 100000000000 >= value) || t('the_value_is_from_1_to_100_000_000_000'),
];
//method
const dateOptions = (date: string) => {
  return new Date(date) <= subtractFromDate(new Date(), { day: 0 });
};
const onSave = () => {
  $q.dialog({
    title: '',
    message: t('confirm_new_' + labelHeader.value),
    cancel: {
      color: 'grey-8',
      label: t('cancel'),
      noCaps: true,
      align: 'center',
      dense: true,
      outline: true,
    },
    ok: {
      color: 'negative',
      label: t('confirm'),
      dense: true,
      noCaps: true,
      align: 'center',
    },
    persistent: true,
    position: 'standard',
  }).onOk(() => {
    const dataDetailFormat = dataJson.dataDetail.map((val) => ({
      description: val.description,
      amount: val.amount,
    }));
    createCashTransactionMutation.mutate(
      {
        categorySn: dataJson.categorySn,
        cashieringReceiptTypeSn: dataJson.cashieringReceiptTypeSn,
        date: dataJson.date,
        reason: dataJson.reason,
        dataDetail: dataDetailFormat,
        totalPrice: dataJson.totalPrice,
      },
      {
        onSuccess: (response) => {
          if (response?.code === 1) {
            notifyCreateSuccess();
            setTimeout(() => {
              emits('close');
            }, 400);
          }
        },
      },
    );
  });
};
const onChangeAmount = () => {
  let total = 0;
  dataJson.dataDetail.map((val: any) => (total += Number(val.amount)));
  dataJson.totalPrice = total;
};
const onRemoveDetail = (inx: number) => {
  dataJson.dataDetail.splice(inx, 1);
  onChangeAmount();
};
const clearData = () => {
  dataJson.date = Number(date.formatDate(now.value, 'X'));
  dataJson.reason = '';
  dataJson.totalPrice = 0;
  dataJson.dataDetail = [
    {
      description: '',
      amount: 0,
    },
  ];
};
const onOpenDatePopUp = () => {
  qDateRef?.value.show();
};
defineExpose({
  setupPricingAddDialog,
});
</script>

<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="width: 1360px; max-width: 80vw">
      <div class="text-bold q-mt-md q-mx-lg text-heading">
        {{ t('new_' + labelHeader) }}
      </div>
      <q-form @submit.prevent.stop="onSave">
        <q-card-section class="row q-mx-sm">
          <div class="col-12 col-sm-6 col-md-3">
            <p class="required text-bold q-ma-xs">{{ t(labelHeader + '_type') }}</p>
            <q-select
              v-model="dataJson.cashieringReceiptTypeSn"
              class="q-mr-md"
              :options="
                dataJson.categorySn === 1
                  ? dataReceipt[0].receiptTypeList
                  : dataReceipt[1].receiptTypeList
              "
              :label="t(labelHeader + '_type_placeholder')"
              clearable
              dense
              outlined
              map-options
              option-label="name"
              option-value="sn"
              emit-value
              :rules="[(val) => !!val || t('please_select_one_value')]"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <p class="text-bold q-ma-xs">{{ t(labelHeader + '_date') }}</p>
            <q-field
              placeholder="Select date time"
              dense
              stack-label
              outlined
              class="q-mr-md"
              @focus="onOpenDatePopUp"
            >
              <template #control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ date.formatDate(Number(dataJson.date) * 1000, FORMAT_DATE_UI) }}
                </div>
              </template>
              <template #prepend>
                <q-icon name="event" class="no-pointer-events">
                  <q-popup-proxy
                    ref="qDateRef"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="datePicker" :options="dateOptions">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-field>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <p class="text-bold q-ma-xs">{{ t(labelHeader + '_id') }}</p>
            <q-input v-model="temp.id" disable bg-color="grey-4" class="q-mr-md" dense filled />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <p class="text-bold q-ma-xs">{{ t('created_by') }}</p>
            <q-input v-model="temp.createBy" disable bg-color="grey-4" dense filled />
          </div>

          <div class="col-12 col-md-12">
            <p class="text-bold q-ma-xs">{{ t('reason') }}</p>
            <q-input
              v-model="dataJson.reason"
              :placeholder="t('reason_placeholder')"
              dense
              filled
              :rules="reasonRules"
              rows="2"
              type="textarea"
            />
          </div>

          <div class="bg-grey-2 col-12 col-md-12" style="max-height: 340px; overflow: auto">
            <div class="row q-mx-sm q-mt-sm">
              <div class="col-md-6 col-sm-6 col-xs-6 text-left">
                <p class="text-weight-700">{{ t('detail') }}</p>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-6 text-right">
                <q-btn
                  outline
                  no-caps
                  color="deep-orange-12"
                  class="bg-grey-1"
                  :label="$q.screen.gt.xs ? t('add_new') : void 0"
                  icon="add_circle"
                  style="font-size: 12px"
                  @click="
                    dataJson.dataDetail.push({
                      description: '',
                      amount: 0,
                      inputActive: false,
                    })
                  "
                />
              </div>
            </div>

            <div v-for="(val, inx) in dataJson.dataDetail" :key="inx">
              <div class="row">
                <div class="col-12 col-sm-6 col-md-9 q-px-sm">
                  <p class="required q-my-xs text-bold">
                    {{ t('description') }}
                  </p>
                  <q-input
                    v-model="val.description"
                    :placeholder="t('input_description')"
                    outlined
                    dense
                    :rules="descriptionRules"
                  />
                </div>
                <div class="col-12 col-sm-6 col-md-3 q-px-sm">
                  <p class="required q-my-xs text-bold">{{ t('amount') }}</p>
                  <div class="row">
                    <q-field
                      v-model.number="val.amount"
                      class="col-md-10"
                      outlined
                      dense
                      suffix="VND"
                      debounce="500"
                      :rules="amountRules"
                      @blur="val.inputActive = false"
                      @focus="val.inputActive = true"
                      @update:model-value="onChangeAmount()"
                    >
                      <template #control="{ id, floatingLabel, modelValue: amountVal, emitValue }">
                        <input
                          v-show="floatingLabel"
                          :id="id"
                          class="q-field__input text-right"
                          :value="val.inputActive ? amountVal : formatMoney(amountVal)"
                          @change="(e) => changeMoney(e, amountVal, emitValue)"
                        />
                      </template>
                    </q-field>

                    <q-btn
                      class="col-md-2"
                      flat
                      round
                      color="dark"
                      icon="delete"
                      style="max-height: 10px"
                      :disable="inx === 0"
                      @click="onRemoveDetail(inx)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-12 q-my-sm">
            <div class="row">
              <div class="col-12 col-md-9 col-sm-6 text-left">
                <p class="text-bold">{{ t('total_price') }}</p>
              </div>
              <div class="col-12 col-md-3 col-sm-6 text-right">
                <q-field
                  v-model.number="dataJson.totalPrice"
                  filled
                  color="primary"
                  dense
                  class="bg-deep-orange-2"
                  debounce="500"
                  disable
                >
                  <template #control="{ id, floatingLabel, modelValue: totalVal, emitValue }">
                    <input
                      v-show="floatingLabel"
                      :id="id"
                      class="q-field__input text-right text-bold text-deep-orange-9"
                      :value="formatMoney(totalVal)"
                      @change="(e) => changeMoney(e, totalVal, emitValue)"
                    />
                  </template>
                  <template #append>
                    <span style="font-size: 15px" class="text-deep-orange-9 text-bold">VND</span>
                  </template>
                </q-field>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-12 row justify-end">
            <q-btn
              v-close-popup
              class="q-mr-md"
              dense
              outline
              no-caps
              color="grey-8"
              style="padding: 8px 20px"
            >
              {{ t('cancel') }}
            </q-btn>
            <q-btn type="submit" no-caps color="negative" style="padding: 8px 20px">{{
              t('save')
            }}</q-btn>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<style lang="scss" scoped>
.q-field__suffix {
  color: $deep-orange-9;
  display: inline-block;
}

.text-weight-700 {
  font-weight: 700;
  font-size: 18px;
}

.text-heading {
  font-size: 20px;
}
</style>
