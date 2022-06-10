<script setup lang="ts">
import { computed, ref, inject, onMounted, reactive } from 'vue';
// import { useToken } from '~/api/authentication/useToken';
import Logo3d from '~/components/gopms/logo-3d.vue';
import LogoLetter from '~/components/gopms/logo-letter.vue';
import { useI18n } from '~/composable/useI18n';
import FlagUK from '~/components/icons/flag-UK.vue';
import FlagVN from '~/components/icons/flag-VN.vue';
import { useAuth } from '~/composable/useAuth';
import { LS_HOTEL_NAME, LS_PROFILE } from '~/constants';
import { Emitter } from 'mitt';
import ShiftHandover from '~/assets/images/shift-handover.png';
import ReservationDialog from '~/modules/booking/room-view/components/ReservationDialog.vue';

interface IScrollLayoutDetails {
  position: number;
  direction: string;
  directionChanged: boolean;
  delta: number;
  inflectionPoint: number;
}
const reservationDialogRef = ref<InstanceType<typeof ReservationDialog> | null>(null);
const { signOut, hasPermission } = useAuth();
const isShadowHeader = ref<boolean>(false);
const userName = ref('');
const hotelName = ref('');
userName.value = JSON.parse(localStorage.getItem(LS_PROFILE) || '{}')?.value?.fullName;
hotelName.value = JSON.parse(localStorage.getItem(LS_HOTEL_NAME) || '{}')?.value;
const headerRef = ref<HTMLFormElement>();
const miniState = ref(true);
const drawer = ref(true);
const emitter = inject('emitter') as Emitter<any>;
const { t, toggleLocale } = useI18n();

onMounted(() => {
  emitter.on('changeHotelInfo', async () => {
    hotelName.value = JSON.parse(localStorage.getItem(LS_HOTEL_NAME) || '{}')?.value;
  });
  emitter.on('changeProfileInfo', async () => {
    userName.value = JSON.parse(localStorage.getItem(LS_PROFILE) || '{}')?.value.fullName;
  });
});
const links = computed(() => [
  { to: '/homepage', iconName: 'house', text: t('menu.homepage'), permission: 'homepage' },
  { to: '/dashboard', iconName: 'dashboard', text: t('menu.dashboard') },
  {
    to: '/room-view',
    iconName: 'calendar_view_month',
    text: t('menu.room_view_mode'),
    permission: 'room-view-mode',
  },
  // { to: '/bookings', iconName: 'auto_stories', text: t('booking', 99) },
  {
    to: '/guests',
    iconName: 'people',
    text: t('menu.guest_management', 99),
    permission: 'guest-management',
    actives: ['Guests'],
  },
]);

const inventoryLinks = computed(() => [
  {
    to: '/services',
    iconName: 'room_service',
    text: t('menu.extra_services', 99),
    permission: 'extra-service',
    actives: ['Services'],
  },
  {
    to: '/settings/stock',
    iconName: 'warehouse',
    text: t('menu.stock_management'),
    permission: 'stock-management',
  },
]);

const cashTransactionslinks = computed(() => [
  {
    to: '/settings/cash-transactions',
    iconName: 'account_balance',
    text: t('menu.cash_transactions'),
    permission: 'cash-transactions',
  },
]);
const statistics = computed(() => [
  {
    to: '/statistics-report',
    iconName: 'assessment',
    text: t('menu.statistics'),
    permission: 'statistics',
  },
]);
const staffManagementlinks = computed(() => [
  {
    to: '/settings/staff',
    iconName: 'badge',
    text: t('menu.staff_management'),
    permission: 'staff-management',
    actives: ['Staff'],
  },
]);
const reportLinks = computed(() => [
  {
    to: '/report/revenue-report',
    iconName: 'request_quote',
    text: t('menu.revenue_report'),
    permission: 'revenue-report',
    actives: ['Information'],
  },
  // { to: '/reports/transactions', iconName: 'paid', text: t('transaction') },
  {
    to: '/report/debt-summary-report',
    iconName: 'account_balance_wallet',
    text: t('menu.debt_summary_report'),
    permission: 'debt-summary-report',
    actives: ['Information'],
  },
  {
    to: '/report/shift-handover-report',
    iconName: 'work',
    text: t('menu.shift_handover_report'),
    permission: 'shift-handover-report',
  },
  {
    to: '/report/services-deletion-report',
    iconName: 'delete_sweep',
    text: t('menu.service_deletion_report'),
    permission: 'services-deletion-report',
    actives: ['Information'],
  },
  {
    to: '/report/hotel-activities-log',
    iconName: 'density_small',
    text: t('menu.hotel_activities_log'),
    permission: 'hotel-activities-log',
  },
  {
    to: '/report/change-room-report',
    iconName: 'change_circle',
    text: t('menu.change_room_report'),
    permission: 'change-room-report',
    actives: ['Information'],
  },
  {
    to: '/report/cash-profit-report',
    iconName: 'trending_up',
    text: t('menu.profit_report'),
    permission: 'profit-report',
  },
]);
const settingLinks = computed(() => [
  {
    to: '/settings/information',
    iconName: 'info',
    text: t('menu.hotel_information'),
    permission: 'hotel-information',
    actives: ['Information'],
  },
  {
    to: '/settings/policies',
    iconName: 'policy',
    text: t('menu.policy'),
    permission: 'policy',
    actives: ['Policies'],
  },
  {
    to: '/settings/room-settings',
    iconName: 'room_preferences',
    text: t('menu.room_configuration'),
    permission: 'room-configuration',
  },
  { to: '/settings/rate-structures', iconName: 'price_change', text: t('rate_structure') },
  {
    to: '/settings/hotel-price-setting',
    iconName: 'sell',
    text: t('menu.pricing_configuration'),
    permission: 'pricing-configuration',
  },
  {
    to: '/settings/booking-sources',
    iconName: 'source',
    text: t('menu.booking_source'),
    permission: 'booking-source',
  },
  {
    to: '/settings/cashiering',
    iconName: 'payments',
    text: t('menu.cashiering'),
    permission: 'cashiering',
    actives: ['Cashiering'],
  },
]);
const scrollBody = (details: IScrollLayoutDetails) => {
  isShadowHeader.value = details.position > 40;
};
const toggleDrawer = () => {
  miniState.value = !miniState.value;
  drawer.value = true;
};
const flag = ref(localStorage.getItem('language') ?? 'en-US');
const changeLocale = (flagChoose: any) => {
  flagChoose === 'en-US' ? (flag.value = 'vi-VN') : (flag.value = 'en-US');
  localStorage.setItem('language', flag.value);
  toggleLocale();
};
const ui = reactive({
  reservationDialogVisible: false,
});
// methods
const onOpenReservationModal = () => {
  ui.reservationDialogVisible = true;
  (reservationDialogRef.value as any)?.setupReservationDialog();
};
const onCloseReservationModal = () => {
  ui.reservationDialogVisible = false;
  emitter.emit('changeRoomViewMode');
};
</script>

<template>
  <q-layout view="hHh Lpr lff" @scroll="scrollBody">
    <q-header ref="headerRef" :elevated="isShadowHeader" class="bg-white">
      <q-toolbar class="q-pr-lg" style="height: 60px">
        <q-btn flat round dense icon="menu" color="black" @click="toggleDrawer" />
        <q-toolbar-title class="logo">
          <q-btn flat dense to="/">
            <Logo3d class="logo-3d" />
            <LogoLetter class="text-orange-9 logo-letter" />
          </q-btn>
        </q-toolbar-title>
        <q-space />
        <div class="cursor-pointer row items-center">
          <q-btn
            outline
            no-caps
            class="text-weight-bold q-mr-md"
            color="deep-orange"
            :label="$q.screen.gt.xs ? t('make_reservation') : void 0"
            icon="add_circle"
            size="sm"
            style="font-size: 12px; border-radius: 8px"
            :class="hasPermission('quick-reservation') === false ? 'hidden' : ''"
            @click="onOpenReservationModal()"
          />
          <span class="text-body1 text-negative q-mr-xl text-bold hotel-name">
            {{ hotelName }}
          </span>
          <q-btn stretch flat class="q-mr-lg" @click="changeLocale(flag)">
            <FlagUK v-if="flag === 'en-US'" class="flag" />
            <FlagVN v-else class="flag" />
          </q-btn>
          <div class="row items-center">
            <q-avatar size="34px" color="negative">
              <span class="text-body1">{{ userName?.charAt(0) }}</span>
            </q-avatar>
            <p class="text-dark q-ml-xs block q-mb-none text-weight-medium text-body2">
              {{ userName }}
            </p>
            <q-menu :offset="[50, 10]" transition-show="jump-down" transition-hide="jump-up">
              <q-list style="min-width: 200px">
                <q-item v-close-popup clickable to="/profile">
                  <q-item-section
                    class="items-center justify-start"
                    style="flex-direction: row; justify-content: start"
                  >
                    <q-icon
                      name="person"
                      class="text-h6 q-mr-sm"
                      style="line-height: 1.5rem"
                    ></q-icon>
                    <span>{{ t('my_account') }}</span>
                  </q-item-section>
                </q-item>

                <q-item
                  v-if="hasPermission('shift-handover')"
                  v-close-popup
                  clickable
                  to="/shift-handover"
                >
                  <q-item-section
                    class="items-center justify-start"
                    style="flex-direction: row; justify-content: start"
                  >
                    <img :src="ShiftHandover" class="q-mr-sm" />

                    <span>{{ t('shift_handover') }}</span>
                  </q-item-section>
                </q-item>

                <q-item v-close-popup clickable>
                  <q-item-section
                    class="items-center justify-start"
                    style="flex-direction: row; justify-content: start"
                    @click="signOut()"
                  >
                    <q-icon
                      name="logout"
                      class="text-h6 q-mr-sm"
                      style="line-height: 1.5rem"
                    ></q-icon>
                    <span>{{ t('sign_out') }}</span>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      :width="240"
      :breakpoint="500"
      bordered
      class="bg-white"
    >
      <q-scroll-area class="fit custom-text-menu">
        <q-list padding>
          <q-item
            v-for="({ iconName, text, to, permission }, index) in links"
            :key="index"
            class="custom-menu"
            :to="to"
            clickable
            :class="[
              permission && hasPermission(permission) === false ? 'hidden' : '',
              $route.meta.pathActive === to ? 'text-negative' : '',
            ]"
          >
            <q-item-section avatar>
              <q-icon :name="iconName" />
            </q-item-section>
            <q-item-section>
              <span :class="$route.meta.pathActive === to ? 'text-negative' : ''">{{ text }}</span>
            </q-item-section>
          </q-item>

          <q-expansion-item
            v-if="hasPermission('inventory-management')"
            class="custom-menu"
            :label="t('menu.inventory', 99)"
            icon="inventory_2"
            :content-inset-level="0.5"
            :class="{
              'drawer__item--active': $route.meta.parentActive === '/inventory',
            }"
            :style="{ color: $route.meta.parentActive === '/inventory' ? '#FF6400' : '' }"
          >
            <q-item
              v-for="{ iconName, text, to, permission } in inventoryLinks"
              :key="to"
              :to="to"
              clickable
              :class="[
                hasPermission(permission) === false ? 'hidden' : '',
                $route.meta.pathActive === to || $route.path === to ? 'text-negative' : 'text-dark',
              ]"
            >
              <q-item-section avatar>
                <q-icon :name="iconName" />
              </q-item-section>
              <q-item-section
                ><span
                  :class="
                    $route.meta.pathActive === to || $route.path === to ? 'text-negative' : ''
                  "
                  >{{ text }}</span
                ></q-item-section
              >
            </q-item>
          </q-expansion-item>

          <q-item
            v-for="({ iconName, text, to, permission }, index) in cashTransactionslinks"
            :key="index"
            class="custom-menu"
            :to="to"
            clickable
            :class="[
              hasPermission(permission) === false ? 'hidden' : '',
              $route.meta.pathActive === to ? 'text-negative' : '',
            ]"
          >
            <q-item-section avatar>
              <q-icon :name="iconName" />
            </q-item-section>
            <q-item-section
              ><span>{{ text }}</span></q-item-section
            >
          </q-item>
          <q-item
            v-for="({ iconName, text, to, permission }, index) in statistics"
            :key="index"
            class="custom-menu"
            :to="to"
            clickable
            :class="[
              hasPermission(permission) === false ? 'hidden' : '',
              $route.meta.pathActive === to ? 'text-negative' : '',
            ]"
          >
            <q-item-section avatar>
              <q-icon :name="iconName" />
            </q-item-section>
            <q-item-section
              ><span>{{ text }}</span></q-item-section
            >
          </q-item>

          <q-expansion-item
            v-if="hasPermission('report')"
            class="custom-menu"
            :label="t('menu.report', 99)"
            icon="summarize"
            :content-inset-level="0.5"
            :class="{
              'drawer__item--active': $route.meta.parentActive === '/report',
            }"
            :style="{ color: $route.meta.parentActive === '/report' ? '#FF6400' : '' }"
          >
            <q-item
              v-for="{ iconName, text, to, permission } in reportLinks"
              :key="to"
              :to="to"
              clickable
              :class="[
                hasPermission(permission) === false ? 'hidden' : '',
                $route.meta.pathActive === to || $route.path === to ? 'text-negative' : 'text-dark',
              ]"
            >
              <q-item-section avatar>
                <q-icon :name="iconName" />
              </q-item-section>
              <q-item-section
                ><span
                  :class="
                    $route.meta.pathActive === to || $route.path === to ? 'text-negative' : ''
                  "
                  >{{ text }}</span
                ></q-item-section
              >
            </q-item>
          </q-expansion-item>

          <q-item
            v-for="({ iconName, text, to, permission }, index) in staffManagementlinks"
            :key="index"
            class="custom-menu"
            :to="to"
            clickable
            :class="[
              hasPermission(permission) === false ? 'hidden' : '',
              $route.meta.pathActive === to ? 'text-negative' : '',
            ]"
          >
            <q-item-section avatar>
              <q-icon :name="iconName" />
            </q-item-section>
            <q-item-section>
              <span
                :class="$route.meta.pathActive === to || $route.path === to ? 'text-negative' : ''"
                >{{ text }}</span
              >
            </q-item-section>
          </q-item>

          <q-expansion-item
            v-if="hasPermission('configuration')"
            class="custom-menu"
            :label="t('menu.configuration', 99)"
            icon="settings"
            :content-inset-level="0.5"
            :class="{
              'drawer__item--active': $route.meta.parentActive === '/setting',
            }"
            :style="{ color: $route.meta.parentActive === '/setting' ? '#FF6400' : '' }"
          >
            <q-item
              v-for="{ iconName, text, to, permission } in settingLinks"
              :key="to"
              :to="to"
              clickable
              :class="[
                hasPermission(permission) === false ? 'hidden' : '',
                $route.meta.pathActive === to || $route.path === to ? 'text-negative' : 'text-dark',
              ]"
            >
              <q-item-section avatar>
                <q-icon :name="iconName" />
              </q-item-section>
              <q-item-section
                ><span
                  :class="
                    $route.meta.pathActive === to || $route.path === to ? 'text-negative' : ''
                  "
                  >{{ text }}</span
                ></q-item-section
              >
            </q-item>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <q-page class="bg-brown-1 q-pa-md" padding>
        <router-view />
      </q-page>
    </q-page-container>
    <reservation-dialog
      ref="reservationDialogRef"
      v-model="ui.reservationDialogVisible"
      @create-success="onCloseReservationModal()"
    />
  </q-layout>
</template>

<style scoped lang="scss">
.flag {
  width: 1.5rem;
}
.logo-3d {
  height: 2rem;
}
.logo-letter {
  height: 1rem;
  margin-left: 0.5rem;
}
.logo {
  // max-width: 60px;
  @media only screen and (max-width: 600px) {
    flex: 2;
    max-width: 150px;
  }
}
.hotel-name {
  @media only screen and (max-width: 600px) {
    display: none;
  }
}
.q-router-link--exact-active {
  color: #ff6400;
}

.q-router-link--exact-active .q-item__section span {
  color: #ff6400;
}

.drawer__item--active :deep(.q-expansion-item__toggle-icon),
.drawer__item--active :deep(.q-item__label) {
  color: #ff6400 !important;
}

.custom-menu {
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;

  span,
  .q-item__section .q-item__label,
  :deep(.q-item__section) .q-item__label {
    letter-spacing: 0.25px;
    color: #3f3f46;
  }
}
</style>
