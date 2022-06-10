<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md justify-between">
        <div class="text-h5 text-bold">{{ t('booking_source_list') }}</div>
        <div class="q-gutter-sm">
          <q-btn
            color="negative"
            icon="add"
            :label="t('new_booking_source')"
            :class="hasPermission('add-edit-booking-source') === false ? 'hidden' : ''"
            no-caps
            @click="openModalNewBookingSource()"
          />
        </div>
      </div>
    </template>

    <q-inner-loading
      :showing="loadingBookingList"
      label="Please"
      label-class="text-teal"
      label-style="font-size:1.1em"
    >
      <div lass="full-width" full-height class="q-mt-md row justify-center">
        <q-spinner color="negative" :thickness="2" size="2em" />
      </div>
    </q-inner-loading>

    <div v-if="!loadingBookingList">
      <q-table
        v-if="dataBooking"
        :rows="dataBooking?.data.bookingSourceList"
        :columns="columns"
        :table-colspan="9"
        row-key="index"
        no-data-label="No data"
        virtual-scroll
        :virtual-scroll-item-size="48"
        :rows-per-page-options="[0]"
        hide-bottom
        hide-pagination
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
              {{ formatIndexTable(pagination.currentPage, props.pageIndex) }}
            </q-td>
            <q-td key="bookingNo" :props="props">
              <div class="row items-left justify-left">
                <div class="limit-text">
                  {{ props.row.code }}
                  <q-tooltip v-if="props.row.code">{{ props.row.code }}</q-tooltip>
                </div>
              </div>
            </q-td>
            <q-td key="bookingName" :props="props">
              <div class="row items-left justify-left">
                <div class="limit-text">
                  {{ props.row.name }}
                  <q-tooltip v-if="props.row.name">{{ props.row.name }}</q-tooltip>
                </div>
              </div>
            </q-td>
            <q-td key="description" :props="props">
              <div class="row items-left justify-left">
                <div class="limit-text">{{ props.row.description }}</div>
                <q-tooltip v-if="props.row.description">{{ props.row.description }}</q-tooltip>
              </div>
            </q-td>
            <q-td>
              <q-btn
                dense
                round
                flat
                :class="hasPermission('add-edit-booking-source') === false ? 'hidden' : ''"
                icon="edit"
                @click="editBookingSource(props.row)"
              >
                <q-tooltip>{{ t('edit') }}</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="row justify-end q-mt-md">
        <q-pagination
          v-model="pagination.currentPage"
          color="negative"
          :max="dataBooking?.data.meta.lastPage || 1"
          :max-pages="6"
          direction-links
        />
      </div>
    </div>

    <!-- create popup -->
    <q-dialog v-model="openCreateBookingSourceModal" window-height="75">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-weight-bold">{{ t('new_booking_source') }}</div>
        </q-card-section>
        <ModalCreateBookingSource @close="closePopupBookingSourceEdit" />
      </q-card>
    </q-dialog>
    <!-- edit popup -->
    <ModalEditBookingSource
      ref="bookingSourceEditRef"
      v-model="bookingSourceEditDialogVisiable"
      @close="closePopupBookingSourceEdit"
    />
  </pms-sections>
</template>

<script setup lang="ts">
import { useAuth } from '~/composable/useAuth';
import { ref, computed } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useBookingSourceQuery } from './api/useBookingsQuery';
import ModalCreateBookingSource from './components/modal-create-booking-source.vue';
import ModalEditBookingSource from './components/modal-edit-booking-source.vue';
import { formatIndexTable } from '~/composable/useFormat';
// ref dome
const bookingSourceEditRef = ref<InstanceType<typeof ModalEditBookingSource> | null>(null);
const { t } = useI18n();
type TAlignColumn = 'left' | 'right' | 'center' | undefined;
const { hasPermission } = useAuth();
const columns = computed(() => [
  {
    name: 'index',
    label: t('no'),
    field: 'index',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'bookingNo',
    label: t('booking_source_code'),
    field: 'code',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'bookingName',
    label: t('booking_source_name'),
    field: 'name',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'description',
    label: t('description'),
    field: 'description',
    align: 'left' as TAlignColumn,
  },
  {
    name: 'action',
    label: '',
    field: 'action',
    align: 'left' as TAlignColumn,
  },
]);
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
});
const closePopupBookingSourceEdit = () => {
  openCreateBookingSourceModal.value = false;
  bookingSourceEditDialogVisiable.value = false;
  refetchGuestList.value();
};
let {
  data: dataBooking,
  isLoading: loadingBookingList,
  refetch: refetchGuestList,
} = useBookingSourceQuery({
  page: pagination,
  limit: 10,
});

const openCreateBookingSourceModal = ref(false);
const bookingSourceEditDialogVisiable = ref(false);

const openModalNewBookingSource = () => {
  openCreateBookingSourceModal.value = true;
};
const editBookingSource = (row: any) => {
  bookingSourceEditDialogVisiable.value = true;
  (bookingSourceEditRef.value as any)?.setupBookingSourceEditDialog(Number(row.sn));
};
</script>
<style lang="sass" scoped>
.custom-size-dialog
  width: 876px
.q-dialog__inner--minimized div
  max-width: 876px
.limit-text
  max-height: 20px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  width: 250px
  text-align: left
</style>
