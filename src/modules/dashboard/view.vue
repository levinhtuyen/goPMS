<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { formatMoney } from '~/composable/useFormat';
import { useI18n } from '~/composable/useI18n';
import PieChart from './components/PieChart.vue';
import { useDashboardQuery, ISuggestedPrice } from './apis/useDashboardQuery';
import ReservationDialog from '~/modules/booking/room-view/components/ReservationDialog.vue';

interface IRow {
  name: string;
  label: string;
  field: string;
  align: TAlignColumn;
  style: string;
}
type TAlignColumn = 'left' | 'right' | 'center' | undefined;
// data
const { t } = useI18n();
const reservationDialogRef = ref<InstanceType<typeof ReservationDialog> | null>(null);
const { data, isFetching } = useDashboardQuery();
const reservationDialogVisible = ref(false);
const roomTypeRow: IRow = {
  name: 'name',
  label: 'room_type_name',
  field: 'name',
  align: 'left' as TAlignColumn,
  style: 'width: 500px',
};
const columns = ref<IRow[]>([]);
const rows = ref<ISuggestedPrice[]>([]);
watch(isFetching, (val) => {
  const labelHeader = ref<string[] | null>([]);
  if (data?.value?.suggestedPrice[0]) {
    labelHeader.value = Object.keys(data.value.suggestedPrice[0]).filter((val) => {
      return val !== 'name' && val !== 'sn';
    });
  } // get num of hour(s) from BE and set to header (ex: 1 hour(s), 2 hour(s))
  const hourRow =
    labelHeader?.value?.map((val) => ({
      name: val,
      label: val,
      field: val,
      align: 'center' as TAlignColumn,
      style: 'min-width: 200px',
    })) || [];
  if (val === false) {
    columns.value = [...[roomTypeRow], ...hourRow];
  }
  rows.value = data.value?.suggestedPrice || []; // set data table
  minLeft(Number(data?.value?.now) * 1000 || Date.now()); // set time to reset browser
});
// method
const isIncrease = (presentStatus: number) => {
  return presentStatus === 1
    ? 'arrow_drop_down'
    : presentStatus === 2
    ? 'arrow_drop_up'
    : presentStatus === 0
    ? 'remove'
    : '';
};
onMounted(() => {
  minLeft(Date.now());
});
// method
const minLeft = (timestamp: number) => {
  const date = new Date(timestamp);
  const minLeft = 60 - date.getMinutes();
  const milSecond = minLeft * 60 * 1000 - date.getSeconds();
  setInterval(() => {
    location.reload();
  }, milSecond);
};
const onOpenReservationModal = (isUseSuggested: number, roomTypeSn: number, colName: string) => {
  const num = colName.split('hours').join('');
  reservationDialogVisible.value = true;
  (reservationDialogRef.value as any)?.setupReservationDialog(
    roomTypeSn,
    null,
    num,
    isUseSuggested,
  );
};
const onCloseReservationModal = () => {
  reservationDialogVisible.value = false;
};
</script>
<template>
  <pms-sections>
    <div class="q-mx-40">
      <h4 class="text-bold q-mb-md q-mt-none">
        {{ t('dashboard') }}
      </h4>
      <div class="row" style="justify-content: center">
        <div
          class="col-md-6 col-xs-12 dashboard-box shadow-11"
          :class="$q.screen.gt.md ? 'q-mr-xl' : 'q-mb-md'"
        >
          <span class="checked-in-box-border box-border float-left" />
          <div class="q-py-md q-pl-md float-right full-width">
            <div class="inline-block float-left">
              <p class="text-h4 text-bold">{{ t('dashboard_checked_in') }}</p>
              <p>
                <span class="text-h4 text-bold q-mr-sm" style="color: #3e3c7b">{{
                  data?.totalCheckedInBooking
                }}</span>
                <span class="text-h5 text-bold">{{ t('booking(s)') }}</span>
              </p>
            </div>
            <div class="inline-block float-right">
              <p class="text-bold text-subtitle1 text-center q-mb-none">{{ t('occupancy') }}</p>
              <div class="chart">
                <pie-chart :data="data?.occupancy" :chart-color="'#6445CE'" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-xs-12 dashboard-box shadow-11">
          <span class="revenue-box-border box-border float-left" />
          <div class="q-py-md q-pl-md float-right full-width">
            <div class="inline-block float-left">
              <p class="text-h4 text-bold">{{ t('revenue') }}</p>
              <p>
                <span class="text-h4 text-bold q-mr-sm" style="color: #3e3c7b">{{
                  formatMoney(data?.revenue)
                }}</span>
                <span class="text-h5 text-bold">VND</span>
              </p>
            </div>
            <div class="inline-block float-right">
              <p class="text-bold text-subtitle1 text-center q-mb-none">{{ t('efficiency') }}</p>
              <div class="chart">
                <pie-chart :data="data?.efficiency" :chart-color="'#D84D9C'" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </pms-sections>
  <pms-sections>
    <div class="q-mx-40">
      <h4 class="text-bold q-mb-md q-mt-none">
        {{ t('suggested_price') }}
      </h4>
      <div class="flex q-mb-md">
        <p class="flex q-mr-lg">
          <span class="box default-price" />
          <span class="text-bold q-ml-xs text-subtitle1">{{ t('default_price') }}</span>
        </p>
        <p class="flex">
          <span class="box suggested-price" />
          <span class="text-bold q-ml-xs text-subtitle1">{{ t('suggested_price') }}</span>
        </p>
      </div>
      <q-table
        class="sticky-table"
        :rows="rows"
        :columns="columns"
        row-key="name"
        hide-pagination
        hide-bottom
        :table-colspan="9"
        dense
        :rows-per-page-options="[0]"
        separator="cell"
      >
        <template #header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ t(col.label) }}
            </q-th>
          </q-tr>
        </template>
        <template #body="props">
          <q-tr>
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="q-px-none">
              <div
                v-if="typeof props.row[col.name] == 'object'"
                class="row custom-cell full-width q-ma-sm"
              >
                <div
                  :class="props.row[col.name].suggestedPrice ? 'col-md-8 col-sm-8' : 'col-md-12'"
                >
                  <div
                    v-if="props.row[col.name].defaultPrice"
                    class="q-mb-sm cursor-pointer"
                    @click="onOpenReservationModal(0, props.row.sn, col.name)"
                  >
                    <p
                      class="price default-price"
                      :class="!props.row[col.name].suggestedPrice ? 'q-mb-none' : ''"
                    >
                      {{ formatMoney(props.row[col.name].defaultPrice) }} VND
                    </p>
                  </div>
                  <div
                    v-if="
                      typeof props.row[col.name].statusPercent !== null &&
                      props.row[col.name].suggestedPrice
                    "
                    class="q-mb-none cursor-pointer"
                    @click="onOpenReservationModal(1, props.row.sn, col.name)"
                  >
                    <span
                      v-if="props.row[col.name].statusPercent !== 0"
                      class="price suggested-price"
                    >
                      {{ formatMoney(props.row[col.name].suggestedPrice) }} VND
                    </span>
                    <span v-else class="price suggested-price">
                      {{ formatMoney(props.row[col.name].defaultPrice) }} VND
                    </span>
                  </div>
                </div>
                <div
                  v-if="
                    typeof props.row[col.name].statusPercent !== null &&
                    props.row[col.name].suggestedPrice
                  "
                  class="col-md-4 col-sm-4"
                >
                  <p class="percent" />
                  <p
                    class="q-mb-none q-ml-xs percent flex"
                    :class="props.row[col.name].statusPercent === 1 ? 'text-red' : 'text-blue'"
                  >
                    <span v-if="props.row[col.name].percent">
                      {{ props.row[col.name].percent }}%
                    </span>
                    <span class="material-icons">
                      {{ isIncrease(props.row[col.name].statusPercent) }}
                    </span>
                  </p>
                </div>
              </div>
              <p v-else class="q-mb-none text-bold">
                {{ props.row[col.name] }}
              </p>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </pms-sections>
  <reservation-dialog
    ref="reservationDialogRef"
    v-model="reservationDialogVisible"
    @create-success="onCloseReservationModal()"
  />
</template>
<style lang="scss" scoped>
.q-mx-40 {
  margin: 0 40px;
}
.custom-cell {
  min-height: 60px;
  div {
    margin: auto;
  }
}
.box {
  display: inline-block;
  width: 19px;
  height: 16px;
  margin: auto;
}
.dashboard-box {
  height: 145px;
  width: 430px;
  display: flex;
  border-radius: 4px;
}
.box-border {
  display: inline-block;
  height: 95%;
  width: 7px;
  margin: auto 0;
  border-radius: 4px;
}
.checked-in-box-border {
  background-color: #6445ce;
}
.revenue-box-border {
  background-color: #d84d9c;
}
.sticky-table {
  max-height: 470px;
  td:first-child {
    background-color: #fff !important;
  }
  tr {
    th {
      position: sticky;
      z-index: 2;
      background: #fff;
      height: 80px;
    }
  }
  thead {
    tr:last-child {
      th {
        top: 48px;
        z-index: 3;
      }
    }
    tr:first-child {
      th {
        top: 0;
        z-index: 1;
      }
      th:first-child {
        z-index: 3;
      }
    }
  }
  td:first-child {
    z-index: 1;
  }
  td:first-child,
  th:first-child {
    position: sticky;
    left: 0;
  }
}
.price {
  height: 22px;
  display: inline-block;
  padding: 0 15px;
  box-shadow: 0px 7px 27px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
}
.percent {
  height: 22px;
  display: block;
}
.default-price {
  background-color: $lime-2;
}
.suggested-price {
  background-color: $light-blue-2;
}
</style>
