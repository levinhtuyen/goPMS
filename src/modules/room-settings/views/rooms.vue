<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '~/composable/useI18n';
import RoomForm from '~/modules/room-settings/components/room-form.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const isOpen = ref(false);

const roomSn = computed<'new' | number | null>(() => {
  const { roomSn } = route.params;
  if (Array.isArray(roomSn)) return null;
  if (roomSn === 'new') return 'new';
  if (typeof +roomSn === 'number') return +roomSn;
  return null;
});

onMounted(() => (isOpen.value = true));

const onHide = () => {
  router.replace({ path: '/settings/room-settings', query: route.query });
};
</script>

<template>
  <q-dialog v-if="roomSn" v-model="isOpen" @hide="onHide">
    <q-card style="width: 550px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6 q-pl-md text-weight-bold">
          {{ roomSn === 'new' ? t('new_room') : t('edit_room') }}
          <!-- {{ router.options.history.state.roomName }} -->
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <RoomForm :room-sn="roomSn" @on-request-success="isOpen = false" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
