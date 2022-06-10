<template>
  <q-dialog v-model="dialogVisible" full-width>
    <q-card class="view-form">
      <q-toolbar class="q-pa-md">
        <q-toolbar-title>
          <div class="text-h6 q-ma-none q-pa-md text-weight-bold">
            {{ t('import_receipt_detail') }}
          </div>
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
        <form v-else class="q-gutter-md q-pa-md">
          <q-card-section class="row">
            <div class="col-12 col-md-6 q-pr-md">
              <p class="q-ma-none text-weight-bold">
                {{ t('import_receipt_id') }}
              </p>
              <q-input
                ref="nameField"
                v-model="dataImportStockDetail.importStock.receiptId"
                filled
                disable
                dense
                :placeholder="t('import_receipt_id')"
                lazy-rules
                :rules="nameRules"
              />
            </div>
            <div class="col-12 col-md-6">
              <p class="q-ma-none text-weight-bold">
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
                dense
                filled
              >
                <template #prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date
                        :model-value="
                          date.formatDate(
                            dataImportStockDetail.importStock.importDate * 1000,
                            FORMAT_DATE_TIME_UI,
                          )
                        "
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
            <div class="col-12 col-md-12">
              <p class="q-ma-none text-weight-bold">{{ t('note') }}</p>
              <q-input v-model="dataImportStockDetail.importStock.note" disable filled autogrow>
              </q-input>
            </div>
            <div class="q-pt-md col-12">
              <div class="q-pa-md bg-grey-2">
                <div class="row col-12 col-md-12">
                  <div class="col-6 text-h7 q-ma-none text-weight-bold">
                    {{ t('import_stock') }}
                  </div>
                </div>
                <div
                  v-for="(stock, index) in dataImportStockDetail.importStockDetailList"
                  :key="index"
                  class="row col-12 col-md-12"
                >
                  <ImportStock :index="index" :data-stock="stock" :view="1" />
                </div>
              </div>
            </div>
            <div class="col-12 q-pt-md col-md-12">
              <div class="row col-12 col-md-12">
                <div class="col-md-8 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                  <p class="text-h7 q-ma-none text-weight-bold">
                    {{ t('total_price') }}
                  </p>
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
        </form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useImportStockByIdQuery } from '../api/getImportStockById';
import type { QInput, ValidationRule } from 'quasar';
import { formatMoney } from '~/composable/useFormat';
import ImportStock from './import-stock.vue';
import { date } from 'quasar';
import { FORMAT_DATE_TIME_UI } from '~/constants';
const { t } = useI18n();
// const $q = useQuasar();
interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
}

const emits = defineEmits<Emits>();
const props = defineProps({
  modelValue: { type: Boolean, require: true },
});
// data
const stockSn = ref(-1);
const setupCreateImportStockDialog = async (sn: number) => {
  stockSn.value = sn;
  refetchImportStock.value();
};

defineExpose({
  setupCreateImportStockDialog,
});
const {
  data: dataImportStockDetail,
  isLoading: isLoadingImportStockById,
  refetch: refetchImportStock,
} = useImportStockByIdQuery({
  stockSn: stockSn,
  isDelete: 1,
});

const nameField = ref<QInput | null>(null);
const nameRules: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) =>
    (value?.length >= 1 && value?.length < 51) || t('the_length_is_from_1_to_50_characters'),
];

// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val: boolean) {
    emits('update:modelValue', val);
  },
});
// watch
// methos
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
