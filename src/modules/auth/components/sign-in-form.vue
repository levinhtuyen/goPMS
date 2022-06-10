<script setup lang="ts">
import type { QInput, ValidationRule } from 'quasar';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useAuth } from '~/composable/useAuth';
import { useI18n } from '~/composable/useI18n';
import { useSignInMutation } from '../apis/useSignInMutation';

const { t } = useI18n();
const auth = useAuth();
const $q = useQuasar();

const mutation = useSignInMutation();

const formValues = ref({ username: '', password: '', remember: 0 });

const emailField = ref<QInput | null>(null);
const emailRules: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => value.length <= 64 || t('the_length_is_from_1_to_64_characters'),
];
const isPwd = ref(true);
const passwordField = ref<QInput | null>(null);
const passwordRules: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => 6 <= value.length || t('this_value_is_too_short'),
];
const onSubmit = () => {
  emailField.value?.validate();
  passwordField.value?.validate();
  if (emailField.value?.error || passwordField.value?.error) return;
  mutation.mutate(formValues.value, {
    onSuccess: ({ data }) => {
      let profile = data.profile;
      profile.permission = data.permission;
      auth.signIn({
        accessToken: data.accessToken,
        expiresAt: data.expiresAt,
        profile: profile,
      });
    },
    onError: ({ response }) => {
      response?.data.error.forEach(
        (val: { message: string | undefined; [key: string]: string | object | undefined }) => {
          $q.notify({
            message: val.message,
            position: 'bottom-right',
            type: 'negative',
            actions: [{ label: 'Dismiss', color: 'white' }],
          });
        },
      );
    },
  });
};
</script>

<template>
  <q-form class="q-form form" @submit="onSubmit">
    <q-input
      ref="emailField"
      v-model="formValues.username"
      :label="t('email')"
      class="custom-input"
      :rules="emailRules"
      @focus="true"
      autogrow
      @keydown.enter.prevent=""
    />
    <q-input
      ref="passwordField"
      v-model="formValues.password"
      :label="t('password')"
      :rules="passwordRules"
      class="custom-input"
      :type="isPwd ? 'password' : 'text'"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-btn
      class="q-mt-lg"
      type="submit"
      :loading="mutation.isLoading.value"
      data-testid="sign-in-btn"
      data-cy="sign-in-btn"
    >
      {{ t('sign_in') }}
    </q-btn>
  </q-form>
</template>

<style lang="scss" scoped>
.form {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.custom-input {
  margin: 5px;
}
</style>
