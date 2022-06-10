<script setup lang="ts">
import SignInForm from './components/sign-in-form.vue';
import FlagUk from '~/components/icons/flag-UK.vue';
import FlagVn from '~/components/icons/flag-VN.vue';
import { ref } from 'vue';
import { useI18n } from '~/composable/useI18n';

const { toggleLocale, t } = useI18n();
const flag = ref(localStorage.getItem('language') ?? 'en-US');
const changeLocale = (flagChoose: any) => {
  flagChoose === 'en-US' ? (flag.value = 'vi-VN') : (flag.value = 'en-US');
  localStorage.setItem('language', flag.value);
  toggleLocale();
};
</script>

<template>
  <div class="wrapper">
    <q-btn round class="lang-btn" flat @click="changeLocale(flag)">
      <q-icon>
        <flag-uk v-if="flag === 'en-US'" />
        <flag-vn v-else />
      </q-icon>
    </q-btn>
    <div class="container">
      <div class="text-white q-px-xl" color="primary">
        <h1 class="text-h2" color="primary">{{ t('welcome_to_gopms') }}</h1>
        <p class="text-h6">
          {{ t('you_can_manage_all_properties_easily with_the_most_convenient_system') }}
        </p>
        <p class="text-h6">
          {{ t('if_you_want_to_register_gopms_please_fill_out_the_registration_form_on_here') }}
        </p>
        <p class="text-h6">
          {{ t('support') }} :
          <a href="https://zalo.me/280180579574148514" target="_blank" rel="noopener">
            {{ t('contact_via_zalo') }}
          </a>
        </p>
        <p class="text-h6">
          {{ t('email') }} :
          <a href="mailto:info@gopms.io" target="_blank" rel="noopener">info@gopms.io</a>
        </p>
        <p class="text-h6">{{ t('hello') }}</p>
      </div>
      <q-separator color="white" vertical />
      <div class="q-px-xl">
        <sign-in-form />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: center url(~/assets/images/login-background.png);
  background-size: cover;
  .lang-btn {
    position: fixed;
    top: 6rem;
    right: 2rem;
  }
  .container {
    display: grid;
    @media screen and (min-width: $breakpoint-md-min) {
      grid-template-columns: 1.3fr auto 1fr;
    }
  }
}
</style>
