<template>
  <q-form ref="addProductFormRef">
    <q-card-section class="row">
      <div class="col-12 col-sm-6 col-md-8 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('product_name') }}*</p>
        <q-input
          v-model="formValues.name"
          filled
          dense
          :placeholder="t('input_product_name')"
          lazy-rules
          :rules="[...isRequiredRules, ...isLengthFrom1To100Rules]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('product_status') }}</p>
        <q-toggle v-model="formValues.status" :false-value="0" :true-value="1" color="negative" />
      </div>
      <div class="col-12 col-sm-6 col-md-8 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('unit_price') }}*</p>
        <q-field
          v-model.number="formValues.price"
          filled
          dense
          class="col"
          suffix="VND"
          debounce="500"
          :rules="[
            (val) => typeof val === 'number' || t('please_enter_numeric_value'),
            ...isValueMoneyRules,
          ]"
          type="number"
          @blur="inputActive.price = false"
          @focus="inputActive.price = true"
        >
          <template #control="{ id, modelValue, emitValue }">
            <input
              :id="id"
              class="q-field__input text-right"
              :value="inputActive.price ? modelValue : formatMoney(modelValue)"
              @change="(e) => changeMoney(e, modelValue, emitValue)"
            />
          </template>
        </q-field>
      </div>
      <div class="col-12 col-sm-6 col-md-4 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('unit') }}</p>
        <q-select
          v-model="modelUnit"
          filled
          use-input
          hide-selected
          fill-input
          input-debounce="200"
          :options="optionsUnit"
          option-label="name"
          option-value="sn"
          dense
          :placeholder="t('input_unit')"
          clearable
          @filter="filterFn"
          @input-value="setModelUnit"
          @update:model-value="changeModelUnit"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-12 col-md-12 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('category') }}*</p>
        <q-select
          v-model="formValues.categorySn"
          filled
          dense
          :label="t('select_category')"
          map-options
          option-label="name"
          option-value="sn"
          :options="dataCategory"
          emit-value
          :rules="isRequiredRules"
        />
      </div>
    </q-card-section>
  </q-form>
  <div class="col-12 col-md-12 row justify-end q-px-lg q-pb-md q-gutter-sm">
    <q-btn
      v-close-popup
      :label="t('cancel')"
      dense
      outline
      no-caps
      color="grey-8"
      style="padding: 8px 20px"
    />
    <q-btn
      :label="t('save')"
      class="q-px-lg"
      :loading="isLoading"
      type="submit"
      color="negative"
      no-caps
      @click="onSubmit"
    />
  </div>
</template>

<script lang="ts">
import { ref, computed, watchEffect, reactive } from 'vue';
import { useI18n } from '~/composable/useI18n';
import {
  useCreateProductServiceMutation,
  IProductServiceMutationParams,
} from '../apis/useCreateProductServiceMutation';
import { useNotify } from '~/composable/useNotify';
import { formatMoney, changeMoney } from '~/composable/useFormat';
import { useProductUnitQuery } from '../apis/useProductUnitQuery';
import { useCategoryServiceGetAllQuery } from '../apis/useCategoryServiceGetAllQuery';
import { useRule } from '~/composable/useValidate';

export default {
  props: {
    openCreateStaffModal: {
      type: Boolean,
      default: false,
    },
    categorySnDetail: {
      type: Number,
      default: 0,
    },
  },
  emits: ['reset'],
  setup(props: any, context: any) {
    const { t } = useI18n();
    const addProductFormRef = ref<HTMLFormElement>();
    const { notifySaveSuccess } = useNotify();

    // unit list service
    const keywordUnit = ref<string>('');
    const { data: unitOptions } = useProductUnitQuery(keywordUnit);

    const modelUnit = ref('');
    const optionsUnit = ref(unitOptions);

    const formValues = ref<IProductServiceMutationParams>({
      categorySn: 0,
      name: '',
      price: 0,
      status: 1,
      productUnitName: '',
    });

    const filterFn = (val: string, update: (callbackFn: () => void) => void) => {
      formValues.value.productUnitName = val;
      keywordUnit.value = val;

      update(() => {
        // );
      });
    };

    const inputActive = reactive({
      price: false,
    });

    const setModelUnit = (val: string) => {
      formValues.value.productUnitName = val;
      keywordUnit.value = val;
      modelUnit.value = val;
    };

    const changeModelUnit = (val: any) => {
      modelUnit.value = val || 0;
    };
    // category service
    const { data: dataCategory, isFetching: isFetchingCategory } = useCategoryServiceGetAllQuery();

    const { mutate, isLoading } = useCreateProductServiceMutation();

    const openStaffModalComputed = computed(() => props.openCreateStaffModal);

    watchEffect(() => {
      formValues.value.categorySn =
        props.categorySnDetail != 0 ? props.categorySnDetail : dataCategory?.value?.[0].sn;
    });

    const setModel = (val: number) => {
      formValues.value.price = val;
    };

    const { isRequiredRules, isLengthFrom1To100Rules, isValueMoneyRules } = useRule();

    const onSubmit = () => {
      addProductFormRef.value?.validate().then((success: boolean) => {
        if (success) {
          mutate(formValues.value, {
            onSuccess: () => {
              notifySaveSuccess();
              setTimeout(() => {
                context.emit('reset', false);
              }, 400);
            },
          });
        } else {
          return false;
        }
      });
    };

    return {
      onSubmit,
      openStaffModalComputed,
      t,

      isRequiredRules,
      isLengthFrom1To100Rules,
      isValueMoneyRules,

      formValues,
      isLoading,
      formatMoney,
      changeMoney,
      setModel,

      // list unit
      unitOptions,
      filterFn,
      keywordUnit,
      setModelUnit,
      changeModelUnit,
      modelUnit,
      optionsUnit,

      // list category
      dataCategory,
      isFetchingCategory,
      addProductFormRef,
      inputActive,
    };
  },
};
</script>
