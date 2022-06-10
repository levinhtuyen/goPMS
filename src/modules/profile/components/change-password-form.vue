<script setup lang="ts">
import type { QInput, ValidationRule } from 'quasar';
import { ref } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useUpdatePasswordMutation } from '../apis/useUpdatePasswordMutation';
import { useAuth } from '~/composable/useAuth';
import { useNotify } from '~/composable/useNotify';

interface IChangePasswordFormValues {
  newPassword: string;
  curPassword: string;
  reEnterPassword: string;
}

const { t } = useI18n();
const { signOut } = useAuth();
const mutation = useUpdatePasswordMutation();
const { notifyUpdateSuccess } = useNotify();
const formValues = ref<IChangePasswordFormValues>({
  curPassword: '',
  newPassword: '',
  reEnterPassword: '',
});

const curPasswordField = ref<QInput | null>(null);
const newPasswordField = ref<QInput | null>(null);
const passwordRule: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) =>
    (8 <= value.length && 16 >= value.length) || t('the_length_is_from_8_to_16_characters'),
];
const newPasswordRule: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) =>
    (8 <= value.length && 16 >= value.length) || t('the_length_is_from_8_to_16_characters'),
  (value) => formValues.value?.curPassword != value || t('your_current_password_is_incorrect'),
];
const reEnterPasswordField = ref<QInput | null>(null);
const reEnterPasswordRule: ValidationRule<string>[] = [
  (value) => (!!value && !!formValues.value.newPassword) || t('this_field_is_required'),
  (value) =>
    (8 <= value.length && 16 >= value.length) || t('the_length_is_from_8_to_16_characters'),
  (value) =>
    formValues.value.newPassword === value ||
    t('the_new_password_and_re_enter_password_do_not_match'),
];

const revealCurPassword = ref(false);
const revealReEnterPassword = ref(false);
const revealNewPassword = ref(false);

const onSubmit = () => {
  const { curPassword, newPassword } = formValues.value;
  mutation.mutate(
    { curPassword, newPassword },
    {
      onSuccess: (response) => {
        if (response?.code === 1) {
          notifyUpdateSuccess();
          signOut();
        }
      },
    },
  );
};
</script>

<template>
  <div class="row q-pb-md justify-between">
    <div class="text-h6 text-bold">{{ t('change_password') }}</div>
  </div>

  <q-form @submit="onSubmit">
    <div class="row q-gutter-x-md">
      <div class="col">
        <p class="required text-bold q-my-xs">{{ t('current_password') }}</p>
        <q-input
          ref="curPasswordField"
          v-model="formValues.curPassword"
          outlined
          dense
          :label="t('input_current_password')"
          :rules="passwordRule"
          :type="revealCurPassword ? 'text' : 'password'"
        >
          <template #append>
            <q-icon
              :name="revealCurPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="revealCurPassword = !revealCurPassword"
            />
          </template>
        </q-input>
      </div>
      <div class="col"></div>
    </div>
    <div class="row q-gutter-x-md">
      <div class="col">
        <p class="required text-bold q-my-xs">{{ t('new_password') }}</p>
        <q-input
          ref="newPasswordField"
          v-model="formValues.newPassword"
          outlined
          dense
          :label="t('input_new_password')"
          :rules="passwordRule && newPasswordRule"
          :type="revealNewPassword ? 'text' : 'password'"
        >
          <template #append>
            <q-icon
              :name="revealNewPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="revealNewPassword = !revealNewPassword"
            />
          </template>
        </q-input>
      </div>
      <div class="col">
        <p class="required text-bold q-my-xs">{{ t('re_enter_password') }}</p>
        <q-input
          ref="reEnterPasswordField"
          v-model="formValues.reEnterPassword"
          outlined
          dense
          :label="t('re_enter_new_password')"
          :rules="reEnterPasswordRule"
          :type="revealReEnterPassword ? 'text' : 'password'"
        >
          <template #append>
            <q-icon
              :name="revealReEnterPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="revealReEnterPassword = !revealReEnterPassword"
            />
          </template>
        </q-input>
      </div>
    </div>
    <div class="col-12 col-md-12 row justify-end">
      <q-btn
        :label="t('save')"
        color="negative"
        type="submit"
        class="q-px-lg"
        no-caps
        unelevated
        :loading="mutation.isLoading.value"
      />
    </div>
  </q-form>
</template>
