<template>
  <div v-if="dataFormValue" class="row col-12 col-md-12">
    <div class="col-md-2 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
      <p class="q-ma-none text-weight-bold">
        {{ t('category') }}
        <span>*</span>
      </p>
      <q-select
        ref="category"
        v-model="dataFormValue.categorySn"
        filled
        dense
        map-options
        :options="categoryOptions"
        emit-value
        :disable="isDisableView"
        option-value="sn"
        option-label="name"
        :label="t('select_category')"
        clearable
        behavior="menu"
        class="custom-input-readonly"
        :rules="categoryRules"
        @update:model-value="changeCategoryInfo(dataFormValue.categorySn)"
      ></q-select>
    </div>
    <div class="col-md-2 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
      <p class="q-ma-none text-weight-bold">{{ t('product') }}<span>*</span></p>
      <q-select
        ref="product"
        v-model="dataFormValue.productSn"
        filled
        dense
        map-options
        :disable="isDisableView"
        :options="productOptions"
        option-label="name"
        option-value="sn"
        class="custom-input-readonly"
        :label="t('select_product')"
        clearable
        :rules="productRules"
        @update:model-value="changeProductInfo(dataFormValue)"
      ></q-select>
    </div>
    <div class="col-md-2 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
      <p class="q-ma-none text-weight-bold">
        {{ t('unit') }}
      </p>
      <q-input
        ref="quantity"
        v-model="dataFormValue.productUnitName"
        disable
        filled
        dense
        lazy-rules
      ></q-input>
    </div>
    <div
      class="col-md-1 col-sm-6 col-xs-12 q-pa-sm q-px-sm"
      :class="isDisableView ? 'col-md-2' : ''"
    >
      <p class="q-ma-none text-weight-bold">{{ t('quantity') }}<span>*</span></p>
      <q-input
        ref="quantity"
        v-model="dataFormValue.quantity"
        filled
        :bg-color="isDisableView ? '' : 'grey-1'"
        dense
        :disable="isDisableView"
        lazy-rules
        :rules="quantityRules"
        @update:model-value="changeQuantityInfo()"
      ></q-input>
    </div>
    <div class="col-md-2 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
      <p class="q-ma-none text-weight-bold">
        {{ t('import_price') }}
      </p>
      <q-field
        v-model.number="dataFormValue.importPrice"
        filled
        dense
        :disable="isDisableView"
        class="col"
        :bg-color="isDisableView ? '' : 'grey-1'"
        suffix="VND"
        debounce="500"
        type="number"
        :rules="[
          (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
          (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
        ]"
        @blur="inputActive.importPrice = false"
        @focus="inputActive.importPrice = true"
        @update:model-value="inputPrice()"
      >
        <template #control="{ id, floatingLabel, modelValue: importPrice, emitValue }">
          <input
            v-show="floatingLabel"
            :id="id"
            class="q-field__input text-right"
            :value="inputActive.importPrice ? importPrice : formatMoney(importPrice)"
            @change="(e) => changeMoney(e, importPrice, emitValue)"
          />
        </template>
      </q-field>
    </div>
    <div class="col-md-2 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
      <p class="q-ma-none text-weight-bold">{{ t('total') }}</p>
      <q-field
        v-model.number="dataFormValue.total"
        filled
        dense
        class="col"
        disable
        suffix="VND"
        debounce="500"
        :rules="[
          (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
          (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
        ]"
      >
        <template #control="{ modelValue: toal }">
          <input class="q-field__input text-right" :value="formatMoney(toal)" />
        </template>
      </q-field>
    </div>
    <div
      v-show="!isDisableView && !isShowDeleteCreate"
      class="col-md-1 col-sm-2 col-xs-3 q-pa-sm q-px-sm"
    >
      <p class="q-ma-none text-weight-bold">&nbsp;</p>
      <q-btn
        dense
        round
        flat
        color="grey"
        class="float-right"
        icon="delete"
        @click="deleteImportStock()"
      >
        <q-tooltip>{{ t('delete') }}</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive, onMounted } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useProductMutation } from '../api/useProductMutation';
// import { useDeleteImportStockMutation } from '../api/useDeleteImportStockFormMutation';
import { formatMoney, changeMoney } from '~/composable/useFormat';
// category service
import { useCategoryServiceQuery } from '../api/useCategoryServiceQuery';
export interface Emits {
  (event: 'calculateAmoundStock'): void;
  (event: 'deleteImportStockView'): void;
}
import type { QInput, ValidationRule } from 'quasar';
const emits = defineEmits<Emits>();
interface Props {
  dataStock: any;
  view: number;
  index: number;
}
// const changeMoney = (e: Event, modelValue: string | number, emitValue: (val: string) => void) => {
//   return emitValue((e.target as HTMLInputElement).value);
// };
const displayProduct = ref<boolean>(false);
const mutationProduct = useProductMutation();
const props = defineProps<Props>();
const { t } = useI18n();
// const $q = useQuasar();
const dataFormValue = computed(() => {
  return props.dataStock;
});

// data
const isDisableView = ref<boolean>(false);
if (props.view === 1) {
  isDisableView.value = true;
}
// data
const isShowDeleteCreate = ref<boolean>(false);
if (props.index === 0) {
  isShowDeleteCreate.value = true;
}
if (!props.dataStock.categorySn) {
  displayProduct.value = true;
} else {
  mutationProduct.mutate(props.dataStock.categorySn, {
    onSuccess: (response: any) => {
      productOptions.value = response.data.productList;
    },
  });
}

// validation
const category = ref<QInput | null>(null);
const categoryRules: ValidationRule<string>[] = [(value) => !!value || t('this_field_is_required')];
const product = ref<QInput | null>(null);
const productRules: ValidationRule<string>[] = [(value) => !!value || t('this_field_is_required')];
const quantity = ref<QInput | null>(null);
const quantityRules: ValidationRule<number>[] = [(value) => value >= 1 || t('quantity_validate')];

const productOptions = ref<any>();
const inputActive = reactive({
  importPrice: false,
});
// category service
const { data: dataCategory } = useCategoryServiceQuery();
const categoryOptions = ref<any>();
// const categoryFilter = ref<any>();

watch(dataCategory, () => {
  if (dataCategory?.value?.pages[0]?.length > 0) {
    categoryOptions.value = dataCategory?.value?.pages[0];
  } else {
    categoryOptions.value = dataCategory?.value;
  }

  // if (categoryOptions.value[0].sn !== null) {
  //   categoryOptions.value.unshift({
  //     isProduct: false,
  //     name: 'Select category',
  //     sn: null,
  //     status: 1,
  //   });
  // }
});
onMounted(() => {
  if (dataCategory?.value?.pages[0]?.length > 0) {
    categoryOptions.value = dataCategory?.value?.pages[0];
  } else {
    categoryOptions.value = dataCategory?.value;
  }
});
// method
const deleteImportStock = () => {
  emits('deleteImportStockView');
};
const changeCategoryInfo = (categoryChoose: any) => {
  const categorySn = categoryChoose;
  dataFormValue.value.productSn = null;
  if (!categorySn) {
    return;
  }
  mutationProduct.mutate(categorySn as any, {
    onSuccess: (response: any) => {
      productOptions.value = response.data.productList;
      // productOptions.value.unshift({
      //   categorySn: null,
      //   name: 'Select product',
      //   price: 0,
      //   productUnitName: '',
      //   productUnitSn: null,
      //   sn: 0,
      //   status: 1,
      // });
    },
  });
};
const inputPrice = () => {
  checkEmitsCalculate();
};
const checkEmitsCalculate = async () => {
  if (
    !dataFormValue.value.categorySn ||
    !dataFormValue.value.productSn ||
    dataFormValue.value.quantity <= 0
  ) {
    return;
  }

  await emits('calculateAmoundStock');
};
const changeProductInfo = (val: any) => {
  if (!val?.productSn?.sn) {
    return;
  }
  dataFormValue.value.productSn = val.productSn.sn;
  checkEmitsCalculate();
};
const changeQuantityInfo = () => {
  checkEmitsCalculate();
};
</script>

<style lang="scss" scoped>
.custom-input-readonly :deep(span) {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;
  text-align: left;
}
.text-weight-bold {
  font-weight: bold;
}
</style>
