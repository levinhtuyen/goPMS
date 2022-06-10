<script setup lang="ts">
import addCash from './components/addCash.vue';
import editDetailCash from './components/editDetailCash.vue';
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { date } from 'quasar';
import { formatIndexTable } from '~/composable/useFormat';
import { formatMoney } from '~/composable/useFormat';
import { useQuasar } from 'quasar';
import { useNotify } from '~/composable/useNotify';
import {
  useCashTransactionQuery,
  ICashTransactionsMutationVariables,
} from './apis/useCashTransactionQuery';
import { useDeleteCashTransactionMutation } from './apis/useDeleteCashTransactionMutation';
import { useAuth } from '~/composable/useAuth';
import {
  FORMAT_DATE_UI,
  FORMAT_DATE_PICKER,
  FORMAT_DATE_TIME_UI,
  // FORMAT_DATE_TIME_PICKER,
  // ClientOffset,
} from '~/constants';
import { useRoute } from 'vue-router';
import {
  newDateStamp,
  //  convertTimeZone
} from '~/composable/useCreateDate';

// const now = ref<number>(convertTimeZone(new Date().getTime()));
const now = ref<number>(Date.now());

const { t } = useI18n();
const visibleColumns = ref(['receiptDateTime', 'cashReceiptId', 'total', 'reason', 'operations']);
const route = useRoute();
// data
const { hasPermission } = useAuth();
const istTabSelected = ref({
  label: 'cash_receipt',
  field: 'receiptPrice',
  per: 'cash-receipt',
  view: 'receipt',
});
const $q = useQuasar();
const rows = ref([]);
const categorySn = ref<number | null>(1);

// const dayNow =
// date.formatDate(now.value, FORMAT_DATE_PICKER) + ` 0${Math.abs(ClientOffset / 60)}:00`;

const initialData = {
  page: 1,
  limit: 10,
  categorySn: categorySn.value || 0,
  isDeleted: null,
  // dateFrom: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
  // dateTo: Number(date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X')),
  dateFrom: Number(date.formatDate(now.value, 'X')),
  dateTo: Number(date.formatDate(now.value, 'X')),
};
const formValues = reactive<ICashTransactionsMutationVariables>({ ...initialData });

const total = ref(0);
const columns = computed(() => [
  {
    name: 'index',
    label: t('no'),
    field: 'index',
    align: 'left' as const,
    style: 'width: 50px',
    required: true,
  },
  {
    name: 'paymentDateTime',
    label: t('cash_payment_date_time'),
    field: 'dateTime',
    align: 'left' as const,
  },
  {
    name: 'receiptDateTime',
    label: t('cash_receipt_date_time_table'),
    field: 'dateTime',
    align: 'left' as const,
  },
  {
    name: 'dateTime',
    label: t('date_time'),
    field: 'dateTime',
    align: 'left' as const,
  },
  {
    name: 'cashPaymentId',
    field: 'cashPaymentId',
    label: 'cash_payment_id',
    align: 'left' as const,
  },
  {
    name: 'cashReceiptId',
    field: 'cashReceiptId',
    label: t('cash_receipt_id'),
    align: 'left' as const,
  },
  {
    name: 'total',
    field: istTabSelected.value.field,
    label: t('total'),
    align: 'right' as const,
  },
  {
    name: 'paymentPrice',
    field: 'paymentPrice',
    label: t('payment_price'),
    align: 'right' as const,
  },
  {
    name: 'receiptPrice',
    field: 'receiptPrice',
    label: t('receipt_price'),
    align: 'right' as const,
  },
  {
    name: 'reason',
    field: 'reason',
    label: t('reason'),
    align: 'left' as const,
  },
  {
    name: 'createBy',
    field: 'createBy',
    label: t('created_by'),
    align: 'left' as const,
  },
  {
    name: 'operations',
    field: '',
    label: t('operations'),
    align: 'left' as const,
  },
]);
const ui = reactive({
  isShowAddCash: false,
  isShowEditDetailCash: false,
});
const refAddCash = ref<InstanceType<typeof addCash> | null>(null);
const refEditDetailCash = ref<InstanceType<typeof editDetailCash> | null>(null);
const { notifyUpdateSuccess } = useNotify();
const qDateRef = ref<any>(null);
const dateRangeType = ref<number>(0);

const resetPage = () => {
  formValues.page = 1; // reset to page 1
};
// const { data: dataCash, isFetching, refetch } = useCashTransactionQuery(formValues, pagination);
const { data: dataCash, isFetching, refetch } = useCashTransactionQuery(formValues, true);
const deleteCashTransactionMutation = useDeleteCashTransactionMutation();

// watch
watch(isFetching, () => {
  rows.value = dataCash?.value
    ? JSON.parse(JSON.stringify(dataCash?.value.cashTransactionList))
    : [];
  total.value = dataCash?.value ? JSON.parse(JSON.stringify(dataCash?.value.meta.lastPage)) : [];
});
watch(categorySn, () => {
  formValues.page = 1;
  formValues.categorySn = categorySn.value;
  formValues.isDeleted = initialData.isDeleted;
  dateRangeType.value = 0;
  onChangeDateRangeType();
  switch (categorySn.value) {
    case 1:
      istTabSelected.value.label = 'cash_receipt';
      istTabSelected.value.field = 'receiptPrice';
      istTabSelected.value.per = 'cash-receipt';
      istTabSelected.value.view = 'receipt';
      visibleColumns.value = ['receiptDateTime', 'cashReceiptId', 'total', 'reason', 'operations'];
      break;
    case 2:
      istTabSelected.value.label = 'cash_payment';
      istTabSelected.value.field = 'paymentPrice';
      istTabSelected.value.per = 'cash-payment';
      istTabSelected.value.view = 'payment';
      visibleColumns.value = ['paymentDateTime', 'cashPaymentId', 'total', 'reason', 'operations'];
      break;
    case null:
      istTabSelected.value.label = '';
      visibleColumns.value = [
        'dateTime',
        'cashReceiptId',
        'cashPaymentId',
        'receiptPrice',
        'paymentPrice',
        'reason',
        'createBy',
      ];
      break;
    default:
      istTabSelected.value.label = 'cash_receipt';
      visibleColumns.value = [
        'paymentDateTime',
        'cashReceiptId',
        'receiptPrice',
        'reason',
        'createBy',
      ];
      break;
  }
  // refetch.value();
});
// computed

const dateRange = computed({
  get: () => {
    return {
      // from: formValues.dateFrom
      //   ? date.formatDate(
      //       new Date(convertTimeZone(formValues.dateFrom * 1000, false)),
      //       FORMAT_DATE_TIME_PICKER,
      //     )
      //   : null,
      // to: formValues.dateTo
      //   ? date.formatDate(
      //       new Date(convertTimeZone(formValues.dateTo * 1000, false)),
      //       FORMAT_DATE_TIME_PICKER,
      //     )
      //   : null,
      from: formValues.dateFrom
        ? date.formatDate(new Date(formValues.dateFrom * 1000), FORMAT_DATE_PICKER)
        : '',
      to: formValues.dateTo
        ? date.formatDate(new Date(formValues.dateTo * 1000), FORMAT_DATE_PICKER)
        : '',
    };
  },
  set: (val: any) => {
    dateRangeType.value = 0;
    if (val) {
      // const dateFromTime = new Date((val.from || val) + ` 0${Math.abs(ClientOffset / 60)}:00`);
      // const dateToTime = new Date((val.to || val) + ` 0${Math.abs(ClientOffset / 60)}:00`);

      // formValues.dateFrom = Number(date.formatDate(convertTimeZone(dateFromTime.getTime()), 'X'));
      // formValues.dateTo = Number(date.formatDate(convertTimeZone(dateToTime.getTime()), 'X'));
      formValues.dateFrom =
        Number(date.formatDate(new Date(val.from), 'X')) ||
        Number(date.formatDate(new Date(val), 'X'));
      formValues.dateTo =
        Number(date.formatDate(new Date(val.to), 'X')) ||
        Number(date.formatDate(new Date(val), 'X'));
    } else {
      formValues.dateFrom = formValues.dateTo = null;
    }
    onApply();
  },
});

const receiptOption = computed(() => [
  {
    name: t('all_' + istTabSelected.value.label),
    value: null,
  },
  {
    name: t('available_' + istTabSelected.value.label),
    value: 0,
  },
  {
    name: t('deleted_' + istTabSelected.value.label),
    value: 1,
  },
]);
const dateRangeOption = computed(() => [
  {
    name: t('today'),
    value: 0,
  },
  {
    name: t('this_week'),
    value: 1,
  },
  {
    name: t('this_month'),
    value: 2,
  },
  {
    name: t('this_year'),
    value: 3,
  },
]);
// methods
const onApply = () => {
  formValues.page = 1;
  // refetch.value();
};
const onOpenAddModal = () => {
  ui.isShowAddCash = true;
  (refAddCash.value as any)?.setupPricingAddDialog({
    labelType: istTabSelected.value.label,
    categorySn: categorySn.value,
  });
};
const onChangeDateRangeType = () => {
  if (dateRangeType.value === 0) {
    // formValues.dateFrom = formValues.dateTo = Number(
    //   date.formatDate(convertTimeZone(new Date(dayNow).getTime(), true), 'X'),
    // );
    formValues.dateFrom = formValues.dateTo = Number(date.formatDate(now.value, 'X'));
  } else if (dateRangeType.value === 1) {
    // set from monday to sunday this week
    const curr = new Date();
    const first = curr.getDate() - curr.getDay();
    const last = first + 6;
    // const firstDay =
    //   date.formatDate(new Date(curr.setDate(first + 1)), FORMAT_DATE_PICKER) +
    //   ` 0${Math.abs(ClientOffset / 60)}:00`;

    // const lastDay =
    //   date.formatDate(new Date(curr.setDate(last + 1)), FORMAT_DATE_PICKER) +
    //   ` 0${Math.abs(ClientOffset / 60)}:00`;

    // formValues.dateFrom = Number(
    //   date.formatDate(convertTimeZone(new Date(firstDay).getTime(), true), 'X'),
    // );
    // formValues.dateTo = Number(
    //   date.formatDate(convertTimeZone(new Date(lastDay).getTime(), true), 'X'),
    // );
    const firstDay = new Date(new Date().setDate(first + 1));
    const lastDay = new Date(new Date().setDate(last + 1));
    formValues.dateFrom = Number(date.formatDate(firstDay, 'X'));
    formValues.dateTo = Number(date.formatDate(lastDay, 'X'));
  } else if (dateRangeType.value === 2) {
    // set from first date of month to last date of month3
    const curr = new Date();
    // const firstDay =
    //   date.formatDate(new Date(curr.getFullYear(), curr.getMonth(), 1), FORMAT_DATE_PICKER) +
    //   ` 0${Math.abs(ClientOffset / 60)}:00`;

    // const lastDay =
    //   date.formatDate(new Date(curr.getFullYear(), curr.getMonth() + 1, 0), FORMAT_DATE_PICKER) +
    //   ` 0${Math.abs(ClientOffset / 60)}:00`;

    // formValues.dateFrom = Number(
    //   date.formatDate(convertTimeZone(new Date(firstDay).getTime(), true), 'X'),
    // );
    // formValues.dateTo = Number(
    //   date.formatDate(convertTimeZone(new Date(lastDay).getTime(), true), 'X'),
    // );
    const firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1);
    const lastDay = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
    formValues.dateFrom = Number(date.formatDate(firstDay, 'X'));
    formValues.dateTo = Number(date.formatDate(lastDay, 'X'));
  } else if (dateRangeType.value === 3) {
    // set from first date of year to last date of year
    // const firstDay =
    //   date.formatDate(new Date(new Date().getFullYear(), 0, 1), FORMAT_DATE_PICKER) +
    //   ` 0${Math.abs(ClientOffset / 60)}:00`;

    // const lastDay =
    //   date.formatDate(new Date(new Date().getFullYear(), 11, 31), FORMAT_DATE_PICKER) +
    //   ` 0${Math.abs(ClientOffset / 60)}:00`;

    // formValues.dateFrom = Number(
    //   date.formatDate(convertTimeZone(new Date(firstDay).getTime(), true), 'X'),
    // );
    // formValues.dateTo = Number(
    //   date.formatDate(convertTimeZone(new Date(lastDay).getTime(), true), 'X'),
    // );
    const firstDay = new Date(new Date().getFullYear(), 0, 1);
    const lastDay = new Date(new Date().getFullYear(), 11, 31);
    formValues.dateFrom = Number(date.formatDate(firstDay, 'X'));
    formValues.dateTo = Number(date.formatDate(lastDay, 'X'));
  }
  onApply();
};
const onOpenDetail = (sn: number, pageType: number, labelType?: number | null) => {
  ui.isShowEditDetailCash = true;
  (refEditDetailCash.value as any)?.setupPricingAddDialog({
    labelType: labelType,
    categorySn: categorySn.value,
    sn: sn,
    pageType: pageType,
  });
};
const onDelete = (sn: number) => {
  $q.dialog({
    // title: t('confirm'),
    message: t('are_you_sure_you_want_to_delete_this_' + istTabSelected.value.label),
    cancel: {
      color: 'grey-8',
      label: t('cancel'),
      noCaps: true,
      dense: true,
      outline: true,
    },
    color: 'negative',
    ok: { color: 'negative', label: t('confirm'), noCaps: true, dense: true },
    persistent: true,
  }).onOk(() => {
    deleteCashTransactionMutation.mutate(
      { sn: sn },
      {
        onSuccess: () => {
          notifyUpdateSuccess();
        },
      },
    );
  });
};
const closePopup = () => {
  ui.isShowAddCash = false;
  ui.isShowEditDetailCash = false;
  refetch.value();
};
const onOpenDatePopUp = () => {
  qDateRef?.value.show();
};
const checkTabDialogDirect = () => {
  if (route.params && !route.params.sn) {
    return;
  }
  let sn = Number(route.params.sn);
  let activitesSn = Number(route.params.activitiesSn);

  if (activitesSn === 16 || activitesSn === 17 || activitesSn === 18) {
    categorySn.value = 1;
    if (activitesSn === 16) {
      onOpenDetail(sn, 1, 1);
    }
    if (activitesSn === 17) {
      onOpenDetail(sn, 1, 1);
    }
    if (activitesSn === 18) {
      onOpenDetail(sn, 0, 1);
    }
  } else if (activitesSn === 19 || activitesSn === 20 || activitesSn === 21) {
    categorySn.value = 2;
    if (activitesSn === 19) {
      onOpenAddModal();
    }
    if (activitesSn === 20) {
      onOpenDetail(sn, 1, 2);
    }
    if (activitesSn === 21) {
      onOpenDetail(sn, 0, 2);
    }
  }
};
onMounted(() => {
  setTimeout(() => {
    checkTabDialogDirect();
  }, 800);
});
</script>
<template>
  <pms-sections>
    <div class="text-center q-mb-md">
      <div class="custom-row rounded-borders">
        <q-btn
          :label="t('cash_receipt_title')"
          class="col custom-tab text-bold"
          :class="categorySn === 1 ? 'active' : ''"
          no-caps
          dense
          @click="categorySn = 1"
        />
        <q-btn
          :label="t('cash_payment_title')"
          class="col custom-tab text-bold"
          :class="categorySn === 2 ? 'active' : ''"
          no-caps
          dense
          @click="categorySn = 2"
        />
        <q-btn
          :label="t('transaction_detail')"
          class="col custom-tab text-bold"
          :class="!categorySn ? 'active' : ''"
          no-caps
          dense
          @click="categorySn = null"
        />
      </div>
    </div>

    <div class="row q-mb-md">
      <div v-if="categorySn" class="col-md-2 col-sm-4 col-xs-12 q-pb-sm">
        <q-select
          v-model="formValues.isDeleted"
          class="q-mr-md"
          :options="receiptOption"
          dense
          filled
          map-options
          option-label="name"
          emit-value
          @update:model-value="onApply()"
        />
      </div>
      <div class="col-md-2 col-sm-4 col-xs-12 q-pb-sm">
        <q-select
          v-model="dateRangeType"
          class="q-mr-md"
          :options="dateRangeOption"
          dense
          :label="t('select_time_range')"
          filled
          map-options
          option-label="name"
          emit-value
          @update:model-value="onChangeDateRangeType"
        />
      </div>
      <div class="col-md-4 col-sm-4 col-xs-12 q-pb-sm">
        <q-field
          :placeholder="t('select_date_time')"
          dense
          stack-label
          filled
          class="q-mr-md inline-block"
          @focus="onOpenDatePopUp"
        >
          <template #control>
            <div
              v-if="dateRange.from && dateRange.to"
              class="self-center full-width no-outline"
              tabindex="0"
            >
              {{ date.formatDate(dateRange.from, FORMAT_DATE_UI) }} -
              {{ date.formatDate(dateRange.to, FORMAT_DATE_UI) }}
            </div>
          </template>
          <template #prepend>
            <q-icon name="event" class="no-pointer-events">
              <q-popup-proxy ref="qDateRef" transition-show="scale" transition-hide="scale">
                <q-date v-model="dateRange" range @range-end="resetPage" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-field>
      </div>
      <div v-if="!categorySn && $q.screen.gt.sm" class="col-md-2 col-sm-4 col-xs-12" />
      <div
        class="col-md-4 col-sm-4 col-xs-12 q-py-sm"
        :class="!categorySn && !$q.screen.gt.sm ? 'text-left' : 'text-right'"
      >
        <q-btn
          v-if="formValues.categorySn && hasPermission('add-edit-delete-' + istTabSelected.per)"
          outline
          no-caps
          color="deep-orange-12"
          :label="$q.screen.gt.sm ? t(`add_${istTabSelected.label}`) : void 0"
          icon="add_circle"
          @click="onOpenAddModal"
        />
      </div>
    </div>
    <div v-if="!isFetching" class="container">
      <q-table
        v-if="rows"
        :rows="rows"
        :columns="columns"
        :table-colspan="9"
        row-key="index"
        dense
        :no-data-label="t('no_data')"
        :virtual-scroll-item-size="48"
        :rows-per-page-options="[0]"
        :visible-columns="visibleColumns"
        hide-bottom
      >
        <template #header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ t(col.label) }}
            </q-th>
          </q-tr>
        </template>
        <template #body="props">
          <q-tr :props="props" :class="' isDeleted-' + props.row.isDeleted">
            <q-td key="index" :props="props">
              <p>
                {{ formatIndexTable(formValues.page, props.pageIndex) }}
              </p>
            </q-td>
            <q-td key="paymentDateTime" :props="props">
              <p>
                {{ newDateStamp(props.row.dateTime, FORMAT_DATE_TIME_UI) }}
              </p>
            </q-td>
            <q-td key="receiptDateTime" :props="props">
              <p>
                {{ newDateStamp(props.row.dateTime, FORMAT_DATE_TIME_UI) }}
              </p>
            </q-td>
            <q-td key="dateTime" :props="props">
              <p>
                {{ newDateStamp(props.row.dateTime, FORMAT_DATE_TIME_UI) }}
              </p>
            </q-td>
            <q-td key="cashPaymentId" :props="props">
              <div
                v-if="
                  props.row.isDeleted === 0 &&
                  props.row.isAutoBySystem === 0 &&
                  hasPermission('add-edit-delete-' + istTabSelected.per)
                "
                flat
                class="text-negative cursor-pointer"
                @click="onOpenDetail(props.row.sn, 1, 2)"
              >
                {{ props.row.cashPaymentId }}
              </div>
              <!-- edit receipt, just edit when transaction isn't delete and create by user  -->
              <div
                v-else-if="!formValues.categorySn && hasPermission('view-cash-payment-detail')"
                flat
                class="text-negative cursor-pointer"
                @click="onOpenDetail(props.row.sn, 0, 2)"
              >
                {{ props.row.cashPaymentId }}
              </div>
              <!-- detail cash payment detail   -->
              <p v-else>
                {{ props.row.cashPaymentId }}
              </p>
              <!-- label for all tabs -->
            </q-td>
            <q-td key="cashReceiptId" :props="props">
              <div
                v-if="
                  props.row.isDeleted === 0 &&
                  props.row.isAutoBySystem === 0 &&
                  hasPermission('add-edit-delete-' + istTabSelected.per)
                "
                class="text-negative cursor-pointer"
                flat
                @click="onOpenDetail(props.row.sn, 1, 1)"
              >
                {{ props.row.cashReceiptId }}
              </div>
              <!-- edit payment, just edit when transaction isn't delete and create by user  -->
              <div
                v-else-if="!formValues.categorySn && hasPermission('view-cash-receipt-detail')"
                flat
                class="text-negative cursor-pointer"
                @click="onOpenDetail(props.row.sn, 0, 1)"
              >
                {{ props.row.cashReceiptId }}
              </div>
              <p v-else>
                {{ props.row.cashReceiptId }}
              </p>
            </q-td>
            <q-td key="total" :props="props">
              <p>{{ formatMoney(props.row[istTabSelected.field]) }} VND</p>
            </q-td>
            <q-td key="paymentPrice" :props="props">
              <p>{{ formatMoney(props.row.paymentPrice) }} VND</p>
            </q-td>
            <q-td key="receiptPrice" :props="props">
              <p>{{ formatMoney(props.row.receiptPrice) }} VND</p>
            </q-td>
            <q-td key="reason" :props="props">
              <p class="ellipsis" style="width: 300px">
                <span>
                  <q-tooltip> {{ props.row.reason }} </q-tooltip>
                  {{ props.row.reason }}
                </span>
              </p>
            </q-td>
            <q-td key="createBy" :props="props">
              <p>
                {{ props.row.createBy }}
              </p>
            </q-td>
            <q-td class="active-visibility" key="operations" :props="props">
              <q-btn
                v-if="
                  props.row.isDeleted === 0 &&
                  props.row.isAutoBySystem === 0 &&
                  hasPermission('add-edit-delete-' + istTabSelected.per)
                "
                flat
                round
                icon="delete"
                style="max-height: 10px"
                @click="onDelete(props.row.sn)"
              />
              <q-btn
                v-else
                :class="
                  hasPermission('view-cash-' + istTabSelected.view + '-detail') === false
                    ? 'hidden'
                    : ''
                "
                flat
                round
                icon="visibility"
                style="max-height: 10px"
                @click="onOpenDetail(props.row.sn, 0, categorySn)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <div class="q-mt-md row justify-end">
        <q-pagination
          v-model="formValues.page"
          color="negative"
          :max="dataCash?.meta.lastPage || 1"
          :max-pages="5"
          boundary-numbers
          direction-links
          push
        />
      </div>
    </div>
    <div v-if="isFetching" class="container relative-position q-pa-md">
      <q-inner-loading
        :showing="true"
        label="Please wait..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      >
        <div lass="full-width full-height q-mx-md row justify-center">
          <q-spinner color="negative" :thickness="2" size="2em" />
        </div>
      </q-inner-loading>
    </div>
    <div v-if="!categorySn" class="bg-deep-orange-1 q-mt-md q-px-md text-bold custom-fs-16">
      <div class="row justify-between">
        <p>1. {{ t('starting_balance') }}</p>
        <p>{{ formatMoney(dataCash?.additionalData?.startingBalance) }} VND</p>
      </div>
      <div class="row justify-between">
        <p>2. {{ t('total_receipt') }}</p>
        <p>{{ formatMoney(dataCash?.additionalData?.totalReceipt) }} VND</p>
      </div>
      <div class="row justify-between">
        <p>3. {{ t('total_payment') }}</p>
        <p>{{ formatMoney(dataCash?.additionalData?.totalPayment) }} VND</p>
      </div>

      <div class="row justify-between">
        <p>4. {{ t('end_balance') }}</p>
        <p>{{ formatMoney(dataCash?.additionalData?.endBalance) }} VND</p>
      </div>
    </div>

    <add-cash ref="refAddCash" v-model="ui.isShowAddCash" @close="closePopup" />
    <edit-detail-cash
      ref="refEditDetailCash"
      v-model="ui.isShowEditDetailCash"
      @close="closePopup"
    />
  </pms-sections>
</template>

<style lang="scss" scoped>
.custom-col {
  margin-right: 12px;
  width: 200px;
}
.isDeleted-1 {
  color: $grey-6;
}
.isDeleted-1 .active-visibility {
  color: #000;
}
.custom-tab {
  width: 186px;
  color: #9a9a9a;
  font-size: 16px;

  &.active {
    background-color: $deep-orange-12;
    color: white;
  }
}

.custom-row {
  display: inline-block;
  line-height: normal;
  vertical-align: middle;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
}

.q-btn:before {
  box-shadow: none;
}

.custom-fs-16 {
  p {
    font-size: 16px;
  }
}

table th,
td,
p {
  padding: 1em 0;
  height: 3em;
  margin: 0;
}
</style>
