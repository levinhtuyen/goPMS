<template>
  <q-dialog v-model="dialogVisible" full-width @hide="onDialogHide">
    <q-card>
      <q-toolbar class="q-pa-md">
        <q-toolbar-title>
          <div class="text-h6 text-weight-bold q-pa-md">{{ t('new_import_receipt') }}</div>
        </q-toolbar-title>
        <q-btn v-close-popup class="q-pa-md" flat round dense icon="close" />
      </q-toolbar>

      <div>
        <q-form
          ref="changeCreateImportStockRef"
          class="q-gutter-md q-pa-md"
          @submit.prevent.stop="onSubmit"
        >
          <q-card-section class="row">
            <div class="col-12 col-md-6 q-pr-md">
              <p class="text-weight-bold">
                {{ t('import_receipt_id') }}
              </p>
              <q-input
                ref="nameField"
                v-model="dataForm.receiptID"
                bg-color="grey-3"
                filled
                dense
                disable
              />
            </div>
            <div class="col-12 col-md-6">
              <p class="text-weight-bold">
                {{ t('import_date_time') }}
              </p>
              <q-input v-model="dataForm.receiptDateTime" bg-color="grey-3" dense disable filled>
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="dataForm.receiptDateTime" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-12">
              <p class="text-weight-bold">{{ t('note') }}</p>
              <q-input
                ref="note"
                v-model="dataForm.note"
                bg-color="grey-1"
                :placeholder="t('input_note')"
                filled
                autogrow
                :rules="noteRules"
                :error="noteErr"
              >
                <template #error>
                  <p>
                    {{ t('the_length_is_from_0_to_200_characters') }}
                  </p>
                </template>
              </q-input>
            </div>
            <div class="q-pt-md col-12">
              <div class="q-pa-md bg-grey-2">
                <div class="row col-12 col-md-12">
                  <div class="col-6 text-h7 text-weight-bold">
                    {{ t('import_stock') }}
                  </div>
                  <div class="col-sm-6 col-xs-12 text-h7 text-weight-bold">
                    <q-btn
                      outline
                      class="btn-fixed-width float-right"
                      color="negative"
                      no-caps
                      :label="t('add_new')"
                      icon="add_circle"
                      @click="addNewImportStock"
                    />
                  </div>
                </div>
                <div
                  v-for="(stock, index) in dataForm.importStockDetail"
                  :key="index"
                  class="row col-12 col-md-12"
                >
                  <ImportStock
                    :data-stock="stock"
                    :view="2"
                    :index="index"
                    @calculateAmoundStock="getCalculateAmoundStock"
                    @deleteImportStockView="deleteImportStock(index)"
                  />
                </div>
              </div>
            </div>
            <div class="col-12 q-pt-md col-md-12">
              <div class="row col-12 col-md-12">
                <div class="col-md-8 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                  <p class="text-h7 text-weight-bold">{{ t('total_price') }}</p>
                </div>
                <div class="col-md-4 col-sm-6 col-xs-12">
                  <div class="col-md-4 col-sm-6 col-xs-12">
                    <q-input
                      :model-value="formatMoney(dataForm.totalPrice)"
                      input-class="text-orange-10 text-weight-bold text-right"
                      bg-color="orange-1"
                      disable
                      filled
                      dense
                    >
                      <template #append>
                        <span class="text-orange-10 text-subtitle2 text-weight-bold">VND</span>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
          <div class="row col-12 col-md-12 justify-end q-pa-sm q-px-sm">
            <q-btn
              v-close-popup
              :label="t('cancel')"
              dense
              outline
              no-caps
              class="q-mr-md"
              color="grey-8"
              style="padding: 8px 20px"
            />
            <q-btn no-caps :label="t('save')" type="submit" color="negative" />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useCreateImportStockMutation } from '../api/useCreateImportStockMutation';
import { useCalculateImportStockMutaion } from '../api/useCalculateAmountImportStockQuery';
import ImportStock from './import-stock.vue';
import { useNotify } from '~/composable/useNotify';

import { formatMoney } from '~/composable/useFormat';
import type { QInput, ValidationRule } from 'quasar';
const { t } = useI18n();
const changeCreateImportStockRef = ref<HTMLFormElement>();
interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
  (e: 'changeSuccess'): void;
}
interface Props {
  modelValue: boolean;
}

// prop, emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
// mutation
const mutation = useCreateImportStockMutation();
const matationCalculate = useCalculateImportStockMutaion();
const { notifyUpdateSuccess } = useNotify();
// data
const dataForm = ref({
  receiptID: '' as string | undefined,
  receiptDateTime: '' as string | undefined,
  note: '' as string,
  sn: null as number | null,
  totalPrice: 0 as number,
  importStockDetail: [
    {
      categorySn: null as number | null,
      importPrice: 0 as number | null,
      productSn: null as number | null,
      productUnitName: '' as string,
      quantity: 1 as number | null,
      sn: null as number | null,
      total: 0 as number | null,
    },
  ],
});
const addNewImportStock = () => {
  dataForm.value?.importStockDetail.push({
    categorySn: null as number | null,
    importPrice: 0 as number | null,
    productSn: null as number | null,
    productUnitName: '' as string,
    quantity: 1 as number | null,
    sn: null as number | null,
    total: 0 as number | null,
  });
};

//computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val: boolean) {
    emits('update:modelValue', val);
  },
});
// Validation
const note = ref<QInput | null>(null);
const noteRules: ValidationRule<string>[] = [
  (value) => 200 > value?.length || t('the_length_is_from_0_to_200_characters'),
];
const noteErr = computed(() => dataForm?.value?.note?.length > 201);
// method
const deleteImportStock = (index: number) => {
  dataForm.value.importStockDetail.splice(index, 1);
  getCalculateAmoundStock();
};
const onDialogHide = () => {
  onCancel();
};
const onCancel = () => {
  dataForm.value = {
    receiptID: '' as string | undefined,
    receiptDateTime: '' as string | undefined,
    note: ' ' as string,
    sn: null as number | null,
    totalPrice: 0 as number,
    importStockDetail: [
      {
        categorySn: null as number | null,
        importPrice: 0 as number | null,
        productSn: null as number | null,
        productUnitName: '' as string,
        quantity: 1 as number | null,
        sn: null as number | null,
        total: 0 as number | null,
      },
    ],
  };
};
const onSubmit = () => {
  if (dataForm.value.note === null) {
    dataForm.value.note = '';
  }
  changeCreateImportStockRef.value?.validate().then((success: boolean) => {
    if (!success) {
      return false;
    } else {
      mutation.mutate(dataForm.value, {
        onSuccess: async () => {
          notifyUpdateSuccess();
          await setTimeout(() => {
            emits('close');
            dataForm.value = {
              receiptID: '',
              receiptDateTime: '',
              note: '',
              sn: null,
              totalPrice: 0,
              importStockDetail: [
                {
                  categorySn: null,
                  importPrice: 0,
                  productSn: null,
                  productUnitName: '',
                  quantity: 1,
                  sn: null,
                  total: 0,
                },
              ],
            };
          }, 900);
        },
      });
    }
  });
};
const getCalculateAmoundStock = () => {
  let checkNull = 0;
  dataForm.value.importStockDetail.map(function (itemService: any) {
    if (!itemService.categorySn || !itemService.productSn) {
      checkNull = 1;
    }
  });
  if (checkNull === 0) {
    const dataJson = {
      importStock: [...dataForm.value.importStockDetail],
    };

    matationCalculate.mutate(dataJson as any, {
      onSuccess: (response: any) => {
        dataForm.value.totalPrice = response.data.totalPrice;
        dataForm.value.importStockDetail = response.data.importStockList;
      },
    });
  } else {
    return;
  }
};
const setupCreateImportStockDialog = async () => {
  console.log('setup');
};
defineExpose({
  setupCreateImportStockDialog,
});
</script>
<style lang="sass" scoped>
.style-input-total
  background: #ffebee !important
  width: auto
  min-width: 0
  max-width: 100%
  border-radius: 4px 4px 0 0
  min-height: 20px
  line-height: 1
  color: red
  padding: 8px 12px 0
  backface-visibility: hidden
  height: 40px
  display: flex
  justify-content: right
  align-items: center
</style>
