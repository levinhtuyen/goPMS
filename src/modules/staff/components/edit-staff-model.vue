<template>
  <q-form ref="staffFormRef">
    <q-card-section class="row">
      <div class="col-12 col-sm-6 col-md-6 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('staff_name') }}*</p>
        <q-input
          v-model="formValues.fullName"
          filled
          dense
          :placeholder="t('input_name')"
          lazy-rules
          :rules="[...isRequiredRules, ...isLengthFrom1To50Rules]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('status') }}</p>
        <q-toggle v-model="formValues.status" :false-value="0" :true-value="1" color="negative" />
      </div>
      <div class="col-12 col-sm-6 col-md-6 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('role') }}*</p>
        <q-select
          ref="roleField"
          v-model="formValues.roleSn"
          filled
          dense
          map-options
          :label="t('select_role')"
          option-label="key"
          option-value="value"
          :options="roleOptions"
          emit-value
          :rules="isRequiredRules"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('email') }}*</p>
        <q-input
          ref="emailField"
          v-model="formValues.email"
          filled
          type="email"
          dense
          :placeholder="t('input_email')"
          lazy-rules
          :rules="[...isRequiredRules, ...isLengthFrom1To100Rules, ...isEmailRules]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('phone_number') }}</p>
        <q-input
          ref="phoneField"
          v-model="formValues.mobile"
          mask="############"
          filled
          dense
          :placeholder="t('input_phone_number')"
          lazy-rules
          :rules="isPhoneRules"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6 q-px-sm">
        <p class="text-bold q-ma-xs">{{ t('gender') }}</p>
        <q-select
          v-model="formValues.gender"
          filled
          dense
          map-options
          :label="t('select_gender')"
          clearable
          option-label="key"
          option-value="value"
          :options="genderOptions"
          emit-value
        />
      </div>
    </q-card-section>
  </q-form>
  <div class="col-12 col-md-12 row justify-end q-px-lg q-pb-md q-gutter-sm">
    <q-btn
      v-close-popup
      :label="t('cancel')"
      dense
      outline
      no-caps
      color="grey-8"
      style="padding: 8px 20px"
    />
    <q-btn
      :label="t('save')"
      class="q-px-lg"
      :loading="isLoading"
      type="submit"
      color="negative"
      no-caps
      @click="onSubmit"
    />
  </div>
</template>

<script lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useUpdateStaffMutation, IStaffMutationVariables } from '../apis/useUpdateStaffMutation';
import { useQuasar } from 'quasar';
import { useNotify } from '~/composable/useNotify';
import { useRule } from '~/composable/useValidate';

export default {
  props: {
    openEditStaffModal: {
      type: Boolean,
      default: false,
    },
    staffDetail: {
      type: Object,
      default: null,
    },
  },
  emits: ['reset'],
  setup(props: any, context: any) {
    const { t } = useI18n();
    const $q = useQuasar();
    const staffFormRef = ref<HTMLFormElement>();

    const { notifyUpdateSuccess } = useNotify();
    const { mutate, isLoading } = useUpdateStaffMutation();

    const openStaffModalComputed = computed(() => props.openEditStaffModal);

    const formValues = ref<IStaffMutationVariables>({
      sn: null,
      fullName: '',
      mobile: '',
      email: '',
      roleSn: 2,
      status: 1,
      gender: 0,
    });
    watchEffect(() => {
      formValues.value = {
        sn: props.staffDetail.row?.sn,
        fullName: props.staffDetail.row?.fullName,
        mobile: props.staffDetail.row?.mobile,
        email: props.staffDetail.row?.email,
        roleSn: props.staffDetail.row?.roleSn,
        status: props.staffDetail.row?.status,
        gender: props.staffDetail.row?.gender,
      };
    });

    const roleOptions = [
      { key: t('hotel_owner'), value: 1 },
      { key: t('front_desk'), value: 2 },
    ];

    const genderOptions = [
      { key: t('select_gender'), value: 0 },
      { key: t('male'), value: 1 },
      { key: t('female'), value: 2 },
    ];

    const {
      isRequiredRules,
      isEmailRules,
      isLengthFrom1To100Rules,
      isPhoneRules,
      isLengthFrom1To50Rules,
    } = useRule();

    const onSubmit = () => {
      staffFormRef.value?.validate().then((success: boolean) => {
        if (success) {
          mutate(formValues.value, {
            onSuccess: (response: any) => {
              if (response?.code == 1) {
                notifyUpdateSuccess();
                setTimeout(() => {
                  context.emit('reset', false);
                }, 400);
              } else if (response?.code == 2) {
                $q.notify({
                  message: t('we_couldnt_save_your_changes_please_try_again'),
                  position: 'top',
                  type: 'negative',
                  actions: [{ color: 'white' }],
                });
              }
            },
          });
        } else {
          return false;
        }
      });
    };

    return {
      onSubmit,
      openStaffModalComputed,
      t,

      isRequiredRules,
      isEmailRules,
      isLengthFrom1To100Rules,
      isPhoneRules,
      isLengthFrom1To50Rules,

      formValues,
      roleOptions,
      genderOptions,
      isLoading,

      staffFormRef,
    };
  },
};
</script>
