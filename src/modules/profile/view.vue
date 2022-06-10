<script lang="ts">
export default {
  name: 'Profile',
};
</script>

<script setup lang="ts">
import MeForm from './components/me-form.vue';
import ChangePasswordForm from './components/change-password-form.vue';
import { useI18n } from '~/composable/useI18n';

const { t } = useI18n();
</script>

<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md justify-between">
        <div class="text-h5 text-bold">{{ t('my_account') }}</div>
      </div>
    </template>

    <me-form />
    <hr class="q-my-md" />
    <change-password-form />
  </pms-sections>
</template>

<style scoped lang="scss">
.wrapper {
  max-width: 1080px;
  margin: 0px auto 8rem auto;
}
</style>
