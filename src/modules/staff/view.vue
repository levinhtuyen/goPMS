<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md justify-between">
        <div class="text-h5 text-bold">{{ t('staff_list') }}</div>
        <div class="q-gutter-sm">
          <q-btn
            color="negative"
            icon="add"
            :label="t('new_staff')"
            :class="hasPermission('add-edit-staff') == false ? 'hidden' : ''"
            no-caps
            @click="openModalNewStaff()"
          />
          <q-btn
            color="negative"
            :label="t('permission')"
            :class="hasPermission('permission') == false ? 'hidden' : ''"
            no-caps
            @click="$router.push({ name: 'permission' })"
          />
        </div>
      </div>
    </template>

    <div class="relative-position">
      <q-inner-loading
        :showing="isFetching"
        label="Please"
        label-class="text-teal"
        label-style="font-size:1.1em"
      >
        <div lass="full-width" full-height class="q-mt-md row justify-center">
          <q-spinner color="negative" :thickness="2" size="2em" />
        </div>
      </q-inner-loading>

      <div v-if="!isFetching">
        <q-table
          :rows-per-page-options="[0]"
          :rows="data?.staffList"
          :columns="columns"
          hide-pagination
          hide-bottom
          row-key="no"
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="no" :props="props">
                {{ formatIndexTable(currentPage, props.rowIndex) }}
              </q-td>
              <q-td key="fullName" :props="props">
                <div class="limit-text">{{ props.row.fullName }}</div>
                <q-tooltip
                  v-if="props.row.fullName.length > 42"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  <strong>{{ props.row.fullName }}</strong>
                </q-tooltip>
              </q-td>
              <q-td key="mobile" :props="props">
                {{ props.row.mobile }}
              </q-td>
              <q-td key="email" :props="props">
                <div class="limit-text">{{ props.row.email }}</div>
                <q-tooltip
                  v-if="props.row.email.length > 42"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  <strong>{{ props.row.email }}</strong>
                </q-tooltip>
              </q-td>
              <q-td key="role" :props="props">
                {{ props.row.roleSn == 1 ? t('hotel_owner') : t('front_desk') }}
              </q-td>
              <q-td
                key="status"
                :props="props"
                :class="hasPermission('activate-deactivate-staff') == false ? 'hidden' : ''"
              >
                <q-toggle
                  v-model="props.row.status"
                  :false-value="0"
                  :true-value="1"
                  color="negative"
                  @click="onChangeStatus(props.row)"
                />
              </q-td>

              <q-td
                key="operations"
                :props="props"
                :class="hasPermission('add-edit-staff') == false ? 'hidden' : ''"
              >
                <q-tooltip
                  class="negative"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  <strong>{{ t('edit') }}</strong>
                </q-tooltip>
                <q-btn dense round flat color="grey-9" icon="edit" @click="editRow(props)"></q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div class="q-mt-md row justify-end">
          <q-pagination
            v-model="currentPage"
            color="negative"
            :max="data?.meta.lastPage || 1"
            :max-pages="5"
            boundary-numbers
            direction-links
            push
          />
        </div>
      </div>
    </div>
    <q-dialog v-model="openCreateStaffModal">
      <q-card style="width: 700px; max-width: 80vw">
        <div class="text-h5 q-mt-lg q-mx-lg">{{ t('new_staff') }}</div>
        <create-staff-modal @reset="resetStaffModal" />
      </q-card>
    </q-dialog>

    <q-dialog v-model="openEditStaffModal">
      <q-card style="width: 700px; max-width: 80vw">
        <div class="text-h5 q-mt-lg q-mx-lg">{{ t('edit_staff') }}</div>
        <edit-staff-modal :staff-detail="staffDetail" @reset="resetStaffModal" />
      </q-card>
    </q-dialog>

    <q-dialog v-model="openDialogStatus">
      <q-card class="q-pa-lg">
        <div align="center">
          <p class="text-bold">{{ titleActiveModal }}</p>
        </div>
        <div align="end" class="q-gutter-sm">
          <q-btn
            v-close-popup
            :label="t('cancel')"
            dense
            outline
            no-caps
            color="grey-8"
            style="padding: 6px 16px"
          />
          <q-btn
            :label="t('confirm')"
            color="negative"
            style="width: 100px"
            no-caps
            @click="onConfirmStatusPopup"
          />
        </div>
      </q-card>
    </q-dialog>
  </pms-sections>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useStaffQuery } from './apis/useStaffQuery';
import { useUpdateStatusStaffMutation } from './apis/useUpdateStatusStaffMutation';
import { useNotify } from '~/composable/useNotify';
import CreateStaffModal from './components/create-staff-modal.vue';
import EditStaffModal from './components/edit-staff-model.vue';
import { useAuth } from '~/composable/useAuth';
import { formatIndexTable } from '~/composable/useFormat';

export default {
  components: {
    CreateStaffModal,
    EditStaffModal,
  },
  setup() {
    const { t } = useI18n();
    const openDialogStatus = ref(false);
    const currentPage = ref(1);
    const status = ref(false);
    const openCreateStaffModal = ref(false);
    const openEditStaffModal = ref(false);
    const { data, isFetching } = useStaffQuery(currentPage);
    const updateStatusStaffMutation = useUpdateStatusStaffMutation();
    const { hasPermission } = useAuth();
    const columns = computed(() => [
      {
        name: 'no',
        required: true,
        label: t('no'),
        align: 'left',
      },
      {
        name: 'fullName',
        required: true,
        label: t('staff_name'),
        align: 'left',
        field: (row) => row.fullName,
        format: (val) => `${val}`,
      },
      {
        name: 'mobile',
        align: 'left',
        label: t('phone_number'),
        field: 'mobile',
      },
      { name: 'email', align: 'left', label: t('email'), field: 'email' },
      { name: 'role', align: 'left', label: t('role'), field: 'role' },
      { name: 'status', align: 'left', label: t('status'), field: 'status' },
      {
        name: 'operations',
        label: '',
        field: 'operations',
      },
    ]);

    const staffDetail = ref({});
    const titleActiveModal = ref(null);

    const editRow = (data) => {
      openEditStaffModal.value = true;
      staffDetail.value = data;
    };
    const openModalNewStaff = () => {
      openCreateStaffModal.value = true;
    };

    const onChangeStatus = (data) => {
      staffDetail.value = data;
      if (staffDetail.value.status === 1) {
        titleActiveModal.value = t('are_you_sure_you_want_to_deactivate_this_account');
      } else {
        titleActiveModal.value = t('are_you_sure_you_want_to_activate_this_account');
      }
      openDialogStatus.value = true;
    };

    const onConfirmStatusPopup = () => {
      staffDetail.value.status = !staffDetail.value.status == false ? 0 : 1;
      openDialogStatus.value = false;
      updateStatusStaff(staffDetail);
    };

    const resetStaffModal = (value) => {
      // create staff modal
      openCreateStaffModal.value = value;
      // edit staff modal
      openEditStaffModal.value = value;
    };
    const { notifySaveSuccess, notifySaveFailed } = useNotify();

    const updateStatusStaff = async (staffDetail) => {
      updateStatusStaffMutation.mutate(
        { staffSn: staffDetail.value.sn, status: staffDetail.value.status },
        {
          onSuccess: () => {
            notifySaveSuccess();
          },
          onError: () => {
            staffDetail.value.status = !staffDetail.value.status == false ? 0 : 1;
            notifySaveFailed();
          },
        },
      );
    };

    return {
      t,
      hasPermission,
      openDialogStatus,
      currentPage,
      editRow,
      openModalNewStaff,
      onChangeStatus,
      onConfirmStatusPopup,
      resetStaffModal,
      columns,
      status,
      data,
      isFetching,
      openCreateStaffModal,
      openEditStaffModal,
      staffDetail,
      titleActiveModal,
      formatIndexTable,
    };
  },
};
</script>

<style scoped>
.limit-text {
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
