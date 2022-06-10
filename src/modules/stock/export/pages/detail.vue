<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ExportDetailModal from '../../components/export-detail-modal.vue';

const router = useRouter();
const route = useRoute();

const exportDetailModal = ref<InstanceType<typeof ExportDetailModal> | null>(null);

onMounted(() => {
  // 'as any' is used because vue-tsc fails to handle it.
  // https://github.com/vuejs/core/issues/4397
  (exportDetailModal.value as any)?.open(Number(route.params.stockSn.toString()));
});

const onHide = () => router.replace({ path: '/settings/stock/export', query: { ...route.query } });
</script>

<template>
  <ExportDetailModal ref="exportDetailModal" @hide="onHide" />
</template>
