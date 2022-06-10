<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatMoney } from '~/composable/useFormat';
import { useI18n } from '~/composable/useI18n';
import { useCategoriesQuery } from '../apis/useCategoriesQuery';
import { useExportQuery } from '../export/apis/useExportQuery';
import { useProductsQuery } from '../export/apis/useProductsQuery';
import { date } from 'quasar';
import { FORMAT_DATE_TIME_UI } from '~/constants';

const { t } = useI18n();

const isOpen = ref(false);
const stockSn = ref<number | null>(null);

const open = (sn: number) => {
  isOpen.value = true;
  stockSn.value = sn;
};
defineExpose({ open });

const { data, isLoading } = useExportQuery(stockSn);

const { data: categoriesData } = useCategoriesQuery();
const productsData = useProductsQuery(
  computed(() => data.value?.exportStockDetailList.map(({ categorySn }) => categorySn) ?? []),
);
</script>

<template>
  <q-dialog v-model="isOpen">
    <q-card style="position: relative; width: 1360px; max-width: 80vw">
      <q-spinner
        v-if="isLoading"
        color="primary"
        size="3em"
        style="display: block; position: absolute; inset: 0; margin: auto"
      />
      <q-card-section class="row items-center">
        <div class="text-h6">{{ t('export_receipt_detail') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-form class="form">
          <div class="row q-gutter-md">
            <div class="col col-sm-12 col-xs-12">
              <label>{{ t('export_receipt_id') }}</label>
              <q-input :model-value="data?.exportStock.receiptId" disable filled dense />
            </div>
            <div class="col col-sm-12 col-xs-12">
              <label>{{ t('export_datetime') }}</label>
              <q-input
                :model-value="
                  date.formatDate((data?.exportStock?.exportDate ?? 0) * 1000, FORMAT_DATE_TIME_UI)
                "
                disable
                filled
                dense
              >
                <template #prepend> <q-icon name="date_range" /> </template>
              </q-input>
            </div>
          </div>
          <div>
            <label>{{ t('note') }}</label>
            <q-input
              :model-value="data?.exportStock.note"
              type="textarea"
              rows="5"
              disable
              filled
              dense
            />
          </div>
          <div class="export-stock__container">
            <p class="title">{{ t('export_stock') }}</p>
            <ul>
              <li v-for="stock in data?.exportStockDetailList" :key="stock.sn">
                <div class="product">
                  <div>
                    <label>{{ t('category') }} *</label>
                    <q-select
                      :model-value="stock.categorySn"
                      :options="
                        categoriesData?.categoryList.map(({ sn, name }) => ({
                          label: name,
                          value: sn,
                        }))
                      "
                      map-options
                      disable
                      filled
                      dense
                    />
                  </div>
                  <div>
                    <label>{{ t('product') }} *</label>
                    <q-select
                      :model-value="stock.productSn"
                      :options="
                        productsData
                          .find(({ data }) => data?.categorySn === stock.categorySn)
                          ?.data?.productList?.map(({ name, sn }) => ({ label: name, value: sn }))
                      "
                      map-options
                      disable
                      filled
                      dense
                    />
                  </div>
                  <div>
                    <label>{{ t('unit') }}</label>
                    <q-input :model-value="stock.productUnitName" disable filled dense />
                  </div>
                  <div>
                    <label>{{ t('quantity') }} *</label>
                    <q-input :model-value="stock.quantity" disable filled dense />
                  </div>
                  <div>
                    <label>{{ t('unit_price') }}</label>
                    <q-input
                      :model-value="formatMoney(stock.total / stock.quantity)"
                      input-class="text-right"
                      suffix="VND"
                      disable
                      filled
                      dense
                    />
                  </div>
                  <div>
                    <label>{{ t('total') }}</label>
                    <q-input
                      :model-value="formatMoney(stock.total)"
                      input-class="text-right"
                      suffix="VND"
                      disable
                      filled
                      dense
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="total-price__container">
            <label>{{ t('total_price') }}</label>
            <q-input
              :model-value="formatMoney(data?.exportStock.totalPrice)"
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
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.form {
  display: grid;
  gap: 1rem;
  label {
    font-weight: 600;
  }
  .export-stock__container {
    padding: 1rem;
    background-color: rgba(120, 120, 128, 0.08);
    .title {
      display: block;
      font-weight: 700;
    }
    ul {
      padding: 0px;
      margin: 0px;
      display: grid;
      gap: 1rem;
      li {
        list-style: none;
        .product {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
          display: grid;
          grid-auto-flow: column;
          gap: 1rem;
          @media only screen and (max-width: 600px) {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
            grid-auto-flow: unset;
          }
        }
      }
    }
  }
  .total-price__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      margin: 0px;
    }
  }
}
</style>
