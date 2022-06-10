<script lang="ts">
import { useI18n } from '~/composable/useI18n';
import { useRoute } from 'vue-router';
import FlagUk from '~/components/icons/flag-UK.vue';
import FlagVn from '~/components/icons/flag-VN.vue';
import SignUpFromEmail from './components/sign-up-from-email.vue';
import SignUpToEmail from './components/sign-up-to-email.vue';

export default {
  components: {
    FlagUk,
    FlagVn,
    SignUpFromEmail,
    SignUpToEmail,
  },
  setup() {
    const { toggleLocale, locale, t } = useI18n();

    const route = useRoute();

    return {
      t,
      toggleLocale,
      locale,
      route,
    };
  },
};
</script>

<template>
  <div class="row justify-end q-ma-md">
    <q-btn round flat @click="toggleLocale">
      <q-icon>
        <flag-uk v-if="locale === 'en-US'" />
        <flag-vn v-else />
      </q-icon>
    </q-btn>
  </div>
  <div class="col-12 col-md-12">
    <h3 class="text-bold text-center">{{ t('register_now') }}</h3>
  </div>

  <sign-up-to-email v-if="!route.query.token" />
  <sign-up-from-email v-else />
</template>
