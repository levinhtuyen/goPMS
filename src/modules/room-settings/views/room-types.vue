<script setup lang="ts">
import { computed, onMounted, ref, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '~/composable/useI18n';
import RoomTypeForm from '~/modules/room-settings/components/room-type-form.vue';
import { Emitter } from 'mitt';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const isOpen = ref(false);

const roomTypeSn = computed<'new' | number | null>(() => {
  const { roomTypeSn } = route.params;
  if (Array.isArray(roomTypeSn)) return null;
  if (roomTypeSn === 'new') return 'new';
  if (typeof +roomTypeSn === 'number') return +roomTypeSn;
  return null;
});
const emitter = inject('emitter') as Emitter<any>;
onMounted(() => (isOpen.value = true));

const onHide = () => {
  router.replace({ path: '/settings/room-settings', query: route.query });
};

const onRequestSuccess = (newCode?: string) => {
  if (newCode && route.query.code) {
    router.replace({ path: '/settings/room-settings', query: { code: newCode } });
    return;
  }
  isOpen.value = false;
  emitter.emit('addRoomType');
};
</script>

<template>
  <q-dialog v-if="roomTypeSn" v-model="isOpen" @hide="onHide">
    <q-card style="width: 550px; max-width: 90vw">
      <q-card-section class="q-pb-none">
        <div class="text-h6 text-weight-bold q-pl-md">
          {{ roomTypeSn === 'new' ? t('new_room_type') : t('edit_room_type') }}
          <!-- {{ router.options.history.state.code }} -->
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <RoomTypeForm :room-type-sn="roomTypeSn" @on-request-success="onRequestSuccess" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<style lang="scss" scoped></style>
