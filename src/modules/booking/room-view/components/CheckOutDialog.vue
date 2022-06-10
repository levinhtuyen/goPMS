<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { formatMoney, changeMoney } from '~/composable/useFormat';
import { date, useQuasar, Notify } from 'quasar';
import { useI18n } from '~/composable/useI18n';
import { useBookingSourcesQuery } from '~/apis/commons/useAppendixQuery';
import { useProductServiceQuery, IRet, IParams } from '../apis/useProductServiceAvailableQuery';
import { formatIndexTable } from '~/composable/useFormat';
import {
  useCalculateBookingAmountMutation,
  IPriceAdjustment,
} from '../apis/useCalculateBookingAmountMutation';
import { useCheckOutMutation, IService } from '../apis/useCheckOutMutation';
import { useNotify } from '~/composable/useNotify';
import {
  useBookingDetailsQuery,
  IPayment,
  IRoomInformation,
} from '~/modules/booking/booking-details/apis/useBookingDetailQuery';
import { useCategoryServiceQuery } from '../apis/useCategoryServiceQuery';
import { FORMAT_DATE_TIME_UI } from '~/constants';

// interface
export interface IReservationListDialog {
  setupCheckOutDialog(bookingSn: string | null): void;
}
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'checkOutSuccess'): void;
}
interface Props {
  modelValue: boolean;
}

interface IRowAdd {
  product: IRet;
  quantity: number;
  createTime: number;
  productList: IRet[];
}
interface IRowRemove {
  deleteReason: string;
  bookingProductSn: number;
  quantity: number;
  productSn: number;
}
// prop, emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
// data
const priceAdjustmentList = ref<IPriceAdjustment[]>();
const checkOutFormRef = ref<HTMLFormElement>();
const delReasonFormRef = ref<HTMLFormElement>();
const reasonDialogVisible = ref(false);
const { t } = useI18n();
const $date = date.formatDate;
const $q = useQuasar();
const params = reactive<IParams>({
  categorySn: null,
  keyword: '',
  bookingProductSnExceptList: '',
});
const productOptions = ref<IRowAdd[]>();
const initialRoomInfo = {
  bookingNo: '',
  bookingSourceSn: null as number | null,
  bookingStatusSn: null as number | null,
  bookingTypeSn: null as number | null,
  checkIn: '',
  checkInActual: '',
  checkOut: '',
  checkOutActual: '',
  note: '',
  pricingPlanName: '',
  roomTypeSn: null as number | null,
  pricingPlanSn: null as number | null,
  roomName: '',
  roomPrice: null as number | null,
  roomSn: null as number | null,
  roomTypeCode: '',
  sn: null as number | null,
  guest: [],
  roomStatusSn: null as number | null,
};
const initialPayment = {
  amountRoomPrice: 0,
  amountDeposit: 0,
  balance: 0,
  discount: 0,
  earlyCheckIn: '',
  extraFee: 0,
  lateCheckOut: '',
  servicesPrice: 0,
  paid: 0,
  depositMethod: 0,
  roomPrice: '',
  total: 0,
  amountEarlyCheckIn: 0,
  amountLateCheckOut: 0,
  depositMethodSn: 0,
  paymentMethodSn: 1,
};
const rows = ref<IRowAdd[] | IRowRemove[]>([]);
const rowsAdd = reactive<IRowAdd[]>([]);
const rowsRemove = reactive<IRowRemove[]>([]);
const serRemove = reactive<number[]>([]);
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
    name: 'product',
    label: t('products'),
    field: 'category',
    style: 'width: 250px',
    align: 'left' as const,
  },
  {
    name: 'quantity',
    label: t('quantity'),
    field: 'quantity',
    style: 'width: 150px',
    align: 'left' as const,
  },
  {
    name: 'unitPrice',
    label: t('unit_price'),
    field: 'unitPrice',
    align: 'left' as const,
  },
  {
    name: 'totalPrice',
    label: t('total_price'),
    field: 'totalPrice',
    align: 'left' as const,
  },
  {
    name: 'createTime',
    label: t('added_at'),
    field: 'createTime',
    align: 'left' as const,
  },
  {
    name: 'operations',
    field: 'operations',
    label: ' ',
    align: 'left' as const,
  },
]);
const pagination = ref({
  page: 1,
  limit: 10,
});
const isShowCateSelect = ref(false);
const formRoomInfo = ref<IRoomInformation>({ ...initialRoomInfo });
const formPayment = ref<IPayment>({ ...initialPayment });
const isDisplayEarlyCheckIn = ref(false);
const { notifyUpdateSuccess } = useNotify();
const bookingSn = ref<string>('');
const serviceAvailable = ref<number>(1);
const inputActive = reactive({
  extraFee: false,
  discount: false,
  amountDeposit: false,
});
// const setKeySearchCategoryModel = (val: string) => {
//   params.keyword = val;
// };
// vue-query
const checkOutMutation = useCheckOutMutation();
const { data: dataCategory } = useCategoryServiceQuery();
const { data: dataProduct, isFetching } = useProductServiceQuery(params);
const calculatorBookingAmountMutation = useCalculateBookingAmountMutation();
const { data: bookingSourceOptions, isFetching: useBookingSourcesFetching } =
  useBookingSourcesQuery({ enabled: true });
const {
  data: bookingDetails,
  isFetching: bookingDetailsFetching,
  refetch: refetchBookingDetails,
} = useBookingDetailsQuery(bookingSn, serviceAvailable, {
  enabled: true,
});
// watch
watch(bookingDetails, () => {
  if (bookingDetails?.value) {
    isDisplayEarlyCheckIn.value = bookingDetails.value?.isDisplayEarlyCheckIn;
    formPayment.value = { ...bookingDetails.value?.payment };
    formRoomInfo.value = { ...bookingDetails?.value?.roomInformation };
    formPayment.value.paymentMethodSn = 1; // set cash default
    if (bookingDetails?.value?.service)
      rows.value = JSON.parse(JSON.stringify(bookingDetails.value.service));
    calculateBookingAmount();
  }
});
watch(isFetching, () => {
  if (params.categorySn && isFetching.value === false) {
    addNewProduct();
  }
});
watch(dataProduct, () => {
  productOptions.value = dataProduct.value;
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
const bookingType = computed(() => {
  switch (formRoomInfo.value.bookingTypeSn) {
    case 1:
      return t('hourly');
    case 2:
      return t('overnight');
    case 3:
      return t('daily');
    default:
      return t('hourly');
  }
});
const depositList = computed(() => [
  {
    name: t('cash'),
    value: 1,
  },
  {
    name: t('credit_card'),
    value: 2,
  },
  {
    name: t('bank_transfer'),
    value: 3,
  },
  {
    name: t('debt'),
    value: 4,
  },
]);
const serviceTotalPrice = computed(() => {
  let rowsTemp = [...rows.value, ...rowsAdd];
  let total = 0;
  rowsTemp.forEach((row: any) => {
    if (row.unitPrice) {
      total += row.unitPrice * row.quantity;
    } else {
      total += row.product.price * row.quantity;
    }
  });
  return total;
});
const balanceTotalPrice = computed(() => {
  return formPayment.value.balance + serviceTotalPrice.value;
});
const bookingSourceRule = computed(() => {
  if (formPayment.value.depositMethodSn === 4 || formPayment.value.paymentMethodSn == 4) {
    return [(value: number) => !!value || t('booking_source_required')];
  } else {
    return [];
  }
});
const depositAmountRule = computed(() => {
  if (formPayment.value.depositMethodSn == 4) {
    return [
      (value: number) => !!value || t('this_field_is_required'),
      (value: number) => value >= 1 || t('the_value_is_from_1_to_100_000_000_000'),
      (value: number) => value <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
    ];
  } else {
    return [
      (value: number) => value >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
      (value: number) => value <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
    ];
  }
});
// methods
const calculateBookingAmount = () => {
  if (!formRoomInfo.value.checkInActual || !formRoomInfo.value.bookingTypeSn) {
    return false;
  }
  const params = {
    pricingPlanSn: formRoomInfo.value.pricingPlanSn,
    bookingType: formRoomInfo.value.bookingTypeSn,
    checkinDateTime: Number(formRoomInfo.value.checkInActual),
    checkoutDateTime: Number(date.formatDate(new Date(), 'X')),
    discount: formPayment.value.discount || 0,
    extraFee: formPayment.value.extraFee || 0,
    amountDeposit: formPayment.value.amountDeposit || 0,
  };
  calculatorBookingAmountMutation.mutate(params, {
    onSuccess: (data) => {
      formRoomInfo.value.roomPrice = data.roomPrice;
      formPayment.value.total = data.totalCharge;
      formPayment.value.balance = data.balance;
      formPayment.value.amountRoomPrice = data.roomPrice;
      priceAdjustmentList.value = data.priceAdjustmentList;
    },
  });
};
const setupCheckOutDialog = async (booking: string) => {
  isShowCateSelect.value = false;
  rowsAdd.splice(0, rowsAdd.length);
  if (booking === bookingSn.value) {
    refetchBookingDetails.value();
    calculateBookingAmount();
  }
  bookingSn.value = booking;
};
const resetFormData = () => {
  if (bookingDetails?.value) {
    isDisplayEarlyCheckIn.value = bookingDetails.value?.isDisplayEarlyCheckIn;
    formPayment.value = { ...bookingDetails.value?.payment };
    formRoomInfo.value = { ...bookingDetails?.value?.roomInformation };
  }
};
const handleCheckOut = () => {
  checkOutFormRef.value?.validate().then((success: boolean) => {
    if (success) {
      $q.dialog({
        style: 'text-align: left',
        message: t('are_you_sure_check_out'),
        persistent: true,
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
      }).onOk(() => {
        const services = ref<IService[]>([]);
        rowsAdd.forEach((row: IRowAdd) => {
          services.value.push({
            productSn: row.product?.sn,
            quantity: row.quantity,
            createTime: row.createTime,
          });
        });
        rowsRemove.forEach((row: IRowRemove) => {
          services.value.push({
            bookingProductSn: row.bookingProductSn,
            deleteReason: row.deleteReason,
            quantity: row.quantity,
            productSn: row.productSn,
          });
        });
        const params = {
          bookingSn: bookingSn.value,
          bookingSourceSn: formRoomInfo.value.bookingSourceSn,
          note: formRoomInfo.value.note,
          extraFee: formPayment.value.extraFee,
          depositMethodSn: formPayment.value.depositMethodSn,
          paymentMethodSn: formPayment.value.paymentMethodSn,
          amountDeposit: formPayment.value.amountDeposit,
          discount: formPayment.value.discount,
          services: services.value,
        };
        checkOutMutation.mutate(params, {
          onSuccess: (data) => {
            if (data) {
              notifyUpdateSuccess();
              emits('checkOutSuccess');
            }
          },
        });
      });
    } else {
      return false;
    }
  });
};
const addNewProduct = async () => {
  if (dataProduct.value) {
    await rowsAdd.push({
      product: JSON.parse(JSON.stringify(dataProduct?.value[0])),
      productList: JSON.parse(JSON.stringify(dataProduct.value)),
      quantity: 1,
      createTime: Number(date.formatDate(Date.now(), 'X')),
    });
    const qTableScroll = document.querySelector('.q-table__middle');
    if (qTableScroll) {
      qTableScroll.scrollTo(0, qTableScroll?.scrollHeight);
    }
  } else {
    Notify.create({
      message: t('not_ser_yet'),
      position: 'top',
      type: 'negative',
      actions: [{ label: 'Dismiss', color: 'white' }],
    });
  }
};
const onRemoveSer = (
  productSn: number,
  quantity: number,
  deleteReason: string,
  sn: number,
  inx: number,
) => {
  delReasonFormRef.value?.validate().then((success: boolean) => {
    if (success) {
      rowsRemove.push({
        bookingProductSn: sn,
        deleteReason: deleteReason,
        productSn: productSn,
        quantity: quantity,
      });
      rowsAdd.forEach((cate: IRowAdd) => {
        cate.productList.forEach((prod: IRet) => {
          if (prod.sn === productSn) {
            cate.product.stock += quantity;
          }
        });
      });
      serRemove.push(sn);
      params.bookingProductSnExceptList = JSON.stringify(serRemove);
      rows.value.splice(inx, 1);
      reasonDialogVisible.value = false;
    } else {
      return false;
    }
  });
};
// const filterProduct = (val: string, update: (callbackFn: () => void) => void, index: number) => {
//   update(() => {
//     rowsAdd[index].productList = dataProduct?.value;
//   });
// };
const onChangeFees = () => {
  checkOutFormRef.value?.validate().then((success: boolean) => {
    if (success) {
      calculateBookingAmount();
    } else {
      return false;
    }
  });
};
// defineExpose
defineExpose<IReservationListDialog>({
  setupCheckOutDialog,
});
</script>
<template>
  <q-dialog v-model="dialogVisible" full-width full-height @hide="resetFormData">
    <q-card style="padding: 3px 0px 27px 27px" class="no-scroll custom-dialog-checkout">
      <q-bar class="bg-white q-mt-md q-mr-lg q-pa-none" style="padding-bottom: 11px">
        <div class="custom-title-dialog text-bold">{{ t('check_out') }}</div>
        <q-space />
        <q-btn v-close-popup dense flat icon="close"> </q-btn>
      </q-bar>
      <q-separator style="margin-right: 27px" />
      <q-card-section
        class="q-pa-none q-pb-md scroll q-pr-md"
        style="height: calc(100% - 97px); padding-top: 11px"
      >
        <div
          v-if="bookingDetailsFetching"
          class="full-width full-height q-mt-md column justify-center items-center q-py-md"
        >
          <q-spinner color="negative" :thickness="2" size="2em" />
          <span class="text-negative q-mt-md">Fetching booking details...</span>
        </div>
        <q-form v-else ref="checkOutFormRef" class="q-gutter-y-md q-ma-none q-mb-md">
          <div class="row q-my-sm">
            <div class="col-md-6 col-sm-6 col-xs-12 row">
              <div class="col-md-4 col-xs-4">
                <p>{{ t('guest_make') }}:</p>
              </div>
              <div class="col-md-8 col-xs-8">
                <p class="text-bold">
                  {{ formRoomInfo?.guest[0]?.fullName }}
                </p>
              </div>
              <div class="col-md-4 col-xs-4">
                <p>{{ t('arrival_date_time') }}:</p>
              </div>
              <div class="col-md-8 col-xs-8">
                <p class="text-weight-bold">
                  {{
                    date.formatDate(
                      new Date(Number(formRoomInfo?.checkInActual) * 1000),
                      FORMAT_DATE_TIME_UI,
                    )
                  }}
                </p>
              </div>
              <div class="col-md-4 col-xs-4">
                <p>{{ t('departure_date_time') }}:</p>
              </div>
              <div class="col-md-8 col-xs-8">
                <p class="text-weight-bold">
                  {{ date.formatDate(new Date(), 'DD/MM/YYYY HH:mm') }}
                </p>
              </div>
              <div class="col-md-4 col-xs-4">
                <p>{{ t('booking_type') }}:</p>
              </div>
              <div class="col-md-8 col-xs-8">
                <p class="text-bold">
                  {{ bookingType }}
                </p>
              </div>
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12 row">
              <div class="col-md-4 col-xs-4">
                <p>{{ t('booking_number') }}:</p>
              </div>
              <div class="col-md-8 col-xs-8">
                <p class="text-bold">
                  {{ formRoomInfo?.bookingNo }}
                </p>
              </div>
              <div class="col-md-4 col-xs-4">
                <p>{{ t('room') }}:</p>
              </div>
              <div class="col-md-8 col-xs-8">
                <p class="text-bold">
                  {{ formRoomInfo.roomTypeCode }} - {{ formRoomInfo?.roomName }}
                </p>
              </div>
              <div class="col-md-4 col-xs-4">
                <p>{{ t('booking_source') }}:</p>
              </div>
              <div class="col-md-8 col-xs-8">
                <p class="text-bold">
                  <q-select
                    v-model="formRoomInfo.bookingSourceSn"
                    :loading="useBookingSourcesFetching"
                    filled
                    dense
                    :options="bookingSourceOptions"
                    option-value="sn"
                    option-label="name"
                    map-options
                    emit-value
                    :label="t('select_source')"
                    clearable
                    behavior="menu"
                    input-class="overflow-hidden"
                    class="q-field--with-bottom custom-input-readonly"
                    input-style="overflow: hidden;"
                    :rules="bookingSourceRule"
                  />
                </p>
              </div>
            </div>
          </div>
          <q-separator />
          <q-card-section class="q-pa-none q-my-md">
            <p class="text-bold custom-font-size-title">
              {{ t('room_price') }}
            </p>
            <div class="bg-grey-2 q-pa-md rounded-borders">
              <div
                v-for="(item, index) in priceAdjustmentList"
                :key="index"
                class="row items-center justify-between text-body1"
              >
                <p class="q-ma-none q-mb-md">{{ item.title }}</p>
                <div>
                  <span class="q-mr-sm">{{ formatMoney(item.roomPrice) }}</span>
                  <span>VND</span>
                </div>
              </div>
              <q-separator class="q-my-md" />
              <div class="row items-center justify-between text-bold text-body1">
                <p class="q-ma-none">{{ t('total_room_price') }}</p>
                <p class="q-ma-none">
                  {{ formatMoney(formPayment.amountRoomPrice) }} <span>VND</span>
                </p>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none q-my-md">
            <div class="row">
              <p class="col-md-6 col-sm-12 text-bold custom-font-size-title inline-block">
                {{ t('service') }}
              </p>
              <div class="col-md-6 col-sm-12">
                <q-btn
                  v-if="!isShowCateSelect"
                  outline
                  no-caps
                  color="deep-orange-12"
                  class="bg-grey-1 float-right"
                  :label="t('add_new')"
                  icon="add_circle"
                  style="font-size: 12px"
                  @click="isShowCateSelect = true"
                />
                <q-select
                  v-else
                  v-model="params.categorySn"
                  filled
                  fill-input
                  class="ellipsis inline-block float-right"
                  :label="t('category_placeholder')"
                  input-debounce="200"
                  :options="dataCategory?.pages[0]"
                  dense
                  outlined
                  option-label="name"
                  option-value="sn"
                  emit-value
                  clearable
                  map-options
                  style="width: 220px"
                />
              </div>
            </div>
            <q-table
              v-if="rows?.length > 0 || rowsAdd?.length > 0"
              :rows="[...rows, ...rowsAdd]"
              :columns="columns"
              :table-colspan="9"
              row-key="index"
              class="scroll-table"
              dense
              no-data-label="t('not_ser_yet')"
              :virtual-scroll-item-size="48"
              :rows-per-page-options="[0]"
              hide-bottom
            >
              <template #header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    style="font-size: 14px; font-weight: bold; height: 42px"
                  >
                    {{ t(col.label) }}
                  </q-th>
                </q-tr>
              </template>
              <template #body="props">
                <q-tr class="vertical-top custom-table" :props="props">
                  <q-td key="index" :props="props">
                    <p>
                      {{ formatIndexTable(pagination.page, props.pageIndex) }}
                    </p>
                  </q-td>
                  <q-td key="product" :props="props">
                    <p v-if="props.row.productName" class="ellipsis" style="width: 300px">
                      {{ props.row.productName }}
                    </p>
                    <div v-else style="width: 250px">
                      <q-select
                        v-model="props.row.product"
                        class="q-mr-md"
                        :label="t('select_product')"
                        :options="props.row.productList"
                        dense
                        filled
                        outlined
                        map-options
                        option-label="name"
                        option-value="sn"
                        @update:model-value="props.row.quantity = 1"
                      />
                      <!-- <q-select
                        v-model="props.row.product"
                        class="q-mr-md"
                        label="Select product"
                        :options="props.row.productList"
                        dense
                        filled
                        use-chips
                        behavior="menu"
                        outlined
                        map-options
                        option-label="name"
                        option-value="sn"
                        fill-input
                        use-input
                        hide-selected
                        @filter="
                          (val, update) => {
                            filterProduct(val, update, Number(props.pageIndex - rows.length));
                          }
                        "
                        @input-value="setKeySearchCategoryModel"
                        @update:model-value="props.row.quantity = 1"
                      /> -->
                    </div>
                  </q-td>
                  <q-td key="quantity" :props="props">
                    <p v-if="props.row.productName">
                      {{ props.row.quantity }}
                    </p>
                    <div v-else>
                      <q-input
                        v-model="props.row.quantity"
                        outlined
                        dense
                        style="width: 150px"
                        input-class="text-center"
                      >
                        <template #prepend>
                          <q-btn
                            flat
                            round
                            color="grey-6"
                            icon="remove"
                            style="max-height: 10px"
                            :disable="props.row.quantity === 1"
                            @click="props.row.quantity--"
                          />
                        </template>
                        <template #append>
                          <q-btn
                            flat
                            round
                            color="grey-6"
                            icon="add"
                            style="max-height: 10px"
                            :disable="props.row.quantity === props.row.product.stock"
                            @click="props.row.quantity++"
                          />
                        </template>
                      </q-input>
                    </div>
                  </q-td>
                  <q-td key="unitPrice" :props="props">
                    <p v-if="!props.row.productName">
                      {{ formatMoney(props.row.product.price) }} VND
                    </p>
                    <p v-else>{{ formatMoney(props.row.unitPrice) }} VND</p>
                  </q-td>
                  <q-td key="totalPrice" :props="props">
                    <p v-if="!props.row.productName">
                      {{ formatMoney(props.row.quantity * props.row.product.price) }} VND
                    </p>
                    <p v-else>{{ formatMoney(props.row.quantity * props.row.unitPrice) }} VND</p>
                  </q-td>
                  <q-td key="createTime" :props="props">
                    <p v-if="props.row.productName">
                      {{
                        date.formatDate(
                          new Date(Number(props.row.createTime) * 1000.0),
                          FORMAT_DATE_TIME_UI,
                        )
                      }}
                    </p>
                    <p v-else>
                      {{
                        $date(new Date(Number(props.row.createTime) * 1000.0), FORMAT_DATE_TIME_UI)
                      }}
                    </p>
                  </q-td>
                  <q-td key="operations" :props="props">
                    <q-icon
                      v-if="props.row.productList"
                      name="delete"
                      color="grey-6"
                      icon="delete"
                      size="1.8em"
                      @click="rowsAdd.splice(Number(props.pageIndex - rows.length), 1)"
                    />
                    <q-icon
                      v-else
                      name="delete"
                      color="grey-6"
                      size="1.8em"
                      class="cursor-pointer"
                      @click="reasonDialogVisible = true"
                    >
                      <q-dialog
                        v-model="reasonDialogVisible"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-card class="q-pa-md">
                          <q-form
                            ref="delReasonFormRef"
                            @submit.prevent.stop="
                              onRemoveSer(
                                props.row.productSn,
                                props.row.quantity,
                                props.row.deleteReason,
                                props.row.sn,
                                props.pageIndex - rows.length,
                              )
                            "
                          >
                            <p>{{ t('delete_label_product') }}</p>
                            <q-input
                              v-model="props.row.deleteReason"
                              class="q-mb-sm"
                              outlined
                              dense
                              :placeholder="t('reason_placeholder')"
                              :rules="[
                                (val) => !!val || t('please_select_one_value'),
                                (val) =>
                                  val.length <= 200 || t('the_length_is_from_0_to_200_characters'),
                              ]"
                            />
                            <div class="text-right">
                              <q-btn
                                class="q-mr-sm"
                                outline
                                no-caps
                                color="grey-8"
                                :label="t('cancel')"
                                @click="reasonDialogVisible = false"
                              />
                              <q-btn type="submit" no-caps color="negative" :label="t('confirm')" />
                            </div>
                          </q-form>
                        </q-card>
                      </q-dialog>
                    </q-icon>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <div v-else class="text-center">
              {{ t('not_ser_yet') }}
            </div>
            <div class="row items-center justify-between text-bold bg-grey-2 q-pa-md q-my-md">
              <p class="q-ma-none">{{ t('total_services_amount') }}</p>
              <div>
                <span class="q-mr-sm">{{ formatMoney(serviceTotalPrice) }}</span>
                <span>VND</span>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none q-my-md">
            <p class="text-bold custom-font-size-title">
              {{ t('other_fees') }}
            </p>
            <div class="row">
              <div class="col-md-3 col-sm-6 col-xs-12">
                <p class="q-mb-xs">{{ t('extra_fee') }}</p>
                <q-field
                  v-model.number="formPayment.extraFee"
                  filled
                  dense
                  class="col q-pr-md"
                  suffix="VND"
                  debounce="500"
                  :rules="[
                    (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
                    (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
                  ]"
                  type="number"
                  @blur="inputActive.extraFee = false"
                  @focus="inputActive.extraFee = true"
                  @update:model-value="onChangeFees()"
                >
                  <template #control="{ id, floatingLabel, modelValue: modelExtra, emitValue }">
                    <input
                      v-show="floatingLabel"
                      :id="id"
                      class="q-field__input text-right"
                      :value="inputActive.extraFee ? modelExtra : formatMoney(modelExtra)"
                      @change="(e) => changeMoney(e, modelExtra, emitValue)"
                    />
                  </template>
                </q-field>
              </div>
              <div class="col-md-3 col-sm-6 col-xs-12">
                <p class="q-mb-xs">{{ t('discount') }}</p>
                <q-field
                  v-model.number="formPayment.discount"
                  filled
                  dense
                  class="col q-pr-md"
                  suffix="VND"
                  debounce="500"
                  :rules="[
                    (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
                    (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
                  ]"
                  @blur="inputActive.discount = false"
                  @focus="inputActive.discount = true"
                  @update:model-value="onChangeFees()"
                >
                  <template #control="{ id, floatingLabel, modelValue: modelDiscount, emitValue }">
                    <input
                      v-show="floatingLabel"
                      :id="id"
                      class="q-field__input text-right"
                      :value="inputActive.discount ? modelDiscount : formatMoney(modelDiscount)"
                      @change="(e) => changeMoney(e, modelDiscount, emitValue)"
                    />
                  </template>
                </q-field>
              </div>
              <div class="col-md-3 col-sm-6 col-xs-12">
                <p class="q-mb-xs">{{ t('deposit_method') }}</p>
                <q-select
                  v-model="formPayment.depositMethodSn"
                  class="q-mr-md q-mb-md"
                  :label="t('select_method')"
                  :options="depositList"
                  dense
                  filled
                  outlined
                  clearable
                  map-options
                  option-label="name"
                  option-value="value"
                  emit-value
                />
              </div>
              <div class="col-md-3 col-sm-6 col-xs-12">
                <p class="q-mb-xs">{{ t('deposit_amount') }}</p>
                <q-field
                  v-model.number="formPayment.amountDeposit"
                  filled
                  dense
                  class="col"
                  suffix="VND"
                  debounce="500"
                  :rules="depositAmountRule"
                  @blur="inputActive.amountDeposit = false"
                  @focus="inputActive.amountDeposit = true"
                  @update:model-value="onChangeFees()"
                >
                  <template #control="{ id, floatingLabel, modelValue: modelDiscount, emitValue }">
                    <input
                      v-show="floatingLabel"
                      :id="id"
                      class="q-field__input text-right"
                      :value="
                        inputActive.amountDeposit ? modelDiscount : formatMoney(modelDiscount)
                      "
                      @change="(e) => changeMoney(e, modelDiscount, emitValue)"
                    />
                  </template>
                </q-field>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none q-my-md">
            <p class="text-bold custom-font-size-title">
              {{ t('booking_note') }}
            </p>
            <q-input
              v-model="formRoomInfo.note"
              filled
              dense
              :placeholder="t('input_booking_note')"
              behavior="menu"
              :rules="[
                (val) => !val || val.length <= 200 || t('the_length_is_from_0_to_200_characters'),
              ]"
            />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none q-my-md">
            <p class="text-bold custom-font-size-title">
              {{ t('payment') }}
            </p>
            <div class="row">
              <div class="col-md-6 col-xs-12">
                <p class="q-mb-none">
                  {{ t('payment_method') }}
                </p>
                <q-select
                  v-model="formPayment.paymentMethodSn"
                  class="q-mr-md"
                  :label="t('select_payment_method')"
                  :options="depositList"
                  dense
                  filled
                  outlined
                  clearable
                  map-options
                  option-label="name"
                  option-value="value"
                  emit-value
                  :rules="[(val) => !!val || t('please_select_one_value')]"
                />
              </div>
              <div class="col-md-6 col-xs-12 payment-balance">
                <p
                  class="q-ma-none bg-deep-orange-1 text-negative rounded-borders q-pa-md text-weight-bold"
                >
                  {{ t('balance') }}
                  <span class="q-mr-sm float-right">{{ formatMoney(balanceTotalPrice) }} VND</span>
                </p>
              </div>
            </div>
            <p class="q-py-md">
              (*) {{ t('balance') }} = {{ t('total_room_price') }} +
              {{ t('total_services_amount') }} + {{ t('extra_fee') }} - {{ t('discount') }} -
              {{ t('deposit_amount') }}
            </p>
          </q-card-section>
        </q-form>
      </q-card-section>
      <q-card-actions
        align="right"
        class="bg-white text-teal text-right"
        style="padding-right: 27px"
      >
        <q-btn v-close-popup dense outline no-caps color="grey-8" style="padding: 8px 20px"
          >{{ t('cancel') }}
        </q-btn>
        <q-btn no-caps color="negative" style="padding: 8px 20px" @click="handleCheckOut">{{
          t('confirm_check_out')
        }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style lang="scss" scoped>
.custom-dialog-checkout {
  width: 962px !important;
  .custom-title-dialog {
    font-size: 20px;
    font-weight: 600;
  }
  .custom-padding-bottom {
    padding-top: 14px;
  }
}
.custom-font-size-title {
  font-size: 16px;
}
.custom-input-readonly :deep(.q-field__control) {
  overflow: hidden;
  &::before {
    border: none;
  }
}
.custom-input-readonly :deep(.q-field__control-container) {
  overflow: hidden;
}
.scroll-table {
  min-height: 115px;
  margin: 16px 0;
}
.payment-balance {
  height: 40px;
  margin-top: 20px;
  p {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 12spx;
  }
}
.check-out-form {
  max-height: 700px;
  @media only screen and (max-width: $breakpoint-xs) {
    height: 500px;
  }
}
.custom-table {
  padding: 8px 0;
  p {
    margin: 8px 0;
  }
  i {
    margin: 5px 0;
  }
}
</style>
