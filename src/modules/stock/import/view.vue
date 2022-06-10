<template>
  <div class="relative-position" style="min-height: 200px">
    <div>
      <Filter
        :booking-no-field="false"
        :is-add="true"
        :is-category="false"
        @change-success="changeSuccess"
        @add-import-receipt="addImportReceipt"
      />
      <q-inner-loading
        :showing="loadingImportStock"
        label="Please"
        label-class="text-teal"
        label-style="font-size:1.1em"
      >
        <div lass="full-width" full-height class="q-mt-md row justify-center">
          <q-spinner color="negative" :thickness="2" size="2em" />
        </div>
      </q-inner-loading>

      <div v-if="!loadingImportStock">
        <q-table
          v-if="dataImportStock"
          :rows="dataImportStock?.data?.importStockList"
          :columns="columns"
          :table-colspan="9"
          table-header-class="custom-header"
          row-key="index"
          no-data-label="No data"
          :virtual-scroll-item-size="48"
          :rows-per-page-options="[0]"
          hide-pagination
          hide-bottom
        >
          <template #header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template #body="props">
            <q-tr :props="props">
              <q-td key="index" :props="props" :class="!props.row.deleteTime ? '' : 'opacity-view'">
                {{ formatIndexTable(pagination.currentPage, props.pageIndex) }}
              </q-td>
              <q-td key="importDate">
                <div class="row align-left" :class="!props.row.deleteTime ? '' : 'opacity-view'">
                  {{ date.formatDate(props.row.importDate * 1000, FORMAT_DATE_TIME_UI) }}
                </div></q-td
              >
              <q-td key="receiptId">
                <div class="row align-left">
                  <span
                    class="q-ml-xs"
                    :class="
                      !props.row.deleteTime &&
                      hasPermission('add-edit-delete-import-receipt') == true
                        ? 'doc-link'
                        : 'opacity-view'
                    "
                    @click="
                      !props.row.deleteTime &&
                      hasPermission('add-edit-delete-import-receipt') == true
                        ? openDialogEdit(props.row.sn)
                        : ''
                    "
                    >{{ props.row.receiptId }}</span
                  >
                </div>
              </q-td>
              <q-td key="totalPrice"
                ><div class="text-right" :class="!props.row.deleteTime ? '' : 'opacity-view'">
                  {{ formatMoney(props.row.totalPrice) }} VND
                </div></q-td
              >
              <q-td key="note">
                <div class="row justify-between">
                  <div :class="!props.row.deleteTime ? '' : 'opacity-view'" class="limit-text">
                    {{ props.row.note }}
                    <q-tooltip v-if="props.row.note">{{ props.row.note }}</q-tooltip>
                  </div>
                </div>
              </q-td>
              <q-td key="action" class="text-align-end">
                <q-btn
                  v-if="!props.row.deleteTime"
                  dense
                  round
                  flat
                  :class="hasPermission('add-edit-delete-import-receipt') === false ? 'hidden' : ''"
                  icon="delete"
                  @click="deleteImportStock(props.row.sn)"
                >
                  <q-tooltip>{{ t('delete') }}</q-tooltip>
                </q-btn>
                <q-btn
                  v-else
                  dense
                  round
                  flat
                  :class="hasPermission('view-import-receipt-detail') === false ? 'hidden' : ''"
                  icon="visibility"
                  @click="viewImportStock(props.row.sn)"
                >
                  <q-tooltip>Seen</q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <div class="q-mt-md row justify-end">
          <q-pagination
            v-model="pagination.currentPage"
            color="negative"
            :max="dataImportStock?.data?.meta.lastPage || 1"
            :max-pages="6"
            direction-links
          />
        </div>
      </div>
    </div>
  </div>
  <ModalCreateImportStock
    ref="importStockCreateRef"
    v-model="importStockCreateVisiable"
    @close="closePopupCreateImportStock"
  />
  <ModalEditImportStock
    ref="importStockEditRef"
    v-model="importStockEditVisiable"
    @close="closePopupEditImportStock"
  />
  <ModalViewImportStock
    ref="importStockViewRef"
    v-model="importStockViewVisiable"
    @close="closePopupViewImportStock"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useQuasar, date } from 'quasar';
// API

import { useImportStockQuery } from './api/useImportStockQuery';
import { useDeleteImportStockMutation } from './api/useDeleteImportStockMutation';
import ModalCreateImportStock from './components/import-stock-create-modal.vue';
import ModalEditImportStock from '../components/import-stock-edit-modal.vue';
import ModalViewImportStock from './components/import-stock-view-modal.vue';
import { formatMoney } from '~/composable/useFormat';
import { useAuth } from '~/composable/useAuth';
import Filter from '../components/filter.vue';
import { formatIndexTable } from '~/composable/useFormat';
import { useNotify } from '~/composable/useNotify';
import { FORMAT_DATE_UI, FORMAT_DATE_TIME_UI } from '~/constants';

const { t } = useI18n();
const $q = useQuasar();
const $date = date.formatDate;
const { hasPermission } = useAuth();
// ref dome
const importStockCreateRef = ref<InstanceType<typeof ModalCreateImportStock> | null>(null);
const importStockEditRef = ref<InstanceType<typeof ModalEditImportStock> | null>(null);
const importStockViewRef = ref<InstanceType<typeof ModalViewImportStock> | null>(null);
// set defaul flag modals
const importStockCreateVisiable = ref(false);
const importStockEditVisiable = ref(false);
const importStockViewVisiable = ref(false);
// handle popupsetupCreateImportStockDialogs
const closePopupCreateImportStock = () => {
  importStockCreateVisiable.value = false;
  refetchImportStockList.value();
};
const { notifyUpdateSuccess } = useNotify();
interface IFormValues {
  keywordSearchBookingNo: string;
  option: {
    key: string;
    id: number;
  };
  startWeek: string;
  startTime: string;
  endTime: string;
  valuereceipts: {
    key: string;
    id: number;
  };
}
const closePopupEditImportStock = () => {
  importStockEditVisiable.value = false;
  refetchImportStockList.value();
};
const closePopupViewImportStock = () => {
  importStockViewVisiable.value = false;
};

const valuereceipts = ref({
  key: 'All receipts',
  id: 0,
});
const valueTime = ref({
  key: 'Today',
  id: 1,
});

type TAlignColumn = 'left' | 'right' | 'center' | undefined;
const columns = computed(() => [
  {
    name: 'index',
    label: t('no'),
    field: 'index',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'importDate',
    label: t('import_date_time'),
    field: 'importDate',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'receiptId',
    label: t('import_receipt_id'),
    field: 'receiptId',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'totalPrice',
    label: t('total'),
    field: 'totalPrice',
    align: 'right' as TAlignColumn,
  },
  {
    name: 'note',
    label: t('note'),
    field: 'note',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'action',
    label: '',
    field: 'action',
    align: 'left' as TAlignColumn,
  },
]);
let today = new Date();
let startDate = ref($date(Date.now(), FORMAT_DATE_UI));
let endDate = ref($date(Date.now(), FORMAT_DATE_UI));
let startWeek = ref(
  $date(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), FORMAT_DATE_UI),
);
let pagination = ref({
  currentPage: 1,
  lastPage: 1,
});

const deleteImportStockMutation = useDeleteImportStockMutation();

watch(valuereceipts, () => {
  pagination.value.currentPage = 1;
});
watch(valueTime, () => {
  pagination.value.currentPage = 1;
});
let {
  data: dataImportStock,
  isLoading: loadingImportStock,
  refetch: refetchImportStockList,
} = useImportStockQuery({
  page: pagination,
  limit: 10,
  startWeek: startWeek,
  displayType: valuereceipts,
  startTime: !startDate.value ? startWeek : startDate,
  endTime: endDate,
});
const changeSuccess = (val: IFormValues) => {
  startWeek.value = val.startWeek;
  pagination.value.currentPage = 1;
  startDate.value = val.startTime;
  endDate.value = val.endTime;
  valuereceipts.value = val.valuereceipts;

  // refetchExportStockList.value();
};
//action
const deleteImportStock = (sn: number) => {
  $q.dialog({
    message: t('are_you_sure_delete_import_receipt'),
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
      deleteImportStockMutation.mutate(
        { importStockSn: sn },
        {
          onSuccess: (response: any) => {
            if (response?.code === 1) {
              notifyUpdateSuccess();
            }
            refetchImportStockList.value();
          },
        },
      );
    })
    .onCancel(() => {
      // todo
    });
};
const viewImportStock = (sn: number) => {
  importStockViewVisiable.value = true;
  (importStockViewRef.value as any)?.setupCreateImportStockDialog(Number(sn));
};

const openDialogCreate = () => {
  importStockCreateVisiable.value = true;
};
const openDialogEdit = (sn: number) => {
  importStockEditVisiable.value = true;
  (importStockEditRef.value as any)?.setupEditImportStockDialog(Number(sn));
};
const addImportReceipt = () => {
  openDialogCreate();
};
</script>
<style lang="scss" scoped>
.custom-header :deep(tr) {
  border-color: rgba(0, 0, 0, 0.12);
}
</style>
<style lang="sass" scoped>

.limit-text
  max-height: 20px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  width: 250px
  text-align: left
.doc-link
  color: #ff6400
  font-weight: 500
  outline: 0
  text-decoration: none
  transition: opacity .2s
  white-space: nowrap
  cursor: pointer
.doc-link:hover
  opacity: .8
.opacity-view
  opacity: .4
</style>
