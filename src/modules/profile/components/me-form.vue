<script setup lang="ts">
import type { QInput, QSelect, ValidationRule } from 'quasar';

import { computed, inject, ref, watch } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useMeQuery } from '../apis/useMeQuery';
import { IUpdateMeVariables, useUpdateMeMutation } from '../apis/useUpdateMeMutation';
import { useRoleQuery } from '~/modules/role-permission/api/roleQuery';
import { VN_TEL_REGEX, LS_PROFILE } from '~/constants';
import { useAuth } from '~/composable/useAuth';
import { useNotify } from '~/composable/useNotify';
import { i18n } from '~/plugins/i18n';

const { data: dataProfile, isFetching } = useMeQuery();
const { data: dataFilter, refetch: refetchRole } = useRoleQuery();
const mutation = useUpdateMeMutation();
import { Emitter } from 'mitt';

const { t } = useI18n();
const emitter = inject('emitter') as Emitter<any>;
const formValues = ref();
const { notifyUpdateSuccess } = useNotify();
// watch
watch(isFetching, () => {
  formValues.value = dataProfile?.value ? JSON.parse(JSON.stringify(dataProfile?.value)) : [];
  formValues.value.gender = formValues.value.gender === 0 ? null : formValues.value.gender;
});

watch(
  () => (i18n.global.locale as any).value,
  () => {
    refetchRole.value();
  },
);

// computed
const mobileField = ref<QInput | null>(null);
const mobileRules: ValidationRule<string>[] = [
  (value) => VN_TEL_REGEX.test(value) || t('this_is_invalid_value'),
  (value) =>
    (8 <= value.length && 12 >= value.length) || t('the_length_is_from_8_to_12_characters'),
];

const nameField = ref<QInput | null>(null);
const nameRules: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => value.indexOf(' ') !== 0 || t('this_field_not_blank'),
  (value) => value.length <= 50 || t('the_length_is_from_0_to_50_characters'),
];
const sexField = ref<QSelect | null>(null);
const genderOptions = computed(() => [
  {
    name: t('male'),
    value: 1,
  },
  {
    name: t('female'),
    value: 2,
  },
]);

const onChangeGender = () => {
  formValues.value.gender = formValues.value.gender === null ? 1 : 2;
};

const onSubmit = () => {
  mutation.mutate(
    {
      fullName: formValues.value?.fullName,
      mobile: formValues.value?.mobile,
      gender: formValues.value?.gender,
    } as IUpdateMeVariables,
    {
      onSuccess: (response) => {
        if (response?.code === 1) {
          const { setLocalStorageWithExpiry } = useAuth();
          const expiry = JSON.parse(localStorage.getItem(LS_PROFILE) || '{}')?.expiry;
          const value = JSON.parse(localStorage.getItem(LS_PROFILE) || '{}')?.value;
          value.fullName = formValues.value.fullName;
          value.mobile = formValues.value.mobile;
          value.gender = formValues.value.gender;
          setLocalStorageWithExpiry(LS_PROFILE, value, expiry);
          emitter.emit('changeProfileInfo');
          notifyUpdateSuccess();
        }
      },
    },
  );
};
</script>

<template>
  <div class="row q-pb-md justify-between">
    <div class="text-h6 text-bold">{{ t('basic_info') }}</div>
  </div>
  <div class="relative-position">
    <q-form class="q-gutter-md" @submit="onSubmit">
      <q-inner-loading
        :showing="isFetching"
        label="Please"
        label-class="text-teal"
        label-style="font-size:1.1em"
      >
        <div lass="full-width" full-height class="q-mt-md row justify-center">
          <q-spinner color="negative" :thickness="2" size="2em" />
        </div>
      </q-inner-loading>

      <div v-if="!isFetching">
        <div class="row q-gutter-x-md">
          <div class="col">
            <p class="required text-bold q-my-xs">{{ t('name') }}</p>
            <q-input
              ref="nameField"
              v-model="formValues.fullName"
              outlined
              dense
              :placeholder="t('input_name')"
              :rules="nameRules"
            />
          </div>

          <div class="col">
            <p class="text-bold q-my-xs">{{ t('email') }}</p>
            <q-input outlined dense :model-value="formValues.email" bg-color="grey-5" disable />
          </div>
        </div>
        <div class="row q-gutter-x-md">
          <div class="col">
            <p class="text-bold q-my-xs">{{ t('mobile') }}</p>
            <q-input
              ref="mobileField"
              v-model="formValues.mobile"
              outlined
              dense
              mask="############"
              :placeholder="t('input_mobile')"
              unmasked-value
              :rules="mobileRules"
            />
          </div>

          <div class="col">
            <p class="text-bold q-my-xs">{{ t('gender') }}</p>
            <q-select
              ref="sexField"
              v-model="formValues.gender"
              :options="genderOptions"
              :label="t('select_gender')"
              dense
              outlined
              map-options
              option-label="name"
              emit-value
              @blur="onChangeGender"
            />
          </div>
        </div>
        <div class="row q-gutter-md">
          <div class="col">
            <p class="text-bold q-my-xs">{{ t('role') }}</p>
            <q-select
              :model-value="formValues.roleSn"
              :label="t('role')"
              :options="dataFilter"
              map-options
              dense
              outlined
              option-label="name"
              option-value="sn"
              emit-value
              bg-color="grey-5"
              disable
            />
          </div>
          <div class="col"></div>
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
          :disable="isFetching"
        />
      </div>
    </q-form>
  </div>
</template>
