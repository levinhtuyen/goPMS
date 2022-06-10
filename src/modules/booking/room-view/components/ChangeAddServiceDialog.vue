<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { useAddServiceMutation } from '../apis/useAddServiceMutation';
import { useCategoryServiceQuery } from '../apis/useCategoryServiceQuery';
import { useCalculateAddServiceMutation } from '../apis/useCalculateAmountServiceQuery';
import { useProductHotelQuery } from '../apis/useProductHotelQuery';
import { useQuasar, date } from 'quasar';
import { useI18n } from '~/composable/useI18n';
import { LS_PROFILE } from '~/constants';
import { formatMoney } from '~/composable/useFormat';
import { i18n } from '~/plugins/i18n';
import { useNotify } from '~/composable/useNotify';

const { notifyUpdateSuccess } = useNotify();
interface IItemProduct {
  sn: number;
  productName: string;
  productPrice: number;
  productUnitName: string;
  startInventory: number;
  importQuantity: number;
  exportQuantity: number;
  lastInventory: number;
  quantity: number;
}
const formData = reactive({
  sn: 0 as number,
  checkIn: '' as string,
  checkOut: '' as string,
  number: 0 as number | null,
  totalPrice: 0 as number,
});

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'addServices', value: boolean): void;
  (e: 'changeSuccess'): void;
  (e: 'closeDialog'): void;
}
// const $date = date.formatDate;
const $q = useQuasar();
const link = ref<string>();
interface Props {
  modelValue: boolean;
  isRoomView: boolean;
  bookingProductSnDeleteList: any;
  roomName: string;
}
const addServicesRef = ref<HTMLFormElement>();
// prop, emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
// data
// const router = useRouter();

const params = reactive<any>({
  categorySn: '',
  keyword: '',
  bookingProductSnExceptList: '',
  isProductActive: 1,
  isAddServiceOrderBy: 1,
  limit: -1,
  notDeletedYet: 1,
  bookingProductSnDeleteList: JSON.stringify(props.bookingProductSnDeleteList),
});
const mutationAddService = useAddServiceMutation();
const mutationCalculate = useCalculateAddServiceMutation();
let {
  data: formListProduct,
  isLoading: loadingProductHotel,
  refetch: refetchProductHotel,
} = useProductHotelQuery(params);

const roomName = ref<string | null>('');

const { t } = useI18n();

// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emits('update:modelValue', value);
  },
});

// methods
const setupAddServiceDialog = async (bookingSn: number, bookingNo: string | null) => {
  refetchProductHotel.value();
  formData.sn = bookingSn;
  roomName.value = bookingNo;
};

const selectProduct = ref<any>([]);
const selectProductService = (item: IItemProduct) => {
  let itemSelect = {
    exportQuantity: item.exportQuantity,
    importQuantity: item.importQuantity,
    lastInventory: item.lastInventory,
    productName: item.productName,
    productPrice: item.productPrice,
    productUnitName: item.productUnitName,
    sn: item.sn,
    startInventory: item.startInventory,
    quantity: 1,
  };
  refetchProductHotel.value();
  item.quantity = 1;
  if (!item) {
    return;
  }
  let doub = 0;
  selectProduct.value.forEach((val: IItemProduct) => {
    if (itemSelect.sn === val.sn) {
      doub = 1;
    }
  });
  if (doub === 0) {
    selectProduct?.value?.length > 0
      ? (selectProduct.value = [...selectProduct.value, { ...itemSelect }])
      : (selectProduct.value = [{ ...itemSelect }]);
  }
  getCalculateAmoundProduct();
};
const { data: dataCategory, refetch: refetchCategory } = useCategoryServiceQuery();

// category service
const categoryOptions = ref<any>([]);
categoryOptions.value = dataCategory.value;

watch(dataCategory, () => {
  categoryOptions.value = dataCategory.value;
  if (categoryOptions?.value?.length > 0) {
    categoryOptions.value.unshift({
      isProduct: false,
      name: t('all_categories'),
      sn: '',
      status: 1,
    });
  } else if (dataCategory?.value?.pages[0]?.length > 0) {
    categoryOptions.value = dataCategory?.value?.pages[0];
    categoryOptions.value.unshift({
      isProduct: false,
      name: t('all_categories'),
      sn: '',
      status: 1,
    });
  } else {
    categoryOptions.value = [
      {
        isProduct: false,
        name: t('all_categories'),
        sn: '',
        status: 1,
      },
    ];
  }
});
onMounted(() => {
  refetchCategory.value();
  if (categoryOptions?.value?.length > 0) {
    if (!dataCategory.value) {
      categoryOptions.value = [
        {
          isProduct: false,
          name: t('all_categories'),
          sn: '',
          status: 1,
        },
      ];
      return;
    }
    categoryOptions.value.unshift({
      isProduct: false,
      name: t('all_categories'),
      sn: '',
      status: 1,
    });
  } else if (dataCategory?.value?.pages[0]?.length > 0) {
    if (!dataCategory.value) {
      categoryOptions.value = [
        {
          isProduct: false,
          name: t('all_categories'),
          sn: '',
          status: 1,
        },
      ];
      return;
    }
    categoryOptions.value = dataCategory?.value?.pages[0];
    categoryOptions.value.unshift({
      isProduct: false,
      name: t('all_categories'),
      sn: '',
      status: 1,
    });
  } else {
    categoryOptions.value = [
      {
        isProduct: false,
        name: t('all_categories'),
        sn: '',
        status: 1,
      },
    ];
  }
});
const language = ref('');
watch(
  () => (i18n.global.locale as any).value,
  (val) => {
    language.value = val;
    categoryOptions.value[0] = {
      isProduct: false,
      name: t('all_categories'),
      sn: '',
      status: 1,
    };
  },
);
const onDialogHide = () => {
  selectProduct.value = [];
  params.keyword = '';
  params.categorySn = '';
  formData.totalPrice = 0;
  emits('closeDialog');
};
const deleteProduct = (item: IItemProduct) => {
  selectProduct.value = selectProduct?.value?.filter(function (itemF: IItemProduct) {
    return itemF.sn !== item.sn;
  });
  if (selectProduct.value?.length > 0) {
    getCalculateAmoundProduct();
  } else {
    formData.totalPrice = 0;
  }
};
const addServicesRoomView = (bookingSn: number) => {
  let dataJsonRoom = {
    bookingSn: bookingSn,
    addService: selectProduct.value,
  };
  emits('closeDialog');

  if (dataJsonRoom?.addService?.length > 0) {
    mutationAddService.mutate(dataJsonRoom, {
      onSuccess: (response: any) => {
        if (response?.code === 1) {
          notifyUpdateSuccess();
          setTimeout(() => {
            emits('changeSuccess');
          }, 600);
        }
      },
    });
  }
};

const addServicesEditBooking = () => {
  const userName = JSON.parse(localStorage.getItem(LS_PROFILE) || '{}')?.value?.fullName;

  const now = ref<number>(Date.now());

  selectProduct.value.map(function (itemF: any) {
    itemF.createTime = ref(Number(date.formatDate(now.value, 'X')));
    itemF.createBy = userName;
    itemF.sn = null;
    itemF.unitPrice = itemF.productPrice;
    itemF.totalPrice = itemF.productPrice * itemF.quantity;
  });
  emits('addServices', selectProduct.value);
  $q.notify({
    message: t('create_success'),
    position: 'top',
    type: 'positive',
    actions: [{ color: 'white' }],
  });
  setTimeout(() => {
    emits('changeSuccess');
  }, 600);
};
const addToTheBooking = (bookingSn: number) => {
  addServicesRef.value?.validate().then((success: boolean) => {
    if (!success) {
      return false;
    } else {
      props.isRoomView === true ? addServicesRoomView(bookingSn) : addServicesEditBooking();
    }
  });
  // changeStayDateMutation.mutate(() => {});
};
const getCalculateAmoundProduct = () => {
  const dataJson = {
    service: [...selectProduct.value],
  };
  dataJson.service.forEach((val: any) => {
    val.productSn = Number(val.sn);
    val.quantity = Number(val.quantity);
  });
  if (dataJson.service.length > 0) {
    mutationCalculate.mutate(dataJson as any, {
      onSuccess: (response: any) => {
        formData.totalPrice = response.data.totalPrice ? response.data.totalPrice : 0;
        selectProduct.value = response.data.serviceList;
      },
    });
  } else {
    selectProduct.value.importStock.totalPrice = 0;
  }
};
const changeQuantityInfo = (quantity: number) => {
  if (!quantity) {
    return;
  }
  getCalculateAmoundProduct();
};
// defineExpose
defineExpose({
  setupAddServiceDialog,
});
</script>
<template>
  <q-dialog v-model="dialogVisible" full-width @hide="onDialogHide">
    <q-card style="padding: 0 32px 24px 32px; width: 486px">
      <q-bar class="bg-white q-my-md q-mr-sm q-pa-none">
        <div class="text-h5 text-bold">
          {{ t('add_services') }}
          <span v-if="props.isRoomView">- {{ roomName }}</span>
          <span v-else>- {{ props.roomName }}</span>
        </div>
        <q-space />
        <q-btn v-close-popup dense flat icon="close"> </q-btn>
      </q-bar>
      <q-form ref="addServicesRef">
        <q-card-section class="q-pa-none q-py-md">
          <div class="row items-center q-mt-md">
            <div class="col-md-6 col-sm-6 col-xs-12">
              <q-input
                v-model="params.keyword"
                outlined
                dense
                class="col-5 rounded-borders q-ma-xs"
                debounce="300"
                :placeholder="t('search_by_products_name')"
              >
                <template #prepend>
                  <q-icon name="search"></q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-md-3 col-sm-4 col-xs-12 q-ma-xs">
              <q-select
                ref="country"
                v-model="params.categorySn"
                dense
                emit-value
                class="q-pl-sm custom-select-category"
                :options="categoryOptions"
                filled
                map-options
                option-value="sn"
                option-label="name"
              >
              </q-select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 col-xs-12 q-pt-md style-bd-r">
              <div class="card-product">
                <div
                  class="card-product__header-left q-card__section q-card__section--vert bg-negative q-pa-sm"
                >
                  <div class="text-subtitle1 text-white text-bold q-pl-md">{{ t('product') }}</div>
                </div>
              </div>
              <div class="item-product row items-baseline justify-between"></div>

              <div class="height-product">
                <div v-if="loadingProductHotel" class="style-scroll-product">
                  <q-inner-loading :showing="loadingProductHotel">
                    <div lass="full-width full-height q-mt-md row justify-center">
                      <q-spinner color="negative" :thickness="2" size="2em" />
                    </div>
                  </q-inner-loading>
                </div>
                <q-list v-else bordered padding class="style-scroll-product">
                  <q-item
                    v-for="(item, index) in formListProduct"
                    :key="index"
                    :clickable="item.lastInventory > 0 ? true : false"
                    :active="link === item.sn"
                    class="custom-list-section"
                    @click="(link = item.sn), selectProductService(item)"
                  >
                    <q-item-section>
                      <div class="row items-center">
                        <div
                          class="limit-text text-bold"
                          :class="item.lastInventory > 0 ? '' : 'custom-disable'"
                        >
                          {{ item.productName }}
                          <q-tooltip anchor="bottom middle" self="top middle">
                            <div class="text-bold">
                              {{ item.productName }} <br />
                              {{ t('quantity') }} : {{ item.lastInventory }}
                            </div>
                          </q-tooltip>
                        </div>
                        <div>
                          <q-icon
                            v-show="item.lastInventory > 0 ? false : true"
                            name="warning"
                            color="deep-orange-10"
                            size="1rem"
                            ><q-tooltip anchor="bottom middle" self="top middle">
                              <div class="text-bold">
                                <b>{{ t('out_of_stock') }}</b>
                              </div>
                            </q-tooltip></q-icon
                          >
                        </div>
                      </div>
                    </q-item-section>

                    <q-item-section>
                      <div
                        class="q-card__section text-bold text-right"
                        :class="item.lastInventory > 0 ? '' : 'custom-disable'"
                      >
                        {{ formatMoney(item.productPrice) }} VND
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>

            <div class="col-md-6 col-sm-12 col-xs-12 q-pt-md">
              <div class="card-product">
                <div
                  class="card-product__header-right q-card__section q-card__section--vert bg-negative q-pa-sm"
                >
                  <div class="is-text-header text-subtitle1 text-white text-bold q-pl-md">
                    {{ t('selected_products') }}
                  </div>
                </div>
                <div class="height-product">
                  <div class="style-scroll-product">
                    <div
                      v-for="(product, index) in selectProduct"
                      :key="index"
                      class="row justify-between"
                    >
                      <div class="q-card__section col-md-5 col-sm-5 col-xs-12">
                        <div class="q-pa-sm text-weight-500">
                          <div class="row justify-between">
                            <div class="limit-text" style="font-size: 14px">
                              {{ product.productName }}
                              <q-tooltip
                                >{{ product.productName }} <br />
                                {{ t('quantity') }} : {{ product.lastInventory }}
                              </q-tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row q-card__section col-md-7 col-sm-7 col-xs-12 justify-end">
                        <q-input
                          ref="quantity"
                          v-model.number="product.quantity"
                          class="custom-input-readonly col-md-6 col-sm-12 col-xs-12"
                          :rules="[
                            (val) => val > 0 || t('min_0'),
                            (val) =>
                              val <= product.lastInventory ||
                              'max' + ` <= ` + product.lastInventory,
                          ]"
                          type="number"
                          @update:model-value="changeQuantityInfo(product.quantity)"
                        />
                        <div
                          class="q-pa-sm text-weight-500 col-md-6 col-sm-7 col-xs-12 items-end"
                          style="text-align: right"
                        >
                          {{ formatMoney(product.total) }} VND
                        </div>
                        <q-btn
                          dense
                          round
                          flat
                          color="grey"
                          class="q-mb-md"
                          icon="delete"
                          @click="deleteProduct(product)"
                        >
                          <q-tooltip>{{ t('delete') }}</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal text-right">
          <div class="col-md-6 col-sm-12 col-xs-12"></div>
          <div class="col-md-6 col-sm-12 col-xs-12">
            <div class="row style-input-total text-bold q-mb-md">
              <div class="col-md-6 col-sm-6 col-xs-6">
                <p style="float: left">{{ t('total_amount') }}</p>
              </div>
              <div class="col-md-6 col-sm-6 col-xs-6">
                <p>{{ formatMoney(formData.totalPrice) }} VND</p>
              </div>
            </div>

            <q-btn
              style="width: 100%; border-radius: 12px"
              class="float-right"
              color="negative"
              :label="t('add_to_the_booking')"
              rounded
              icon="add_circle"
              @click="addToTheBooking(formData.sn)"
            />
          </div>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<style lang="scss" scoped>
.custom-input-readonly {
  width: 100px;
}
.custom-input-readonly :deep(.q-field__control) {
  height: 30px;
}
.custom-disable {
  color: #a1a1aa;
}
.q-list--padding {
  padding: 0;
}
.q-item {
  min-height: 30px;
}
.style-bd-r {
  border-right: 1px solid #fff;
}
.item-product {
  cursor: pointer;
}
.text-weight-600 {
  font-weight: 600;
}

.text-weight-500 {
  font-weight: 500;
}
.limit-text {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 180px;
}
.card-product {
  vertical-align: top;
  background: #fff;
  position: relative;
  &__header-left {
    border-top-left-radius: 10px;
  }
  &__header-right {
    border-top-right-radius: 10px;
  }
}
.custom-select-category :deep(span) {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;
  text-align: left;
}
.style-input-total {
  background: #ffebee !important;
  width: auto;
  min-width: 0;
  max-width: 100%;
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  line-height: 1;
  color: red;
  padding: 8px 12px 0;
  backface-visibility: hidden;
  height: 40px;
  display: flex;
  justify-content: right;
  align-items: center;
}
.style-scroll-product {
  height: 100%;
  overflow-x: scroll;
  @media only screen and (max-width: 600px) {
    height: auto;
    overflow: unset;
  }
}
.height-product {
  height: 45vh;
  @media only screen and (max-width: 600px) {
    height: auto;
  }
}
</style>
