<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md">
        <div class="text-h5 text-bold">{{ t('extra_services') }}</div>
      </div>
    </template>

    <div class="row q-col-gutter-lg">
      <!-- Categories -->
      <div class="col-12 col-md-3">
        <q-banner inline-actions rounded class="bg-negative text-white">
          <b>{{ t('categories') }}</b>

          <template #action>
            <q-btn
              v-if="hasPermission('add-edit-delete-category')"
              push
              color="white"
              text-color="negative"
              :label="t('add_category')"
              icon="add"
              dense
              no-caps
              @click="addCategory"
            >
            </q-btn>
          </template>
        </q-banner>

        <q-scroll-area
          :visible="ui.visible"
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          :style="{ height: isHeghtScroll }"
        >
          <div class="caption">
            <q-input
              v-if="ui.isShowInputCreateCategory"
              ref="categoryCreateField"
              v-model="formValues.name"
              borderless
              autofocus
              dense
              :error="!isCategoryRules && formValues.name != ''"
              class="full-width q-py-sm q-px-md"
              :placeholder="t('input_category_name')"
              @blur="onSubmitCreateCategory"
              @keydown.enter.prevent="onSubmitCreateCategory"
              @keydown.esc.prevent="onCancelSubmitCreateCategory"
              @keydown.tab.prevent="onCancelSubmitCreateCategory"
            >
              <template #error>
                <p v-if="formValues.name.length > 50" class="text-left">
                  {{ t('the_length_is_from_1_to_50_characters') }}
                </p>
              </template>
            </q-input>
          </div>

          <q-inner-loading
            :showing="isLoadingCategory"
            label="Please"
            label-class="text-teal"
            label-style="font-size:1.1em"
          >
            <div lass="full-width" full-height class="q-mt-md row justify-center">
              <q-spinner color="negative" :thickness="2" size="2em" />
            </div>
          </q-inner-loading>

          <q-infinite-scroll v-if="dataCategory" :offset="50">
            <div v-for="(item, index) in dataCategory" :key="index" class="caption bg-white">
              <q-list>
                <q-item
                  :disable="!item.status"
                  :class="
                    dataCategory && dataCategory[0]?.sn == item.sn && categorySn == 0
                      ? 'active-link'
                      : ''
                  "
                  clickable
                  :active="categorySn === item.sn"
                  active-class="active-link"
                  @click="onChangeProducts(item.sn)"
                >
                  <q-input
                    v-if="isShowInputEditCategory == item.sn"
                    ref="categoryEditField"
                    v-model="nameCategory"
                    borderless
                    autofocus
                    dense
                    :error="!isCategoryEditRules"
                    class="full-width"
                    :placeholder="t('input_category_name')"
                    @blur="onSubmitEditCategory(item)"
                    @keydown.enter.prevent="onSubmitEditCategory(item)"
                    @keydown.esc.prevent="onCancelSubmitEditCategory"
                    @keydown.tab.prevent="onCancelSubmitEditCategory"
                  >
                    <template #error>
                      <p v-if="!nameCategory" class="text-left">
                        {{ t('this_field_is_required') }}
                      </p>
                      <p v-else-if="nameCategory.length > 50" class="text-left">
                        {{ t('the_length_is_from_1_to_50_characters') }}
                      </p>
                    </template>
                  </q-input>

                  <q-item-section v-else>
                    <div class="row justify-between items-center">
                      <strong class="limit-text-25" :class="!item.status ? 'text-grey-5' : ''">{{
                        item.name
                      }}</strong>
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <strong>{{ item.name }}</strong>
                      </q-tooltip>

                      <q-item-section
                        v-if="
                          hasPermission('add-edit-delete-category') ||
                          hasPermission('activate-deactivate-category')
                        "
                        avatar
                        class="custome-oparations"
                      >
                        <q-btn icon-right="more_vert" no-caps flat dense>
                          <q-menu>
                            <q-list style="min-width: 100px">
                              <q-item
                                v-if="hasPermission('add-edit-delete-category')"
                                v-close-popup
                                clickable
                                @click="onEditCategory(item)"
                              >
                                <q-item-section>{{ t('edit') }}</q-item-section>
                              </q-item>
                              <q-item
                                v-if="hasPermission('activate-deactivate-category')"
                                v-close-popup
                                clickable
                              >
                                <q-item-section
                                  v-if="!item.status"
                                  @click="onActiveCategory(item)"
                                  >{{ t('activate') }}</q-item-section
                                >
                                <q-item-section v-else @click="onDeactiveCategory(item)">{{
                                  t('deactivate')
                                }}</q-item-section>
                              </q-item>
                              <q-item
                                v-if="hasPermission('add-edit-delete-category')"
                                v-close-popup
                                clickable
                              >
                                <q-item-section @click="onRemoveCategory(item)">{{
                                  t('delete')
                                }}</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-btn>
                      </q-item-section>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-infinite-scroll>
          <div
            v-else-if="!isFetchingCategory"
            lass="full-width"
            full-height
            class="q-mt-md row justify-center"
          >
            {{ t('no_data') }}
          </div>
        </q-scroll-area>
      </div>

      <!-- Products -->

      <div class="col-12 col-md-9">
        <q-banner inline-actions rounded class="bg-negative text-white">
          <b>{{ t('products') }}</b>

          <template #action>
            <q-btn
              v-if="hasPermission('add-edit-delete-product')"
              push
              color="white"
              text-color="negative"
              :label="t('add_product')"
              icon="add"
              dense
              no-caps
              @click="openModalNewProduct"
            >
            </q-btn>
          </template>
        </q-banner>

        <q-scroll-area
          :visible="ui.visible"
          style="height: 600px"
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
        >
          <q-inner-loading
            :showing="isLoadingProduct"
            label="Please"
            label-class="text-teal"
            label-style="font-size:1.1em"
          >
            <div lass="full-width" full-height class="q-mt-md row justify-center">
              <q-spinner color="negative" :thickness="2" size="2em" />
            </div>
          </q-inner-loading>

          <q-infinite-scroll v-if="dataProduct" :offset="50">
            <div v-for="(item, index) in dataProduct" :key="index" class="caption bg-white">
              <q-list padding>
                <q-item :disable="!item.status">
                  <q-item-section>
                    <div class="row justify-between" :class="!item.status ? 'text-grey-5' : ''">
                      <div class="q-md-2">
                        <div class="limit-text-50 text-bold">
                          {{ item.name }}
                          {{ item.productUnitName ? `(${item.productUnitName})` : '' }}
                        </div>
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          <strong
                            >{{ item.name }}
                            {{ item.productUnitName ? `(${item.productUnitName})` : '' }}</strong
                          >
                        </q-tooltip>
                      </div>
                      <div class="text-bold">{{ formatMoney(item.price) }} VND</div>
                    </div>
                  </q-item-section>
                  <q-item-section
                    v-if="
                      hasPermission('add-edit-delete-product') ||
                      hasPermission('activate-deactivate-product')
                    "
                    avatar
                  >
                    <q-btn icon-right="more_vert" no-caps flat dense>
                      <q-menu>
                        <q-list style="min-width: 100px">
                          <q-item
                            v-if="hasPermission('add-edit-delete-product')"
                            v-close-popup
                            clickable
                          >
                            <q-item-section @click="editProduct(item)">{{
                              t('edit')
                            }}</q-item-section>
                          </q-item>
                          <q-item
                            v-if="hasPermission('activate-deactivate-product')"
                            v-close-popup
                            clickable
                          >
                            <q-item-section v-if="!item.status" @click="onDeactiveProduct(item)">{{
                              t('activate')
                            }}</q-item-section>
                            <q-item-section v-else @click="onActiveProduct(item)">{{
                              t('deactivate')
                            }}</q-item-section>
                          </q-item>
                          <q-item
                            v-if="hasPermission('add-edit-delete-product')"
                            v-close-popup
                            clickable
                          >
                            <q-item-section @click="onRemoveProduct(item)">{{
                              t('delete')
                            }}</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-infinite-scroll>
          <div
            v-else-if="!isFetchingProduct"
            lass="full-width"
            full-height
            class="q-mt-md row justify-center"
          >
            {{ t('no_data') }}
          </div>
        </q-scroll-area>
      </div>
    </div>

    <!-- POPUP ACTIVE CATEGORY -->
    <q-dialog v-model="ui.openDialogStatusCategory">
      <q-card class="q-pa-lg">
        <div align="center">
          <p class="text-bold">{{ titleStatusCategory }}</p>
        </div>
        <div align="right" class="q-gutter-sm">
          <q-btn
            v-close-popup
            :label="t('cancel')"
            dense
            outline
            no-caps
            color="grey-8"
            style="padding: 4px 12px"
          />
          <q-btn
            v-if="!ui.isRemoveCategory"
            :label="t('confirm')"
            color="negative"
            style="width: 100px"
            dense
            no-caps
            @click="onConfirmStatusCategoryPopup"
          />
          <q-btn
            v-else
            :label="t('confirm')"
            color="negative"
            dense
            style="width: 100px"
            no-caps
            @click="onConfirmRemoveCategoryPopup"
          />
        </div>
      </q-card>
    </q-dialog>
    <!-- END POPUP ACTIVE CATEGORY -->

    <!-- POPUP ACTIVE PRODUCT -->
    <q-dialog v-model="ui.openDialogStatusProduct">
      <q-card class="q-pa-lg">
        <div align="center">
          <p class="text-bold">{{ titleStatusProduct }}</p>
        </div>
        <div align="right" class="q-gutter-sm">
          <q-btn
            v-close-popup
            :label="t('cancel')"
            dense
            outline
            no-caps
            color="grey-8"
            style="padding: 4px 12px"
          />
          <q-btn
            v-if="!ui.isRemoveProduct"
            :label="t('confirm')"
            color="negative"
            style="width: 100px"
            dense
            no-caps
            @click="onConfirmStatusProductPopup"
          />
          <q-btn
            v-else
            :label="t('confirm')"
            color="negative"
            style="width: 100px"
            dense
            no-caps
            @click="onConfirmRemoveProductPopup"
          />
        </div>
      </q-card>
    </q-dialog>
    <!-- END POPUP ACTIVE PRODUCT -->

    <!-- POPUP CREATE PRODUCT -->
    <q-dialog v-model="ui.openCreateProductModal">
      <q-card style="width: 700px; max-width: 80vw">
        <div class="text-h5 q-mt-lg q-mx-lg">{{ t('new_product') }}</div>
        <create-product-modal :category-sn-detail="categorySn" @reset="resetProductModal" />
      </q-card>
    </q-dialog>
    <!-- END POPUP CREATE PRODUCT -->
    <!-- POPUP EDIT PRODUCT -->
    <q-dialog v-model="openEditProductModal">
      <q-card style="width: 700px; max-width: 80vw">
        <div class="text-h5 q-mt-lg q-mx-lg">{{ t('edit_product') }}</div>
        <edit-product-modal
          :category-sn-detail="categorySn"
          :product-detail="productDetail"
          @reset="resetProductModal"
        />
      </q-card>
    </q-dialog>
    <!-- END POPUP EDIT PRODUCT -->
  </pms-sections>
</template>

<script lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import CreateProductModal from './components/create-product-modal.vue';
import { useI18n } from '~/composable/useI18n';
import { formatMoney } from '~/composable/useFormat';
import type { QInput } from 'quasar';

// category service
import { useCategoryServiceQuery } from './apis/useCategoryServiceQuery';
import { useCreateCategoryServiceMutation } from './apis/useCreateCategoryServiceMutation';
import { useUpdateCategoryServiceMutation } from './apis/useUpdateCategoryServiceMutation';
import { useUpdateStatusCategoryServiceMutation } from './apis/useUpdateStatusCategoryServiceMutation';
import { useRemoveCategoryServiceMutation } from './apis/useRemoveCategoryServiceMutation';
import { useNotify } from '~/composable/useNotify';

// product service
import { useProductServiceQuery } from './apis/useProductServiceQuery';
import { useUpdateStatusProductServiceMutation } from './apis/useUpdateStatusProductServiceMutation';
import { useRemoveProductServiceMutation } from './apis/useRemoveProductServiceMutation';
import EditProductModal from './components/edit-product-modal.vue';
// import { i18n } from '~/plugins/i18n';
import { useAuth } from '~/composable/useAuth';

export default {
  components: {
    CreateProductModal,
    EditProductModal,
  },
  setup() {
    const { t, locale } = useI18n();
    const { hasPermission } = useAuth();

    const ui = reactive({
      isSubmitCreateCategory: false,
      visible: true,
      isShowInputCreateCategory: false,
      openCreateProductModal: false,
      isRemoveCategory: false,
      isRemoveProduct: false,
      openDialogStatusCategory: false,
      openDialogStatusProduct: false,
    });

    const nameCategory = ref('');
    const pageCategory = ref(1);
    const isShowInputEditCategory = ref();

    const categorySn = ref(0);

    const titleStatusCategory = ref('');
    const titleStatusProduct = ref('');
    const dataPopup = ref();

    const { notifySaveSuccess, notifyUpdateSuccess, notifySaveFailed } = useNotify();
    const { mutate: updateStatusCategoryMutation } = useUpdateStatusCategoryServiceMutation();
    const { mutate: updateStatusProductMutation } = useUpdateStatusProductServiceMutation();
    const { mutate: removeCategoryMutation } = useRemoveCategoryServiceMutation();
    const { mutate: removeProductMutation } = useRemoveProductServiceMutation();

    const {
      data: dataCategory,
      isLoading: isLoadingCategory,
      isFetching: isFetchingCategory,
    } = useCategoryServiceQuery();
    const { mutate: mutateCreateCategory } = useCreateCategoryServiceMutation();
    const { mutate: mutateUpdateCategory } = useUpdateCategoryServiceMutation();

    // =============================================== Handle Category Service

    interface ICategoryMutationParams {
      name: string;
    }

    const formValues = ref<ICategoryMutationParams>({
      name: '',
    });

    // Handle Status Category
    const onActiveCategory = (item: any) => {
      titleStatusCategory.value = t('are_you_sure_you_want_to_activate_this_category');
      ui.openDialogStatusCategory = true;
      ui.isRemoveCategory = false;
      dataPopup.value = item;
    };

    const onDeactiveCategory = (item: any) => {
      titleStatusCategory.value = t('are_you_sure_you_want_to_deactivate_this_category');
      ui.openDialogStatusCategory = true;
      ui.isRemoveCategory = false;
      dataPopup.value = item;
    };

    // Handle Remove Category
    const onRemoveCategory = (item: any) => {
      if (item.isProduct) {
        titleStatusCategory.value = t('all_products_in_this_category_will_also_be_deleted');
      } else {
        titleStatusCategory.value = t('are_you_sure_you_want_to_delete_this_category');
      }
      ui.isRemoveCategory = true;
      ui.openDialogStatusCategory = true;
      dataPopup.value = item;
    };

    // Handle Status Product
    const onActiveProduct = (item: any) => {
      titleStatusProduct.value = t('are_you_sure_you_want_to_deactivate_this_product');
      ui.openDialogStatusProduct = true;
      dataPopup.value = item;
    };

    const onDeactiveProduct = (item: any) => {
      titleStatusProduct.value = t('are_you_sure_you_want_to_activate_this_product');
      ui.openDialogStatusProduct = true;
      dataPopup.value = item;
    };

    // Handle Remove Product
    const onRemoveProduct = (item: any) => {
      titleStatusProduct.value = t('are_you_sure_you_want_to_delete_this_product');
      ui.isRemoveProduct = true;
      ui.openDialogStatusProduct = true;
      dataPopup.value = item;
    };
    watch(
      () => locale.value,
      () => {
        titleStatusCategory.value = t('all_products_in_this_category_will_also_be_deleted');
        titleStatusCategory.value = t('are_you_sure_you_want_to_deactivate_this_category');
        titleStatusProduct.value = t('are_you_sure_you_want_to_deactivate_this_product');
        titleStatusCategory.value = t('are_you_sure_you_want_to_activate_this_category');
        titleStatusProduct.value = t('are_you_sure_you_want_to_activate_this_product');
        titleStatusProduct.value = t('are_you_sure_you_want_to_delete_this_product');
        titleStatusCategory.value = 'are_you_sure_you_want_to_delete_this_category';
      },
    );
    const productDetail = ref({});
    const openEditProductModal = ref(false);

    const editProduct = (item: any) => {
      openEditProductModal.value = true;
      productDetail.value = item;
    };

    const onConfirmStatusCategoryPopup = () => {
      updateStatusCategoryMutation(
        {
          categorySn: dataPopup.value.sn,
          status: dataPopup.value.status ? 0 : 1,
        },
        {
          onSuccess: () => {
            notifySaveSuccess();
            ui.openDialogStatusCategory = false;
          },
          onError: () => {
            notifySaveFailed();
          },
        },
      );
    };

    const onConfirmRemoveCategoryPopup = () => {
      removeCategoryMutation(
        {
          categorySn: dataPopup.value.sn,
        },
        {
          onSuccess: () => {
            notifySaveSuccess();
            ui.openDialogStatusCategory = false;
            categorySn.value = 0; // reset categorySn về vị trí đầu sau khi remove
          },
        },
      );
    };

    const addCategory = () => {
      ui.isShowInputCreateCategory = !ui.isShowInputCreateCategory;
      clearDataFieldCategory();
    };

    const onEditCategory = (item: any) => {
      setTimeout(() => {
        nameCategory.value = item.name;
        isShowInputEditCategory.value = item.sn;
      }, 200);
    };

    const categoryCreateField = ref<QInput | null>(null);
    const isCategoryRules = computed(
      () => !!formValues.value?.name && formValues.value?.name.length <= 50,
    );

    const categoryEditField = ref<QInput | null>(null);
    const isCategoryEditRules = computed(
      () => !!nameCategory.value && nameCategory.value.length <= 50,
    );

    const isHeghtScroll = computed(() =>
      dataCategory.value && dataCategory.value.length < 10
        ? `${50 * dataCategory.value.length}px`
        : '600px',
    );

    watch(categorySn, () => {
      clearUiCategory();
    });

    const onSubmitCreateCategory = () => {
      ui.isSubmitCreateCategory = true;
      ui.isShowInputCreateCategory = true;

      if (formValues.value.name == '') {
        clearUiCategory();
      } else if (!isCategoryRules.value) {
        return false;
      } else {
        ui.isShowInputCreateCategory = false;
        mutateCreateCategory(formValues.value, {
          onSuccess: () => {
            notifySaveSuccess();
            clearDataFieldCategory();
          },
        });
      }
    };

    const clearDataFieldCategory = () => {
      formValues.value.name = '';
    };

    const clearUiCategory = () => {
      ui.isSubmitCreateCategory = false;
      ui.isShowInputCreateCategory = false;
    };

    const onSubmitEditCategory = (item: any) => {
      if (item.name == nameCategory.value) {
        isShowInputEditCategory.value = false;
        return false;
      } else if (!isCategoryEditRules.value) {
        return false;
      } else {
        mutateUpdateCategory(
          { categorySn: item.sn, name: nameCategory.value },
          {
            onSuccess: () => {
              notifyUpdateSuccess();
              isShowInputEditCategory.value = false;
            },
          },
        );
      }
    };

    const onCancelSubmitCreateCategory = () => {
      clearDataFieldCategory();
      ui.isShowInputCreateCategory = false;
    };

    const onCancelSubmitEditCategory = () => {
      isShowInputEditCategory.value = false;
    };

    // =============================================== Handle Product Service
    const createCategoryServiceFormRef = ref<HTMLFormElement>();

    // const {
    //   data: dataProduct,
    //   error: errorProduct,
    //   fetchNextPage: fetchNextPageProduct,
    //   isLoading: isLoadingProduct,
    // } = useProductServiceQuery(categorySn);

    const {
      data: dataProduct,
      isLoading: isLoadingProduct,
      isFetching: isFetchingProduct,
    } = useProductServiceQuery(categorySn);

    const onConfirmStatusProductPopup = () => {
      updateStatusProductMutation(
        {
          productSn: dataPopup.value.sn,
          status: dataPopup.value.status ? 0 : 1,
        },
        {
          onSuccess: () => {
            notifySaveSuccess();
            ui.openDialogStatusProduct = false;
          },
          onError: () => {
            notifySaveFailed();
          },
        },
      );
    };

    const onConfirmRemoveProductPopup = () => {
      removeProductMutation(
        {
          productSn: dataPopup.value.sn,
        },
        {
          onSuccess: () => {
            notifySaveSuccess();
            ui.openDialogStatusProduct = false;
          },
        },
      );
    };

    const openModalNewProduct = () => {
      ui.openCreateProductModal = true;
    };

    const resetProductModal = (value: boolean) => {
      // create popup product
      ui.openCreateProductModal = value;
      // edit popup product
      openEditProductModal.value = value;
    };

    const onChangeProducts = (index: number) => {
      categorySn.value = index;
      clearDataFieldCategory();
    };

    return {
      // format & language
      t,
      hasPermission,
      formatMoney,

      // variables
      nameCategory,
      categorySn,
      isShowInputEditCategory,
      dataCategory,
      createCategoryServiceFormRef,

      formValues,
      isLoadingCategory,
      isFetchingCategory,
      pageCategory,

      // do something
      addCategory,
      openModalNewProduct,
      resetProductModal,
      onChangeProducts,
      onEditCategory,
      onSubmitEditCategory,
      onConfirmStatusCategoryPopup,
      onSubmitCreateCategory,
      onCancelSubmitCreateCategory,
      onCancelSubmitEditCategory,

      // Popup category
      titleStatusCategory,
      ui,

      // do something
      onActiveCategory,
      onDeactiveCategory,
      onRemoveCategory,
      onConfirmRemoveCategoryPopup,

      // product service
      titleStatusProduct,
      openEditProductModal,
      productDetail,

      dataProduct,
      // errorProduct,
      // fetchNextPageProduct,
      isLoadingProduct,
      isFetchingProduct,

      // do something
      onActiveProduct,
      onDeactiveProduct,
      editProduct,
      onConfirmStatusProductPopup,
      onConfirmRemoveProductPopup,
      onRemoveProduct,

      categoryCreateField,
      isCategoryRules,
      categoryEditField,
      isCategoryEditRules,

      isHeghtScroll,

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

<style scoped lang="scss">
.custome-oparations {
  padding: 0;
  min-width: auto;
}

.limit-text-25 {
  width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.limit-text-50 {
  width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.q-field--error {
  margin-bottom: 1.5em;
}

.q-field--with-bottom {
  padding-bottom: 0;
}

.q-list--padding {
  padding: 0;
}

.caption {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-top: 0;
}

.active-link {
  color: $negative;
  background: linear-gradient(0deg, rgba(194, 65, 12, 0.1), rgba(194, 65, 12, 0.1)), #ffffff;

  button {
    color: #000000;
  }
}

.disabled {
  opacity: unset !important;
}
</style>
