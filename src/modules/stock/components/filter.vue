<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import { date, QInput } from 'quasar';
// import { useRoute } from 'vue-router';
import { useI18n } from '~/composable/useI18n';
// import { EXPORTRECEIPTSOPTIONS } from '~/modules/stock/apis/const';
import { useAuth } from '~/composable/useAuth';
// import { useCategoriesQuery } from '../apis/useCategoriesQuery';
import { FORMAT_DATE_UI } from '~/constants';
import { useCategoryServiceQuery } from '../import/api/useCategoryServiceQuery';
import { i18n } from '~/plugins/i18n';

const TIME_OPTIONS = computed(() => [
  { key: t('select_time_range'), id: 0 },
  { key: t('today'), id: 1 },
  { key: t('this_week'), id: 2 },
  { key: t('this_month'), id: 3 },
  { key: t('this_year'), id: 4 },
]);

const IMPORTRECEIPTSOPTIONS = computed(() => [
  { key: t('all_receipts'), id: 0 },
  { key: t('available_import_receipt'), id: 1 },
  { key: t('deleted_import_receipt'), id: 2 },
]);
const EXPORTRECEIPTSOPTIONS = computed(() => [
  { key: t('all_receipts'), id: 0 },
  { key: t('available_export_receipt'), id: 1 },
  { key: t('deleted_export_receipt'), id: 2 },
]);
interface IProps {
  bookingNoField: boolean;
  isAdd: boolean;
  isCategory: boolean;
}
interface Emits {
  (e: 'changeSuccess', value: any): void;
  (e: 'addImportReceipt'): void;
}
const emits = defineEmits<Emits>();
interface IFormValues {
  keywordSearchBookingNo: string;
  option: {
    key: string;
    id: number;
  };
  startWeek: string;
  startTime: string;
  endTime: string;
  categorySn: string;
  valuereceipts: {
    key: string;
    id: number;
  };
}
const { data: categories } = useCategoryServiceQuery();
const categoryOptions = computed(() => {
  const options = categories?.value?.pages[0]?.map(({ name, sn }: any) => ({
    label: name,
    value: sn,
  }));
  return [{ label: t('all_categories'), value: '' }, ...(options ? options : [])];
});
const { hasPermission } = useAuth();
const props = defineProps<IProps>();
const isAddImport = toRef(props, 'isAdd');
const isCategoryInventory = toRef(props, 'isCategory');
const isSearchBookingNoField = toRef(props, 'bookingNoField');
const $date = date.formatDate;
const { t } = useI18n();

const TODAY = date.formatDate(new Date(), FORMAT_DATE_UI);
let chooseOption = ref({
  label: t('all_categories'),
  value: '',
});
let valuereceipts = ref({
  key: t('all_receipts'),
  id: 0,
});
let valueTime = ref({
  key: t('today'),
  id: 1,
});
const bookingNoField = ref<QInput | null>(null);
const qDateRef = ref<any>(null);
let today = new Date();
let startDate = ref($date(Date.now(), FORMAT_DATE_UI));
let endDate = ref($date(Date.now(), FORMAT_DATE_UI));
let startWeek = ref(
  $date(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), FORMAT_DATE_UI),
);
const keywordSearchBookingNo = ref();
const formValues = ref<IFormValues>({
  keywordSearchBookingNo: keywordSearchBookingNo.value?.toString() ?? '',
  option: valueTime.value,
  startWeek: startWeek.value?.toString() ?? TODAY,
  startTime: startDate.value?.toString() ?? TODAY,
  endTime: endDate.value?.toString() ?? TODAY,
  valuereceipts: valuereceipts.value,
  categorySn: chooseOption.value.value,
});

const dateRange = computed({
  get: () => {
    return {
      from: startDate.value,
      to: endDate.value,
    };
  },
  set: (val) => {
    if (typeof val === 'object') {
      startDate.value = val?.from;
      endDate.value = val?.to;
    } else {
      startDate.value = val as any;
      endDate.value = val as any;
    }

    onSubmit();
  },
});
const onOpenDatePopUp = () => {
  qDateRef?.value.show();
  valueTime.value = {
    key: t('select_time_range'),
    id: 0,
  };
};
const changeTimeInfo = (val: any) => {
  if (val === 1) {
    startDate.value = $date(Date.now(), FORMAT_DATE_UI);
    endDate.value = $date(Date.now(), FORMAT_DATE_UI);
  } else if (val === 2) {
    chooseThisWeek();
  } else if (val === 3) {
    chooseThisMonth();
  } else if (val === 4) {
    chooseThisYear();
  }
  onSubmit();
};
const chooseThisWeek = () => {
  const curr = new Date();
  var firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
  var lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));

  startDate.value = $date(firstDay, FORMAT_DATE_UI);
  endDate.value = $date(lastDay, FORMAT_DATE_UI);
};
const chooseThisMonth = () => {
  if (today.getDate() > 1) {
    endDate.value = $date(new Date(today.getFullYear(), today.getMonth() + 1, 0), FORMAT_DATE_UI);
    today.setDate(1);
    startDate.value = $date(
      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      FORMAT_DATE_UI,
    );
  } else if (today.getDate() === 1) {
    endDate.value = $date(new Date(today.getFullYear(), today.getMonth() + 1, 0), FORMAT_DATE_UI);
    today.setDate(1);
    startDate.value = $date(
      new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
      FORMAT_DATE_UI,
    );
  }
};
const chooseThisYear = () => {
  startDate.value = $date(new Date(today.getFullYear() - 1, 12, 1), FORMAT_DATE_UI);
  endDate.value = $date(new Date(new Date().getFullYear(), 11, 31), FORMAT_DATE_UI);
};
const addImportReceipt = () => {
  emits('addImportReceipt');
};
watch(
  () => (i18n.global.locale as any).value,
  () => {
    categoryOptions.value[0] = {
      label: t('all_categories'),
      value: '',
    };
    chooseOption.value = {
      label: t('all_categories'),
      value: '',
    };
    valuereceipts.value = {
      key: t('all_receipts'),
      id: 0,
    };
    valueTime.value = {
      key: t('today'),
      id: 1,
    };
  },
);
const onSubmit = () => {
  formValues.value.valuereceipts = valuereceipts.value;
  formValues.value.startTime = startDate.value;
  formValues.value.endTime = endDate.value;
  formValues.value.keywordSearchBookingNo = keywordSearchBookingNo.value
    ? keywordSearchBookingNo.value
    : '';
  if (isCategoryInventory.value) {
    formValues.value.categorySn = chooseOption.value.value;
  }
  emits('changeSuccess', formValues.value);
};
</script>

<template>
  <div class="q-pb-md">
    <div class="row">
      <div v-if="isCategoryInventory" class="col-md-3 col-sm-6 col-xs-12 q-pr-sm q-pb-sm">
        <q-select
          v-model="chooseOption"
          name="accepted_genres"
          :options="categoryOptions"
          filled
          dense
          class="custom-input-readonly"
          option-value="value"
          option-label="label"
          @update:model-value="onSubmit"
        ></q-select>
      </div>
      <div v-if="!isCategoryInventory" class="col-md-3 col-sm-6 col-xs-12 q-pr-sm q-pb-sm">
        <q-select
          v-if="isSearchBookingNoField"
          v-model="valuereceipts"
          name="accepted_genres"
          :options="EXPORTRECEIPTSOPTIONS"
          filled
          dense
          option-value="id"
          option-label="key"
          @update:model-value="onSubmit"
        ></q-select>
        <q-select
          v-else
          v-model="valuereceipts"
          name="accepted_genres"
          :options="IMPORTRECEIPTSOPTIONS"
          filled
          dense
          option-value="id"
          option-label="key"
          @update:model-value="onSubmit"
        ></q-select>
      </div>
      <div class="col-md-2 col-sm-6 col-xs-12 q-pr-sm q-pb-sm">
        <q-select
          ref="time"
          v-model="valueTime"
          :options="TIME_OPTIONS"
          filled
          dense
          emit-value
          input-debounce="0"
          behavior="menu"
          map-options
          option-label="key"
          option-value="id"
          @update:model-value="changeTimeInfo"
        ></q-select>
      </div>

      <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 q-pr-sm q-pb-sm">
        <q-field
          :placeholder="t('select_date_time')"
          dense
          stack-label
          style="width: 100%"
          filled
          class="q-mr-md inline-block"
          mask="date"
          @focus="onOpenDatePopUp"
        >
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">
              {{ dateRange.from }} - {{ dateRange.to }}
            </div>
          </template>
          <template #prepend>
            <q-icon name="event" class="no-pointer-events">
              <q-popup-proxy ref="qDateRef" transition-show="scale" transition-hide="scale">
                <q-date v-model="dateRange" mask="DD/MM/YYYY" range />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-field>
      </div>
      <div
        v-if="isSearchBookingNoField"
        class="col-lg-2 col-md-3 col-sm-6 col-xs-12 q-pr-sm q-pb-sm"
      >
        <q-input
          ref="bookingNoField"
          v-model="keywordSearchBookingNo"
          :placeholder="t('search_by_booking_no')"
          filled
          dense
          debounce="900"
          @update:model-value="onSubmit"
        />
      </div>
      <div v-if="isAddImport" class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pb-sm">
        <q-btn
          outline
          class="float-right"
          color="negative"
          :label="t('import_receipt')"
          style="text-transform: capitalize"
          :class="hasPermission('add-edit-delete-import-receipt') === false ? 'hidden' : ''"
          icon="add_circle"
          @click="addImportReceipt"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-input-readonly :deep(span) {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: left;
}
</style>
