<script setup lang="ts">
import { useI18n } from '~/composable/useI18n';
import { ref, watch, computed } from 'vue';
import ModalEditGuest from '~/modules/guests/components/form-edit-guest.vue';
import ModalGuestCreate from '~/modules/guests/components/form-create-guest.vue';
import ModalGuestHistory from '~/modules/guests/components/modal-history-guest.vue';
import { useGuestCountryQuery } from './apis/useGuestContryQuery';
import { useCountryListQuery } from './apis/useContryQuery';
import { useGuestQuery } from './apis/useGuestQuery';
import { useAuth } from '~/composable/useAuth';
import { formatIndexTable } from '~/composable/useFormat';
import { date } from 'quasar';
import { FORMAT_DATE_UI } from '~/constants';
import { i18n } from '~/plugins/i18n';

const { t } = useI18n();

type TAlignColumn = 'left' | 'right' | 'center' | undefined;
const columns = computed(() => [
  {
    name: 'index',
    align: 'left' as TAlignColumn,
    label: t('no'),
    field: 'index',
  },
  {
    name: 'fullName',
    align: 'left' as TAlignColumn,
    label: t('guest_name'),
    field: 'fullName',
  },
  {
    name: 'identityNumber',
    align: 'left' as TAlignColumn,
    label: t('identity_number'),
    field: 'identityNumber',
  },
  {
    name: 'address',
    align: 'left' as TAlignColumn,
    label: t('address'),
    field: 'address',
  },
  {
    name: 'mobile',
    align: 'left' as TAlignColumn,
    label: t('phone_number'),
    field: 'mobile',
  },
  {
    name: 'email',
    align: 'left' as TAlignColumn,
    label: t('email'),
    field: 'email',
  },
  {
    name: 'birthday',
    align: 'left' as TAlignColumn,
    label: t('birthday'),
    field: 'birthday',
  },
  {
    name: 'countryName',
    align: 'center' as TAlignColumn,
    label: t('country'),
    field: 'countryName',
  },

  {
    name: 'action',
    align: 'left' as TAlignColumn,
    label: '',
    field: 'action',
  },
]);

const guestEditRef = ref<InstanceType<typeof ModalEditGuest> | null>(null);
const guestHistoryRef = ref<InstanceType<typeof ModalGuestHistory> | null>(null);
const guestCreateRef = ref<InstanceType<typeof ModalGuestCreate> | null>(null);
// page number
const pagination = ref({
  currentPage: 1,
});
const keywordSearch = ref('');
// const filterCountry = ref({
//   sn: 0,
//   name: 'Select country',
//   isoCode: '0',
//   countryCode: 'VN',
//   currency: 'VND',
// });

const { hasPermission } = useAuth();
//get data country
const keywordCountrySearch = ref('');
let {
  data: contryData,
  isFetching: contryFetching,
  refetch: refetchCountryList,
} = useGuestCountryQuery();
let { data: countryDataTotal } = useCountryListQuery(keywordCountrySearch);

const contryOptions = ref<Array<object>>([]);
const filterCountry = ref(0);

const getContryList = () => {
  const contries = contryData?.value || [];
  contryOptions.value = [
    {
      sn: 0,
      name: t('select_country'),
      isoCode: '0',
      countryCode: 'VN',
      currency: 'VND',
    },
    ...JSON.parse(JSON.stringify(contries)),
  ];
};

// const reformatDate = (date: string) => {
//   if (!date) {
//     return;
//   }
//   const [day, month, year] = date.split('-');
//   return `${year}/${month}/${day}`;
// };
let {
  data: dataGuestList,
  isLoading: guestListLoading,
  refetch: refetchGuestList,
} = useGuestQuery({
  page: pagination,
  limit: 10,
  keyword: keywordSearch,
  countrySn: filterCountry,
});
const getFlagCountry = (countrySn: string) => {
  if (!countryDataTotal.value) {
    return '';
  }
  const countryResult: any = countryDataTotal?.value?.filter((item: any) => item.sn === countrySn);
  const imageURL = `flag_${countryResult[0]?.countryCode.toLowerCase()}.png`;
  return new URL(`../../assets/area/${imageURL}`, import.meta.url).href;
};
// set defaul flag modals
const guestCreateDialogVisiable = ref(false);
const guestHistoryDialogVisiable = ref(false);
const guestEditDialogVisiable = ref(false);
// method action
const closePopupGuest = () => {
  guestCreateDialogVisiable.value = false;
  guestEditDialogVisiable.value = false;
  guestHistoryDialogVisiable.value = false;
  refetchGuestList.value();
  refetchCountryList.value();
};
const addGuest = () => {
  guestCreateDialogVisiable.value = true;
  (guestCreateRef.value as any)?.setupGuestCreateDialog();
};
watch(keywordSearch, () => {
  pagination.value.currentPage = 1;
});
watch(filterCountry, () => {
  pagination.value.currentPage = 1;
});

watch(contryFetching, () => {
  getContryList();
});

watch(
  () => (i18n.global.locale as any).value,
  () => {
    refetchCountryList.value();
    getContryList();
  },
);

const editGuests = async (row: any) => {
  guestEditDialogVisiable.value = true;
  (guestEditRef.value as any)?.setupGuestEditDialog(Number(row.sn));
};
const directHistory = async (row: any) => {
  guestHistoryDialogVisiable.value = true;
  (guestHistoryRef.value as any)?.setupGuestHistoryDialog(Number(row.sn), String(row.fullName));
};
</script>

<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md justify-between">
        <div class="text-h5 text-bold">{{ t('guest_list') }}</div>
        <div class="q-gutter-sm">
          <q-btn
            color="negative"
            icon="add"
            no-caps
            :label="t('add_new_guest')"
            :class="hasPermission('add-edit-guest') === false ? 'hidden' : ''"
            @click="addGuest()"
          />
        </div>
      </div>
    </template>

    <div class="row q-mb-md">
      <q-input
        v-model="keywordSearch"
        outlined
        dense
        class="col-md-5 col-sm-12 col-xs-12 rounded-borders q-pb-sm"
        debounce="300"
        :placeholder="t('search_by_guest_name_identity_number_phone_number')"
      >
        <template #prepend>
          <q-icon name="search"></q-icon>
        </template>
      </q-input>
      <div class="col-md-3 col-sm-12 col-xs-12">
        <div>
          <q-select
            v-model="filterCountry"
            :loading="contryFetching"
            :options="contryOptions"
            dense
            class="q-pl-sm"
            filled
            option-value="sn"
            option-label="name"
            map-options
            emit-value
          />
        </div>
      </div>
    </div>

    <div v-if="guestListLoading" class="full-width full-height q-mt-md row justify-center">
      <q-inner-loading :showing="guestListLoading">
        <div lass="full-width full-height q-mt-md row justify-center">
          <q-spinner color="negative" :thickness="2" size="2em" />
        </div>
      </q-inner-loading>
    </div>
    <div v-else>
      <q-table
        v-if="dataGuestList"
        :rows="dataGuestList?.data?.guestList"
        :columns="columns"
        :table-colspan="9"
        row-key="index"
        no-data-label="No data"
        :virtual-scroll-item-size="48"
        :rows-per-page-options="[0]"
        hide-pagination
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
            <q-td key="index">
              {{ formatIndexTable(pagination.currentPage, props.pageIndex) }}
            </q-td>
            <q-td key="fullName">
              <div class="row align-left">{{ props.row.fullName }}</div>
            </q-td>
            <q-td key="identityNumber">
              <div class="row align-left">{{ props.row.identityNumber }}</div>
            </q-td>
            <q-td key="address">
              <div class="row align-left">
                <div class="limit-text">
                  {{ props.row.address }}
                  <q-tooltip>{{ props.row.address }}</q-tooltip>
                </div>
              </div>
            </q-td>
            <q-td key="mobile"
              ><div class="row align-left">{{ props.row.mobile }}</div>
            </q-td>
            <q-td key="email"
              ><div class="row align-left">
                <div class="limit-text">
                  {{ props.row.email }}<q-tooltip>{{ props.row.email }}</q-tooltip>
                </div>
              </div>
            </q-td>
            <q-td key="birthday"
              ><div class="row align-left">
                {{
                  props.row.birthday
                    ? date.formatDate(props.row.birthday * 1000.0, FORMAT_DATE_UI)
                    : ''
                }}
              </div>
            </q-td>
            <q-td key="countryName" class="row justify-center">
              <img class="set-width" :src="getFlagCountry(props.row.countrySn)" />
            </q-td>
            <q-td>
              <q-btn icon-right="more_vert" no-caps flat dense>
                <q-menu cover auto-close>
                  <q-list>
                    <q-item
                      clickable
                      flat
                      round
                      :class="hasPermission('add-edit-guest') === false ? 'hidden' : ''"
                      @click="editGuests(props.row)"
                    >
                      <q-item-section>{{ t('edit') }} </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      :class="hasPermission('guest-history') === false ? 'hidden' : ''"
                      flat
                      @click="directHistory(props.row)"
                    >
                      <q-item-section>{{ t('history') }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </q-tr>
        </template>

        <!-- slot name syntax: body-cell-<column_name> -->
      </q-table>
      <div class="row justify-end q-mt-md">
        <q-pagination
          v-model="pagination.currentPage"
          :max="dataGuestList?.data?.meta.lastPage || 1"
          :max-pages="6"
          color="negative"
          direction-links
        />
      </div>
    </div>
    <!-- modal guest history -->
    <ModalGuestHistory
      ref="guestHistoryRef"
      v-model="guestHistoryDialogVisiable"
      @close="closePopupGuest"
    />

    <!-- modal guest create -->
    <ModalGuestCreate
      ref="guestCreateRef"
      v-model="guestCreateDialogVisiable"
      @close="closePopupGuest"
    />

    <!-- modal guest edit -->

    <ModalEditGuest ref="guestEditRef" v-model="guestEditDialogVisiable" @close="closePopupGuest" />
    <!-- </div> -->
    <!-- </div> -->
  </pms-sections>
</template>
<style lang="sass" scoped>
.custom-size-dialog
  width: 876px
  .custom-size-dialog-card
    width: 876px
  .q-dialog__inner--minimized div
    max-width: 876px
.set-width
  width: 30px
.limit-text
  width: 200px
  max-height: 20px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  text-align: left
</style>
