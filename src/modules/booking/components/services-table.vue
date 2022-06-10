<template>
  <div class="relative-position" style="min-height: 200px">
    <div class="row justify-end q-mb-md">
      <q-btn
        v-if="bookingStutusSn !== 6 && route.name === 'BookingEdit'"
        outline
        class="float-right"
        color="negative"
        :label="t('new_services')"
        :class="hasPermission('add-services') === false ? 'hidden' : ''"
        icon="add_circle"
        @click="openChangeAddService(roomInfo.sn, roomInfo.bookingNo), loadDialog()"
      />
    </div>
    <div>
      <div>
        <q-table
          v-if="serviceInfo"
          :rows-per-page-options="[0]"
          :rows="serviceInfo"
          :columns="columns"
          hide-pagination
          hide-bottom
          row-key="index"
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
              <q-td
                key="index"
                :props="props"
                :class="props.row.deleteReason && props.row.deleteTime ? 'opacity-view' : ''"
              >
                {{ props.rowIndex + 1 }}
              </q-td>
              <q-td
                key="productName"
                :class="props.row.deleteReason && props.row.deleteTime ? 'opacity-view' : ''"
              >
                <div class="row items-left justify-left">
                  <div class="limit-text">
                    {{ props.row.productName }}
                    <q-tooltip>{{ props.row.productName }}</q-tooltip>
                  </div>
                </div>
              </q-td>
              <q-td
                key="quantity"
                :class="props.row.deleteReason && props.row.deleteTime ? 'opacity-view' : ''"
                ><div class="row items-left justify-left">
                  {{ props.row.quantity }}
                </div></q-td
              >
              <q-td
                key="unitPrice"
                :class="props.row.deleteReason && props.row.deleteTime ? 'opacity-view' : ''"
              >
                <div class="row items-left justify-left">
                  {{ formatMoney(props.row.unitPrice) }} VND
                </div>
              </q-td>
              <q-td
                key="totalPrice"
                :class="props.row.deleteReason && props.row.deleteTime ? 'opacity-view' : ''"
              >
                <div class="row items-left justify-left">
                  {{ formatMoney(props.row.totalPrice) }} VND
                </div>
              </q-td>
              <q-td
                key="createBy"
                :class="props.row.deleteReason && props.row.deleteTime ? 'opacity-view' : ''"
              >
                <div class="text-left">
                  <span>
                    {{
                      date.formatDate(new Date(props.row.createTime * 1000), FORMAT_DATE_TIME_UI)
                    }}
                  </span>
                  <br />
                  <span>{{ props.row.createBy }}</span>
                </div>
              </q-td>
              <q-td
                key="deleteBy"
                :class="props.row.deleteReason && props.row.deleteTime ? 'opacity-view' : ''"
              >
                <div class="text-left">
                  <span>
                    {{
                      props.row.deleteReason
                        ? date.formatDate(
                            new Date(props.row.deleteTime * 1000),
                            FORMAT_DATE_TIME_UI,
                          )
                        : ''
                    }}
                  </span>
                  <br />
                  <span>{{ props.row.deleteBy }}</span>
                </div>
              </q-td>
              <q-td
                key="deleteReason"
                :class="props.row.deleteReason && props.row.deleteTime ? 'opacity-view' : ''"
              >
                <div class="row items-left justify-left">
                  <div class="limit-text">
                    {{ props.row.deleteReason }}
                  </div>
                </div>
              </q-td>
              <q-td key="action" class="text-align-end">
                <q-btn
                  v-if="props.row.sn === null"
                  dense
                  round
                  flat
                  color="grey"
                  icon="delete"
                  @click="deleteServiceLocal(props.row, props.rowIndex)"
                >
                  <q-tooltip>{{ t('delete') }}</q-tooltip>
                </q-btn>
                <q-btn
                  v-else-if="
                    !props.row.deleteBy && !props.row.deleteReason && route.name === 'BookingEdit'
                  "
                  dense
                  round
                  flat
                  color="grey"
                  icon="delete"
                  @click="deleteService(props.row, props.rowIndex + 1)"
                >
                  <q-tooltip>{{ t('delete') }}</q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <ChangeAddServiceDialog
      v-if="openDialog"
      ref="changeAddServiceDialogRef"
      v-model="ui.changeAddServiceVisible"
      :is-room-view="false"
      :room-name="roomInfo.bookingNo"
      :booking-product-sn-delete-list="bookingProductSnDeleteList"
      @add-services="addServices"
      @change-success="handleSuccess('changeAddService')"
      @close-dialog="closeDialog"
    />
    <DeleteServiceDialog
      ref="deleteServiceRef"
      v-model="deleteServiceDialogVisiable"
      @close="closePopupDeleteServiceEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed } from 'vue';
import { useI18n } from '~/composable/useI18n';
// API
import ChangeAddServiceDialog from '~/modules/booking/room-view/components/ChangeAddServiceDialog.vue';
import DeleteServiceDialog from '~/modules/booking/components/delete-service-dialog.vue';
import useOpenDialog from '~/modules/booking/room-view/composable/useOpenDialog';
import { formatMoney } from '~/composable/useFormat';
import { useRoute } from 'vue-router';
import { useAuth } from '~/composable/useAuth';
import { date } from 'quasar';
import { FORMAT_DATE_TIME_UI } from '~/constants';

const { t } = useI18n();
const route = useRoute();
interface IItemService {
  createBy: string;
  createTime: number;
  deleteBy: string;
  deleteReason: string;
  deleteTime: number;
  productName: string;
  productSn: number;
  quantity: number;
  sn: number;
  totalPrice: number;
  unitPrice: number;
}
interface IProps {
  data: any;
  roomInfo: any;
}
const { hasPermission } = useAuth();
const props = defineProps<IProps>();
const serviceInfo = toRefs(props).data;
const bookingProductSnDeleteList = ref<any>([]);
let productSnDelete = ref<number | undefined>();
const roomInfo = toRefs(props).roomInfo;
const bookingStutusSn = roomInfo.value.bookingStatusSn;
const deleteServiceRef = ref<InstanceType<typeof DeleteServiceDialog> | null>(null);
type TAlignColumn = 'left' | 'right' | 'center' | undefined;
const columns = computed(() => [
  {
    name: 'index',
    label: t('no'),
    field: 'index',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'productName',
    label: t('products'),
    field: 'productName',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'quantity',
    label: t('quantity'),
    field: 'quantity',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'unitPrice',
    label: t('unit_price'),
    field: 'unitPrice',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'totalPrice',
    label: t('total_price'),
    field: 'totalPrice',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'createBy',
    label: t('created_at_by'),
    field: 'createBy',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'deleteBy',
    label: t('deleted_at_by'),
    field: 'deleteBy',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'deleteReason',
    label: t('reason'),
    field: 'deleteReason',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'action',
    label: '',
    field: 'action',
    align: 'left' as TAlignColumn,
  },
]);
const openDialog = ref(false);
const deleteServiceDialogVisiable = ref(false);
const { ui, changeAddServiceDialogRef, openChangeAddService } = useOpenDialog();
// const deleteImportStockMutation = useDeleteImportStockMutation();
// get API
const itemServiceGet = ref<IItemService>({
  createBy: '',
  createTime: 0,
  deleteBy: '',
  deleteReason: '',
  deleteTime: 0,
  productName: '',
  productSn: 0,
  quantity: 0,
  sn: 0,
  totalPrice: 0,
  unitPrice: 0,
});
//action
const deleteServiceLocal = (item: IItemService, index: number) => {
  serviceInfo.value = serviceInfo?.value?.splice(index, 1);
};
const deleteService = (item: IItemService, index: number) => {
  productSnDelete.value = item.sn;
  deleteServiceDialogVisiable.value = true;
  (deleteServiceRef.value as any)?.setupDeleteServiceDialog(
    item,
    index,
    bookingProductSnDeleteList.value,
  );
  itemServiceGet.value = item;
};

const closePopupDeleteServiceEdit = (item: IItemService) => {
  serviceInfo.value = serviceInfo.value.map(function (itemService: IItemService) {
    if (itemService.sn === item.sn) {
      itemService.deleteTime = item.deleteTime;
    }
  });
  itemServiceGet.value.deleteTime = item.deleteTime;
  deleteServiceDialogVisiable.value = false;

  bookingProductSnDeleteList.value.push(productSnDelete.value);
};
const loadDialog = () => {
  openDialog.value = true;
};
const closeDialog = () => {
  openDialog.value = false;
};
const addServices = (items: any) => {
  serviceInfo.value = items.map(function (item: IItemService) {
    serviceInfo.value.unshift(item);
  });
};

const handleSuccess = (actions: string) => {
  switch (actions) {
    case 'changeAddService':
      ui.changeAddServiceVisible = false;
      break;
    default:
      break;
  }
};
</script>
<style lang="sass" scoped>

.limit-text
  max-height: 20px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  width: 250px
  text-align: left
.doc-link
  color: #C2410C
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
