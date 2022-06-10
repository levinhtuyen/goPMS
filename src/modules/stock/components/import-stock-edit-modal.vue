<template>
  <q-dialog v-model="dialogVisible" full-width @hide="onDialogHide">
    <q-card class="view-form">
      <q-toolbar class="q-pa-md">
        <q-toolbar-title>
          <div class="text-h6 text-weight-bold q-pa-md">{{ t('edit_import_stock') }}</div>
        </q-toolbar-title>
        <q-btn v-close-popup class="q-pa-md" flat round dense icon="close" />
      </q-toolbar>
      <div>
        <div v-if="isLoadingImportStockById" class="wrapper q-pa-md">
          <q-inner-loading
            :showing="isLoadingImportStockById"
            label="Please wait..."
            lab55el-class="text-teal"
            label-style="font-size: 1.1em"
          />
        </div>
        <q-form
          v-else
          ref="editImportStockRef"
          class="q-gutter-md q-pa-md"
          @submit.prevent.stop="onSubmit"
        >
          <q-card-section class="row">
            <div class="col-md-6 col-sm-6 col-xs-12">
              <p class="text-weight-bold">
                {{ t('import_receipt_id') }}
              </p>
              <q-input
                ref="nameField"
                v-model="dataImportStockDetail.importStock.receiptId"
                filled
                disable
                dense
                bg-color="grey-3"
                :placeholder="t('import_receipt_id')"
                lazy-rules
                :rules="nameRules"
              />
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12 responsive-padding-block">
              <p class="text-weight-bold">
                {{ t('import_date_time') }}
              </p>
              <q-input
                :model-value="
                  date.formatDate(
                    dataImportStockDetail.importStock.importDate * 1000,
                    FORMAT_DATE_TIME_UI,
                  )
                "
                disable
                bg-color="grey-3"
                dense
                filled
              >
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date
                        :model-value="dataImportStockDetail.importStock.importDate"
                        mask="YYYY-MM-DD HH:mm"
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-sm-12 col-xs-12">
              <p class="text-weight-bold">{{ t('note') }}</p>
              <q-input
                ref="note"
                v-model="dataImportStockDetail.importStock.note"
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
                      :label="t('add_new')"
                      icon="add_circle"
                      @click="addNewImportStock"
                    />
                  </div>
                </div>
                <div
                  v-for="(stock, index) in dataImportStockDetail.importStockDetailList"
                  :key="index"
                  class="row col-12 col-md-12"
                >
                  <ImportStock
                    :data-stock="stock"
                    :view="0"
                    :index="index"
                    @calculateAmoundStock="getCalculateAmoundStock"
                    @deleteImportStockView="deleteImportStock(index, stock.sn)"
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
                  <q-input
                    :model-value="formatMoney(dataImportStockDetail.importStock.totalPrice)"
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
          </q-card-section>
          <div class="col-12 col-md-12 custome-btn">
            <q-btn
              v-close-popup
              :label="t('cancel')"
              dense
              outline
              no-caps
              color="grey-8"
              style="padding: 8px 20px"
            />
            <q-btn :label="t('save')" type="submit" color="negative" />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useImportStockByIdQuery } from '../import/api/getImportStockById';
// import { useProductMutation } from '../api/useProductMutation';
import type { QInput, ValidationRule } from 'quasar';
import { formatMoney } from '~/composable/useFormat';
import { useQuasar } from 'quasar';
// category service
import { useDeleteImportStockMutation } from '../import/api/useDeleteImportStockFormMutation';
import { useUpdateImportStockMutation } from '../import/api/useUpdateImportStockMutation';
import { useCalculateImportStockMutaion } from '../import/api/useCalculateAmountImportStockQuery';
import ImportStock from '../import/components/import-stock.vue';
import { FORMAT_DATE_TIME_UI } from '~/constants';
import { date } from 'quasar';
import { useNotify } from '~/composable/useNotify';

const $q = useQuasar();
const { t } = useI18n();
// const $q = useQuasar();
interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
}
const editImportStockRef = ref<HTMLFormElement>();
const emits = defineEmits<Emits>();
const props = defineProps({
  modelValue: { type: Boolean, require: true },
});
// data
const stockSn = ref(-1);
// const enabledImportStockQuery = computed(() => {
//   return !!stockSn.value;
// });
const { notifyUpdateSuccess } = useNotify();
const mutationUpdateImportStock = useUpdateImportStockMutation();
const mutationDeleteImportStockSn = useDeleteImportStockMutation();
const matationCalculate = useCalculateImportStockMutaion();
const setupEditImportStockDialog = async (sn: number) => {
  stockSn.value = sn;
  refetchImportStock.value();
};
defineExpose({
  setupEditImportStockDialog,
});
const {
  data: dataImportStock,
  isLoading: isLoadingImportStockById,
  refetch: refetchImportStock,
} = useImportStockByIdQuery({
  stockSn: stockSn,
  isDelete: 0,
});
// dataImportStockDetail.value = dataImportStock.value;
const dataImportStockDetail = ref<any>({});
watch(dataImportStock, () => {
  dataImportStockDetail.value = dataImportStock.value;
  if (dataImportStockDetail?.value?.importStock?.note === null) {
    dataImportStockDetail.value.importStock.note = ' ';
  }
});

dataImportStockDetail.value = computed(() => {
  return dataImportStock.value;
});
// method
const addNewImportStock = () => {
  dataImportStockDetail.value?.importStockDetailList.push({
    categorySn: null,
    productSn: null,
    unit: '',
    quantity: 1,
    importPrice: 0,
    total: 0,
  });
};

const deleteImportStock = (index: number, sn: number) => {
  if (!sn) {
    dataImportStockDetail.value.importStockDetailList.splice(index, 1);
    getCalculateAmoundStock();
    return;
  }
  $q.dialog({
    message: t('are_you_sure_delete_this_row'),
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
  })
    .onOk(() => {
      // todo
      let data = {
        importStockDetailSn: sn,
      };
      mutationDeleteImportStockSn.mutate(data as any, {
        onSuccess: async (response: any) => {
          if (response?.code === 1) {
            notifyUpdateSuccess();
            refetchImportStock.value();
          }
          refetchImportStock.value();
        },
      });
    })
    .onCancel(() => {
      // todo
      $q.notify({
        message: t('cancel'),
        position: 'top',
        type: 'negative',
        actions: [{ color: 'white' }],
      });
    });
  refetchImportStock.value();
};
const getCalculateAmoundStock = () => {
  let checkNull = 0;
  dataImportStockDetail.value.importStockDetailList.map(function (itemService: any) {
    if (!itemService.categorySn || !itemService.productSn) {
      checkNull = 1;
    }
  });
  if (checkNull === 0) {
    const dataJson = {
      importStock: [...dataImportStockDetail.value.importStockDetailList],
    };
    dataJson.importStock.forEach((val: any) => {
      val.importPrice = Number(val.importPrice);
      val.total = Number(val.total);
    });
    if (dataImportStockDetail.value.importStockDetailList.length > 0) {
      matationCalculate.mutate(dataJson as any, {
        onSuccess: (response: any) => {
          dataImportStockDetail.value.importStock.totalPrice = response.data.totalPrice
            ? response.data.totalPrice
            : 0;
          dataImportStockDetail.value.importStockDetailList = response.data.importStockList;
        },
      });
    } else {
      dataImportStockDetail.value.importStock.totalPrice = 0;
    }
  } else {
    return;
  }
};
const nameField = ref<QInput | null>(null);
const nameRules: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) =>
    (value?.length >= 1 && value?.length < 51) || t('the_length_is_from_1_to_50_characters'),
];
// Validation
const note = ref<QInput | null>(null);
const noteRules: ValidationRule<string>[] = [
  (value) => value !== null || t('the_length_is_from_0_to_200_characters'),
  (value) => 200 > value?.length || t('the_length_is_from_0_to_200_characters'),
];
const noteErr = computed(() => dataImportStockDetail?.value?.importStock?.note?.length > 200);
// handle category and product

// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val: boolean) {
    emits('update:modelValue', val);
  },
});
const onSubmit = () => {
  editImportStockRef.value?.validate().then((success: boolean) => {
    if (!success) {
      return false;
    } else {
      const dataJson = {
        importStockSn: dataImportStockDetail.value.importStock.sn,
        note: dataImportStockDetail.value.importStock.note,
        totalPrice: dataImportStockDetail.value.importStock.totalPrice,
        importStockDetail: [...dataImportStockDetail.value.importStockDetailList],
      };
      mutationUpdateImportStock.mutate(dataJson as any, {
        onSuccess: (response: any) => {
          if (response?.code === 1) {
            notifyUpdateSuccess();
            setTimeout(() => {
              emits('close');
            }, 800);
          } else if (response?.code === 2) {
            const err = response?.error;
            err.forEach(
              (val: {
                message: string | undefined;
                [key: string]: string | object | undefined;
              }) => {
                $q.notify({
                  message: val.message,
                  position: 'top',
                  type: 'negative',
                  actions: [{ color: 'white' }],
                });
              },
            );
          }
          //
        },
      });
    }
  });
};
const onDialogHide = () => {
  onCancel();
};
const onCancel = () => {
  dataImportStockDetail.value = dataImportStock.value || '[]';
};
// watch
</script>

<style lang="scss" scoped>
.responsive-padding-block {
  padding: 0;
  @media screen and (min-width: $breakpoint-md-min) {
    padding-left: 12px;
  }
}
</style>
<style lang="sass" scoped>

.text-weight-bold
  margin: 0
.skeleton
  margin: 10px 0
.hight-block-loading
  min-height: 40vh
.custome-btn
  display: flex
  align-items: center
  gap: 1em
  justify-content: end
  padding: 0.5em

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
