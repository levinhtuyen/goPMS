<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue';
import addPricingPlan from './components/addPricingPlan.vue';
import editPricingPlan from './components/editPricingPlan.vue';
import duplicateConfirm from './components/duplicateConfirm.vue';
import { useQuasar } from 'quasar';
import { usePricingQuery } from './apis/pricingQuery';
import { useDeletePricingMutation } from './apis/useDeletePricingMutation';
import { useSetDefaultPricingMutation } from './apis/useSetDefaultPricingMutation';
import { useI18n } from '~/composable/useI18n';
import { formatIndexTable } from '~/composable/useFormat';
import { useAuth } from '~/composable/useAuth';
import { useNotify } from '~/composable/useNotify';

// data
const { t } = useI18n();
const $q = useQuasar();
const { hasPermission } = useAuth();
const rows = ref([]);
const pagination = ref({
  page: 1,
  limit: 10,
});
const { notifyUpdateSuccess } = useNotify();
const total = ref(0);
const { data: pricingList, isLoading, isFetching, refetch } = usePricingQuery(pagination);
const deletePricingMutation = useDeletePricingMutation();
const setDefaultPricingMutation = useSetDefaultPricingMutation();
const refEditPricing = ref<InstanceType<typeof editPricingPlan> | null>(null);
const refAddPricing = ref<InstanceType<typeof addPricingPlan> | null>(null);
const refDuplicate = ref<InstanceType<typeof duplicateConfirm> | null>(null);

const columns = computed(() => [
  {
    name: 'index',
    label: t('no'),
    field: 'index',
    align: 'left' as const,
    style: 'width: 50px',
  },
  {
    name: 'roomName',
    label: t('room_type_name'),
    field: 'roomName',
    style: 'max-width: 100px',
    align: 'left' as const,
  },
  {
    name: 'pricingPlan',
    field: 'indepricingPlanx',
    label: t('pricing_plan'),
    align: 'left' as const,
  },
]);

const ui = reactive({
  isShowAddPricingPlan: false,
  isShowEditPricingPlan: false,
  isShowDuplicate: false,
});
// watch
watch(isFetching, () => {
  if (!isFetching) return;
  if (pricingList.value) {
    rows.value = JSON.parse(
      JSON.stringify(
        pricingList.value?.roomTypeList.map((val: any) => {
          return (val = { ...val, expand: false });
        }),
      ),
    );
    total.value = JSON.parse(JSON.stringify(pricingList.value?.meta.lastPage));
  }
});
// method
const setColor = (index: number) => {
  if (index === 1) return 'default-plan';
  return 'set-default';
};
const setDefault = (sn: number) => {
  $q.dialog({
    message: t('are_you_sure_you_want_to_set_this_pricing_as_default'),
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
      dense: true,
      noCaps: true,
      // dense: true,
    },
    persistent: true,
  }).onOk(() => {
    setDefaultPricingMutation.mutate(
      { pricingPlanSn: sn },
      {
        onSuccess: () => {
          refetch.value();
          notifyUpdateSuccess();
        },
      },
    );
  });
};
const onDelete = (sn: number) => {
  $q.dialog({
    message: t('are_you_sure_you_want_to_delete_this_pricing_plan'),
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
      // dense: true,
    },
    persistent: true,
  }).onOk(() => {
    deletePricingMutation.mutate(
      { pricingPlanSn: sn },
      {
        onSuccess: () => {
          refetch.value();
          notifyUpdateSuccess();
        },
      },
    );
  });
};
const onOperate = (type: number, sn: number) => {
  if (type == 2) {
    ui.isShowDuplicate = true;
    (refDuplicate.value as any)?.setupPricingDuplicateDialog({ sn: Number(sn) });
  } else {
    ui.isShowEditPricingPlan = true;
    (refEditPricing.value as any)?.setupPricingEditDialog({ sn: Number(sn) });
  }
};
const onOpenAddModal = (sn: number) => {
  ui.isShowAddPricingPlan = true;
  (refAddPricing.value as any)?.setupPricingAddDialog({ sn: Number(sn) });
};
const closePopup = () => {
  ui.isShowAddPricingPlan = false;
  ui.isShowEditPricingPlan = false;
  ui.isShowDuplicate = false;
  refetch.value();
};
</script>

<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md">
        <div class="text-h5 text-bold">{{ t('pricing_plan_list') }}</div>
      </div>
    </template>

    <div v-if="!isLoading">
      <q-table
        v-if="rows"
        :rows="rows"
        :columns="columns"
        :table-colspan="9"
        row-key="index"
        class="my-sticky-header-table"
        no-data-label="No data"
        :virtual-scroll-item-size="48"
        :rows-per-page-options="[0]"
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
            <q-td key="index" :props="props">
              {{ formatIndexTable(pagination.page, props.pageIndex) }}
            </q-td>
            <q-td key="roomName" :props="props" class="text-grey-4">
              <div class="ellipsis" style="width: 300px">
                <span>
                  <q-tooltip> {{ props.row.code }} | {{ props.row.name }} </q-tooltip>
                  {{ props.row.name }}
                </span>
              </div>
            </q-td>
            <q-td key="pricingPlan" :props="props">
              <div class="row">
                <div class="inline-block col-sm-9 col-md-9 col-xs-9">
                  <div v-if="props.row.pricingPlanList.length > 0" class="row items-center">
                    <div :class="!$q.screen.gt.xs ? 'col-xs-3' : void 0">
                      <q-btn
                        dense
                        flat
                        color="deep-orange-6"
                        :icon="props.row.expand ? 'expand_more' : 'chevron_right'"
                        @click="props.row.expand = !props.row.expand"
                      />
                    </div>
                    <div class="col-sm-11 col-md-11 col-xs-9 q-my-sm">
                      <div
                        v-if="props.row.pricingPlanList[0].isDefault === 1"
                        class="q-pa-sm text-weight-bold bg-deep-orange-custom text-negative ellipsis rounded-borders"
                      >
                        {{ props.row.pricingPlanList[0].name }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-sm-3 col-md-3 col-xs-3 row items-center justify-end">
                  <q-btn
                    outline
                    no-caps
                    class="text-weight-bold rounded-borders"
                    color="negative"
                    :label="$q.screen.gt.xs ? t('pricing_plan') : void 0"
                    icon="add_circle"
                    size="sm"
                    style="font-size: 12px"
                    :class="hasPermission('add-edit-delete-pricing-plan') === false ? 'hidden' : ''"
                    @click="onOpenAddModal(props.row.sn)"
                  />
                </div>
              </div>
              <div style="max-height: 313px; overflow-y: scroll">
                <div
                  v-for="(plan, index) in props.row.pricingPlanList"
                  v-show="props.row.expand"
                  :key="index"
                  class="row justify-between items-center q-ml-lg"
                >
                  <div class="col q-ml-md">
                    <p class="q-ml-xl ellipsis">{{ plan.name }}</p>
                  </div>
                  <div class="col text-right">
                    <q-btn
                      class="rounded-borders btn-fixed-width"
                      :class="setColor(plan.isDefault)"
                      :disable="plan.isDefault === 1"
                      no-caps
                      unelevated
                      @click="setDefault(plan.sn)"
                    >
                      {{ plan.isDefault === 1 ? t('default') : t('set_as_default') }}
                    </q-btn>
                    <q-btn icon="more_vert" no-caps flat dense>
                      <q-menu>
                        <q-list dense style="min-width: 100px">
                          <q-item
                            v-close-popup
                            :class="
                              hasPermission('add-edit-delete-pricing-plan') === false
                                ? 'hidden'
                                : ''
                            "
                            clickable
                            @click="onOperate(1, plan.sn)"
                          >
                            <p>{{ t('edit') }}</p>
                          </q-item>
                          <q-item
                            v-close-popup
                            :class="
                              hasPermission('duplicate-pricing-plan') === false ? 'hidden' : ''
                            "
                            clickable
                            @click="onOperate(2, plan.sn)"
                          >
                            <p>{{ t('duplicate') }}</p>
                          </q-item>
                          <q-item
                            v-if="plan.isDefault !== 1"
                            v-close-popup
                            :class="
                              hasPermission('add-edit-delete-pricing-plan') === false
                                ? 'hidden'
                                : ''
                            "
                            clickable
                            @click="onDelete(plan.sn)"
                          >
                            <p>{{ t('delete') }}</p>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="q-mt-md row justify-end">
        <q-pagination
          v-if="pagination"
          v-model="pagination.page"
          color="negative"
          no-data-label="No data"
          :max="total || 1"
          :max-pages="5"
          boundary-numbers
          direction-links
          push
        />
      </div>
    </div>
    <div v-if="isLoading" class="container relative-position">
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
    <add-pricing-plan ref="refAddPricing" v-model="ui.isShowAddPricingPlan" @close="closePopup" />
    <edit-pricingPlan ref="refEditPricing" v-model="ui.isShowEditPricingPlan" @close="closePopup" />
    <duplicate-confirm ref="refDuplicate" v-model="ui.isShowDuplicate" @close="closePopup" />
  </pms-sections>
</template>

<style lang="scss" scoped>
$background-active: #ffebe3 !important;

p,
span {
  color: $grey-8;
}
.default-plan {
  color: $negative;
  background-color: rgba(255, 100, 0, 0.1);
  font-weight: 600;
}
.set-default {
  color: $grey-11;
  background-color: rgba(177, 177, 177, 0.1);
  font-weight: 600;
}

.bg-deep-orange-custom {
  background: $background-active;
}

p {
  margin: revert;
}
</style>
