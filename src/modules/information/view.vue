<script lang="ts">
import { ref, watchEffect, inject, watch } from 'vue';
import { useI18n } from '~/composable/useI18n';
import {
  useUpdateInformationMutation,
  IInformationMutationParams,
} from './apis/useUpdateInformationMutation';
import { useInformationQuery } from './apis/useInformationQuery';
import { useHotelTypeListQuery } from './apis/useHotelTypeListQuery';
import { useNotify } from '~/composable/useNotify';
import { useRule } from '~/composable/useValidate';

import { useAuth } from '~/composable/useAuth';
import { LS_HOTEL_NAME } from '~/constants';
import { Emitter } from 'mitt';
import { i18n } from '~/plugins/i18n';

export default {
  setup() {
    const { hasPermission } = useAuth();
    const { t } = useI18n();
    const { notifySaveSuccess } = useNotify();
    const updateInformationFormRef = ref<HTMLFormElement>();

    const { mutate, isLoading: isSubmitting } = useUpdateInformationMutation();
    const { data, isLoading, isFetching, refetch: refetchInfo } = useInformationQuery();
    const {
      data: hotelTypeOptions,
      isFetching: isFetchingHotelType,
      refetch: refetchHotelType,
    } = useHotelTypeListQuery();
    const emitter = inject('emitter') as Emitter<any>;

    const formValues = ref<IInformationMutationParams>({
      hotelTypeSn: 0,
      name: '',
      email: '',
      phone: '',
      website: '',
      address: '',
    });

    watch(
      () => (i18n.global.locale as any).value,
      () => {
        refetchHotelType.value();
      },
    );

    watchEffect(() => {
      formValues.value = {
        hotelTypeSn: data.value?.hotelTypeSn,
        name: data.value?.name,
        email: data.value?.email,
        phone: data.value?.phone,
        website: data.value?.website,
        address: data.value?.address,
      };
    });

    const { isRequiredRules, isEmailRules, websiteRules, isLengthFrom1To100Rules, isPhoneRules } =
      useRule();

    const onSubmit = () => {
      updateInformationFormRef.value?.validate().then((success: boolean) => {
        if (success) {
          mutate(formValues.value, {
            onSuccess: async () => {
              await refetchInfo.value();
              const { setLocalStorageWithExpiry } = useAuth();
              const expiry = JSON.parse(localStorage.getItem(LS_HOTEL_NAME) || '{}')?.expiry;
              setLocalStorageWithExpiry(LS_HOTEL_NAME, data.value.name, expiry);
              emitter.emit('changeHotelInfo');
              notifySaveSuccess();
            },
          });
        } else {
          return false;
        }
      });
    };
    return {
      onSubmit,
      t,

      isRequiredRules,
      isEmailRules,
      websiteRules,
      isLengthFrom1To100Rules,
      isPhoneRules,

      formValues,
      hotelTypeOptions,
      isFetchingHotelType,
      isLoading,
      isSubmitting,
      isFetching,
      updateInformationFormRef,
      hasPermission,
    };
  },
};
</script>

<template>
  <pms-sections>
    <template #header>
      <div class="row q-mb-md">
        <div class="text-h5 text-bold">{{ t('hotel_information') }}</div>
      </div>
    </template>
    <div class="relative-position">
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

      <q-form ref="updateInformationFormRef">
        <div class="row">
          <div class="col col-12 col-sm-6 q-pr-sm">
            <p class="text-bold q-ma-xs">{{ t('hotel_type') }}*</p>
            <q-select
              v-model="formValues.hotelTypeSn"
              map-options
              :loading="isFetchingHotelType"
              option-label="name"
              option-value="sn"
              :options="hotelTypeOptions"
              emit-value
              outlined
              dense
              clearable
              :label="t('select_hotel_type')"
              lazy-rules
              :rules="[(val) => !!val || t('please_select_one_value')]"
            />
          </div>
          <div class="col col-12 col-sm-6 q-pl-sm">
            <p class="text-bold q-ma-xs">{{ t('hotel_name') }}*</p>
            <q-input
              v-model="formValues.name"
              outlined
              :placeholder="t('input_hotel_name')"
              lazy-rules
              dense
              :rules="[...isRequiredRules, ...isLengthFrom1To100Rules]"
            />
          </div>

          <div class="col col-12 col-sm-6 q-pr-sm">
            <p class="text-bold q-ma-xs">{{ t('email') }}*</p>
            <q-input
              v-model="formValues.email"
              type="email"
              :placeholder="t('input_email')"
              lazy-rules
              :rules="[...isRequiredRules, ...isEmailRules]"
              outlined
              dense
            />
          </div>
          <div class="col col-12 col-sm-6 q-pl-sm">
            <p class="text-bold q-ma-xs">{{ t('hotel_phone') }}*</p>
            <q-input
              v-model="formValues.phone"
              outlined
              mask="############"
              :placeholder="t('input_hotel_phone')"
              lazy-rules
              :rules="[...isRequiredRules, ...isPhoneRules]"
              dense
            />
          </div>

          <div class="col-12 col-sm-6 q-pr-sm">
            <p class="text-bold q-ma-xs">{{ t('hotel_website') }}</p>
            <q-input
              v-model="formValues.website"
              :placeholder="t('input_hotel_website')"
              lazy-rules
              :rules="websiteRules"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-sm-6 q-pl-sm">
            <p class="text-bold q-ma-xs">{{ t('hotel_address') }}*</p>
            <q-input
              v-model="formValues.address"
              outlined
              :placeholder="t('input_hotel_address')"
              lazy-rules
              :rules="[...isRequiredRules, ...isLengthFrom1To100Rules]"
              dense
            />
          </div>
        </div>
      </q-form>
      <div class="col-12 col-md-12 row justify-end q-px-md q-pb-sm">
        <q-btn
          class="q-px-lg"
          :label="t('save')"
          :loading="isSubmitting"
          type="submit"
          color="negative"
          :class="hasPermission('edit-hotel-information') === false ? 'hidden' : ''"
          no-caps
          @click="onSubmit"
        />
      </div>
    </div>
  </pms-sections>
</template>
