<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { formatMoney, changeMoney } from '~/composable/useFormat';
import { date } from 'quasar';
import { useEditCashTransactionMutation } from '../apis/useEditCashTransactionMutation';
import { useCashTransactionDetailQuery } from '../apis/useCashTransactionDetailQuery';
import { useQuasar } from 'quasar';
import { useReceiptTypeQuery } from '../../cashiering/apis/useReceiptTypeQuery';
import type { ValidationRule } from 'quasar';
import { FORMAT_DATE_UI } from '~/constants';
import { useNotify } from '~/composable/useNotify';

// interface
interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
}
interface Props {
  modelValue: boolean;
}
const { notifyUpdateSuccess } = useNotify();
// prop, emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const qDateRef = ref<any>(null);
// data
const sn = ref(-1);
const pageType = ref(1);
const pageTypeLabel = ref('');
const categorySn = ref(1);

const inputActive = reactive({
  price: false,
});

const dataJson = reactive({
  cashieringReceiptTypeSn: 0,
  reason: '',
  dataDetail: [
    {
      description: '',
      amount: 0,
    },
  ],
  totalPrice: 0,
  id: '',
  dateTime: '',
  createBy: '',
});
const enabledCashTransactionQuery = computed(() => {
  return !!sn.value;
});
const $q = useQuasar();
// const $date = date.formatDate;
const editCashTransactionMutation = useEditCashTransactionMutation();
let {
  data: cashTransactionDetail,
  isFetching,
  refetch,
} = useCashTransactionDetailQuery(sn, {
  enabled: enabledCashTransactionQuery.value,
});
const { data: dataReceipt } = useReceiptTypeQuery();
const { subtractFromDate } = date;
const { t } = useI18n();
const labelHeader = ref('');
// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emits('update:modelValue', value);
  },
});
const setupPricingAddDialog = async (value: any) => {
  labelHeader.value = value.labelType === 1 ? 'cash_receipt' : 'cash_payment';
  pageType.value = value.pageType;
  pageTypeLabel.value = value.pageType ? 'edit_' : 'detail_';
  categorySn.value = value.categorySn ? value.categorySn : value.labelType;
  if (sn.value === value.sn) {
    refetch.value();
  }
  sn.value = value.sn;
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
// watch
watch(isFetching, () => {
  if (cashTransactionDetail?.value) {
    dataJson.cashieringReceiptTypeSn = JSON.parse(
      JSON.stringify(cashTransactionDetail?.value.cashieringReceiptTypeSn),
    );
    dataJson.reason = cashTransactionDetail?.value.reason
      ? JSON.parse(JSON.stringify(cashTransactionDetail?.value.reason))
      : '';
    dataJson.dataDetail = JSON.parse(JSON.stringify(cashTransactionDetail?.value.dataDetail));
    dataJson.totalPrice = JSON.parse(JSON.stringify(cashTransactionDetail?.value.totalPrice));
    dataJson.id = JSON.parse(JSON.stringify(cashTransactionDetail?.value.id));
    dataJson.dateTime = JSON.parse(JSON.stringify(cashTransactionDetail?.value.dateTime * 1000));
    dataJson.createBy = JSON.parse(JSON.stringify(cashTransactionDetail?.value.createBy));
  }
});
//method
const dateOptions = (date: string) => {
  return new Date(date) <= subtractFromDate(new Date(), { day: 0 });
};
const onSave = () => {
  $q.dialog({
    // title: t('confirm'),
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
    persistent: true,
  }).onOk(() => {
    editCashTransactionMutation.mutate(
      {
        sn: sn.value,
        categorySn: categorySn.value,
        cashieringReceiptTypeSn: dataJson.cashieringReceiptTypeSn,
        reason: dataJson.reason,
        dataDetail: dataJson.dataDetail,
        totalPrice: dataJson.totalPrice,
      },
      {
        onSuccess: (response) => {
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
const onChangeAmount = () => {
  let total = 0;
  dataJson.dataDetail.map((val: any) => (total += Number(val.amount)));
  dataJson.totalPrice = total;
};
const onRemoveDetail = (inx: number) => {
  dataJson.dataDetail.splice(inx, 1);
  onChangeAmount();
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
        {{ t(pageTypeLabel + labelHeader) }}
      </div>
      <q-form v-if="dataJson" @submit.prevent.stop="onSave">
        <q-card-section class="row q-mx-sm">
          <div class="col-12 col-sm-6 col-md-3">
            <p class="required text-bold q-ma-xs">{{ t(labelHeader + '_type') }}</p>
            <q-select
              v-model="dataJson.cashieringReceiptTypeSn"
              class="q-mr-md"
              :options="
                categorySn === 1 ? dataReceipt[0].receiptTypeList : dataReceipt[1].receiptTypeList
              "
              :label="t(labelHeader + '_type_placeholder')"
              :disable="!pageType"
              :bg-color="!pageType ? 'grey-4' : ''"
              dense
              outlined
              map-options
              clearable
              option-label="name"
              option-value="sn"
              emit-value
              :rules="[(val) => !!val || t('please_select_one_value')]"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <p class="text-bold q-ma-xs">{{ t(labelHeader + '_date_time') }}</p>
            <q-field
              v-model="dataJson.dateTime"
              :placeholder="t('select_date_time')"
              dense
              stack-label
              filled
              class="q-mr-md"
              disable
              bg-color="grey-4"
              @focus="onOpenDatePopUp"
            >
              <template #control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ date.formatDate(dataJson.dateTime, FORMAT_DATE_UI) }}
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
                    <q-date v-model="dataJson.dateTime" :options="dateOptions">
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
            <q-input v-model="dataJson.id" disable bg-color="grey-4" class="q-mr-md" dense filled />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <p class="text-bold q-ma-xs">{{ t('created_by') }}</p>
            <q-input v-model="dataJson.createBy" disable bg-color="grey-4" dense filled />
          </div>

          <div class="col-12 col-md-12">
            <p class="text-bold q-ma-xs">{{ t('reason') }}</p>
            <q-input
              v-model="dataJson.reason"
              dense
              filled
              :placeholder="t('reason_placeholder')"
              :disable="!pageType"
              :bg-color="!pageType ? 'grey-4' : ''"
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
                  v-if="pageType"
                  outline
                  no-caps
                  color="deep-orange-12"
                  class="bg-grey-1"
                  :label="t('add_new')"
                  icon="add_circle"
                  style="font-size: 12px"
                  @click="
                    dataJson.dataDetail.push({
                      description: '',
                      amount: 0,
                    })
                  "
                />
              </div>
            </div>

            <div v-for="(val, inx) in dataJson.dataDetail" :key="inx">
              <div class="row">
                <div class="col-12 col-sm-6 col-md-9 q-px-sm">
                  <p class="required q-my-xs text-bold">{{ t('description') }}</p>
                  <q-input
                    v-model="val.description"
                    :placeholder="t('input_description')"
                    :disable="!pageType"
                    :bg-color="!pageType ? 'grey-4' : ''"
                    dense
                    filled
                    :rules="descriptionRules"
                  />
                </div>

                <div class="col-12 col-sm-6 col-md-3 q-px-sm">
                  <p class="required q-my-xs text-bold">{{ t('amount') }}</p>
                  <div class="row">
                    <q-field
                      v-model.number="val.amount"
                      :disable="!pageType"
                      :bg-color="!pageType ? 'grey-4' : ''"
                      filled
                      dense
                      suffix="VND"
                      :class="
                        pageType
                          ? 'col-lg-10 col-md-10 col-sm-10 col-xs-10'
                          : 'col-lg-12 col-md-12 col-sm-12'
                      "
                      debounce="500"
                      :rules="amountRules"
                      @blur="inputActive.price = false"
                      @focus="inputActive.price = true"
                      @update:model-value="onChangeAmount()"
                    >
                      <template #control="{ id, floatingLabel, modelValue: amountVal, emitValue }">
                        <input
                          v-show="floatingLabel"
                          :id="id"
                          class="q-field__input text-right"
                          :value="inputActive.price ? amountVal : formatMoney(amountVal)"
                          @change="(e) => changeMoney(e, amountVal, emitValue)"
                        />
                      </template>
                    </q-field>
                    <q-btn
                      v-if="pageType"
                      class="col-md-2"
                      flat
                      round
                      color="dark"
                      icon="delete"
                      style="max-height: 10px"
                      :disable="dataJson.dataDetail?.length < 2"
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
          <div v-if="pageType" class="col-12 col-md-12 row justify-end">
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
            <q-btn type="submit" no-caps color="deep-orange-12" style="padding: 8px 20px">{{
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
