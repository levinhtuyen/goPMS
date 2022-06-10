<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md">
        <div class="text-h5 text-bold">{{ t('cashiering') }}</div>
      </div>
    </template>
    <div class="row q-col-gutter-lg">
      <!-- Categories -->
      <div class="col-12 col-md-3">
        <q-banner inline-actions rounded class="bg-negative text-white">
          <b>{{ t('categories') }}</b>
        </q-banner>
        <q-scroll-area
          :visible="visible"
          style="height: 100px"
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
        >
          <q-infinite-scroll :offset="50">
            <div v-for="(item, index) in categoryOptions" :key="index" class="caption bg-white">
              <q-list padding>
                <q-item
                  clickable
                  :class="
                    categoryOptions[0].value == item.value && categorySn == 1 ? 'active-link' : ''
                  "
                  :active="categorySn === item.value"
                  active-class="active-link"
                  @click="onChangeProducts(item.value)"
                >
                  <q-item-section>
                    <strong>{{ t(item.key) }}</strong>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-infinite-scroll>
        </q-scroll-area>
      </div>

      <!-- Products -->

      <div class="col-12 col-md-9">
        <q-banner inline-actions rounded class="bg-negative text-white">
          <b>{{ t('receipt_types') }}</b>

          <template #action>
            <q-btn
              push
              color="white"
              text-color="negative"
              :label="t('receipt_type')"
              icon="add"
              dense
              :class="hasPermission('add-edit-delete-receipt-types') === false ? 'hidden' : ''"
              no-caps
              @click="openInputNewReceiptTypes"
            >
            </q-btn>
          </template>
        </q-banner>

        <q-scroll-area
          :visible="visible"
          style="height: 600px"
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
        >
          <q-inner-loading
            :showing="isLoading"
            label="Please"
            label-class="text-teal"
            label-style="font-size:1.1em"
          >
            <div lass="full-width" full-height class="q-mt-md row justify-center">
              <q-spinner color="negative" :thickness="2" size="2em" />
            </div>
          </q-inner-loading>

          <div class="caption">
            <q-input
              v-if="ui.isShowInputCreateReceiptTypes"
              ref="receiptTypeCreateField"
              v-model="formValues.name"
              :class="hasPermission('add-edit-delete-receipt-types') === false ? 'hidden' : ''"
              borderless
              autofocus
              dense
              :error="!isReceiptTypeCreateRules && formValues.name != ''"
              class="full-width q-py-sm q-px-md"
              :placeholder="t('input_receipt_type_name')"
              @blur="onSubmitCreateReceiptTypes"
              @keydown.enter.prevent="onSubmitCreateReceiptTypes"
              @keydown.esc.prevent="onCancelSubmitCreateReceiptTypes"
              @keydown.tab.prevent="onCancelSubmitCreateReceiptTypes"
            >
              <template #error>
                <p v-if="formValues.name.length > 50" class="text-left">
                  {{ t('the_length_is_from_1_to_50_characters') }}
                </p>
              </template>
            </q-input>
          </div>

          <q-infinite-scroll v-if="data" :offset="50">
            <div
              v-if="
                categorySn == 1
                  ? data[0].receiptTypeList.length > 0
                  : data[1].receiptTypeList.length > 0
              "
            >
              <div
                v-for="(item, index) in categorySn == 1
                  ? data[0].receiptTypeList
                  : data[1].receiptTypeList"
                :key="index"
                class="caption bg-white text-bold"
              >
                <q-list>
                  <q-item>
                    <q-input
                      v-if="isShowInputEditReceiptTypes == item.sn"
                      ref="receiptTypeEditField"
                      v-model="nameReceiptType"
                      :class="
                        hasPermission('add-edit-delete-receipt-types') === false ? 'hidden' : ''
                      "
                      borderless
                      autofocus
                      dense
                      :error="!isReceiptTypeEditRules"
                      class="full-width"
                      :placeholder="t('input_receipt_type_name')"
                      @blur="onSubmitEditReceiptTypes(item)"
                      @keydown.enter.prevent="onSubmitEditReceiptTypes(item)"
                      @keydown.esc.prevent="onCancelSubmitEditReceiptTypes"
                      @keydown.tab.prevent="onCancelSubmitEditReceiptTypes"
                    >
                      <template #error>
                        <p v-if="!nameReceiptType" class="text-left">
                          {{ t('this_field_is_required') }}
                        </p>
                        <p v-else-if="nameReceiptType.length > 50" class="text-left">
                          {{ t('the_length_is_from_1_to_50_characters') }}
                        </p>
                      </template>
                    </q-input>

                    <q-item-section v-else>
                      <div class="row justify-between items-center">
                        <div class="q-md-2">
                          {{ item.name }}
                        </div>

                        <div
                          v-if="item.sn != 1 && item.sn != 2 && item.sn != 3"
                          class="text-grey-8 q-gutter-xs"
                        >
                          <q-btn
                            class="gt-xs"
                            size="12px"
                            flat
                            dense
                            :class="
                              hasPermission('add-edit-delete-receipt-types') === false
                                ? 'hidden'
                                : ''
                            "
                            round
                            icon="edit"
                            @click="onEditReceiptTypes(item)"
                          />
                          <q-btn
                            class="gt-xs"
                            size="12px"
                            flat
                            dense
                            :class="
                              hasPermission('add-edit-delete-receipt-types') === false
                                ? 'hidden'
                                : ''
                            "
                            round
                            icon="delete"
                            @click="onRemoveReceiptTypes(item.sn)"
                          />
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>

            <div v-else full-height class="q-mt-md row justify-center full-width">
              {{ t('no_data') }}
            </div>
          </q-infinite-scroll>
        </q-scroll-area>
      </div>
    </div>

    <!-- POPUP ACTIVE PRODUCT -->
    <q-dialog v-model="ui.openDialogRemoveReceiptTypes">
      <q-card class="q-pa-lg">
        <div align="center">
          <p class="text-bold">{{ t('are_you_sure_you_want_to_delete_this_receipt_type') }}</p>
        </div>
        <div align="right" class="q-gutter-sm">
          <q-btn
            v-close-popup
            :label="t('cancel')"
            class="q-px-sm"
            dense
            outline
            no-caps
            color="grey-8"
          />
          <q-btn
            :label="t('confirm')"
            color="negative"
            style="width: 100px"
            dense
            no-caps
            @click="onConfirmRemoveReceiptTypePopup"
          />
        </div>
      </q-card>
    </q-dialog>
    <!-- END POPUP ACTIVE PRODUCT -->
  </pms-sections>
</template>

<script lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { formatMoney } from '~/composable/useFormat';
import { useReceiptTypeQuery } from './apis/useReceiptTypeQuery';
import { useCreateReceiptTypeMutation } from './apis/useCreateReceiptTypeMutation';
import { useUpdateReceiptTypeMutation } from './apis/useUpdateReceiptTypeMutation';
import { useRemoveReceiptTypeMutation } from './apis/useRemoveReceiptTypeMutation';
import { useNotify } from '~/composable/useNotify';
import type { QInput } from 'quasar';
import { useAuth } from '~/composable/useAuth';
import { i18n } from '~/plugins/i18n';

export default {
  setup() {
    const { t } = useI18n();
    const { notifyUpdateSuccess, notifySaveSuccess } = useNotify();
    const { hasPermission } = useAuth();
    const visible = ref(true);
    const categorySn = ref(1);

    const ui = reactive({
      isShowInputCreateReceiptTypes: false,
      openDialogRemoveReceiptTypes: false,
      isSubmitCreateReceiptType: false,
    });

    const isShowInputEditReceiptTypes = ref();

    const nameReceiptType = ref('');
    const dataSnRemove = ref();

    const categoryOptions = ref([
      { key: 'cashiering_cash_receipt', value: 1 },
      { key: 'cashiering_cash_payment', value: 2 },
    ]);

    const onChangeProducts = (index: number) => {
      categorySn.value = index;
      ui.isShowInputCreateReceiptTypes = false;
    };

    const { data, isLoading, refetch: refetchReceiptType } = useReceiptTypeQuery();
    const { mutate: mutateCreateReceiptType } = useCreateReceiptTypeMutation();
    const { mutate: mutateUpdateReceiptType } = useUpdateReceiptTypeMutation();
    const { mutate: removeReceiptType } = useRemoveReceiptTypeMutation();

    interface IReceiptTypesMutationParams {
      name: string;
    }

    const formValues = ref<IReceiptTypesMutationParams>({
      name: '',
    });

    const receiptTypeCreateField = ref<QInput | null>(null);
    const isReceiptTypeCreateRules = computed(
      () => !!formValues.value?.name && formValues.value?.name.length <= 50,
    );

    const receiptTypeEditField = ref<QInput | null>(null);
    const isReceiptTypeEditRules = computed(
      () => !!nameReceiptType.value && nameReceiptType.value.length <= 50,
    );

    // Handle Create
    const openInputNewReceiptTypes = () => {
      clearDataFieldReceiptTypes();
      ui.isShowInputCreateReceiptTypes = true;
    };

    const onCancelSubmitEditReceiptTypes = () => {
      isShowInputEditReceiptTypes.value = 0;
    };

    const onCancelSubmitCreateReceiptTypes = () => {
      clearDataFieldReceiptTypes();
      ui.isShowInputCreateReceiptTypes = false;
    };

    const onSubmitCreateReceiptTypes = () => {
      ui.isSubmitCreateReceiptType = true;
      ui.isShowInputCreateReceiptTypes = true;

      if (formValues.value.name == '') {
        clearUiReceiptTypes();
      } else if (!isReceiptTypeCreateRules.value) {
        return false;
      } else {
        ui.isShowInputCreateReceiptTypes = false;
        mutateCreateReceiptType(
          { cashieringCategorySn: categorySn.value, name: formValues.value.name },
          {
            onSuccess: () => {
              notifySaveSuccess();
              clearDataFieldReceiptTypes();
            },
          },
        );
      }
    };

    watch(
      () => (i18n.global.locale as any).value,
      () => {
        refetchReceiptType.value();
      },
    );

    const clearDataFieldReceiptTypes = () => {
      formValues.value.name = '';
    };

    const clearUiReceiptTypes = () => {
      ui.isSubmitCreateReceiptType = false;
      ui.isShowInputCreateReceiptTypes = false;
    };

    // Handle Edit
    const onEditReceiptTypes = (item: any) => {
      isShowInputEditReceiptTypes.value = item.sn;
      nameReceiptType.value = item.name;
    };

    const onSubmitEditReceiptTypes = (item: any) => {
      if (item.name == nameReceiptType.value) {
        isShowInputEditReceiptTypes.value = false;
        return false;
      } else if (!isReceiptTypeEditRules.value) {
        return false;
      } else {
        mutateUpdateReceiptType(
          { sn: item.sn, name: nameReceiptType.value },
          {
            onSuccess: () => {
              notifyUpdateSuccess();
              isShowInputEditReceiptTypes.value = false;
            },
          },
        );
      }
    };

    // Handle Remove
    const onRemoveReceiptTypes = (item: number) => {
      ui.openDialogRemoveReceiptTypes = true;
      dataSnRemove.value = item;
    };

    const onConfirmRemoveReceiptTypePopup = () => {
      removeReceiptType(
        {
          sn: dataSnRemove.value,
        },
        {
          onSuccess: () => {
            notifySaveSuccess();
            ui.openDialogRemoveReceiptTypes = false;
          },
        },
      );
    };

    return {
      // format & language
      t,
      formatMoney,

      // variables
      visible,
      formValues,
      isShowInputEditReceiptTypes,
      categoryOptions,
      categorySn,
      data,
      isLoading,
      nameReceiptType,
      ui,
      hasPermission,
      receiptTypeCreateField,
      isReceiptTypeCreateRules,

      receiptTypeEditField,
      isReceiptTypeEditRules,

      // do something
      onChangeProducts,
      onCancelSubmitCreateReceiptTypes,
      openInputNewReceiptTypes,
      onRemoveReceiptTypes,
      onEditReceiptTypes,
      onSubmitEditReceiptTypes,
      onCancelSubmitEditReceiptTypes,
      onSubmitCreateReceiptTypes,
      onConfirmRemoveReceiptTypePopup,

      // styles
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: 'grey',
        width: '5px',
        opacity: '0.75',
      },

      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: 'grey',
        width: '9px',
        opacity: ' 0.2',
      },
    };
  },
};
</script>

<style scoped>
.q-list--padding {
  padding: 0;
}

.caption {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-top: 0;
}

.q-field--error {
  margin-bottom: 1.5em;
  padding-right: 1em;
}

.q-field--with-bottom {
  padding-bottom: 0;
}

.active-link {
  color: #c2410c;
  background: linear-gradient(0deg, rgba(194, 65, 12, 0.1), rgba(194, 65, 12, 0.1)), #ffffff;
}
</style>
