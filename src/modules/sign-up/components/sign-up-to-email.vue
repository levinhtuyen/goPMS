<script lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useRegisterDirectToEmailMutation } from '../apis/useRegisterDirectToEmailMutation';
import { useHotelTypeListQuery } from '../apis/useHotelTypeList';
import type { QInput } from 'quasar';
import { useNotify } from '~/composable/useNotify';
import { validateEmail } from '~/composable/useValidate';

export default {
  setup() {
    const { data: hotelTypeOptions, isFetching } = useHotelTypeListQuery();
    const { mutate: mutateRegisterDirectToEmail, isLoading: isSubmitting } =
      useRegisterDirectToEmailMutation();
    const { toggleLocale, locale, t } = useI18n();
    const { notifySaveSuccess } = useNotify();
    const registerFormRef = ref<HTMLFormElement>();
    interface IRegisterMutationVariables {
      fullName: string;
      phone: string;
      email: string;
      hotelTypeSn: number;
      hotelName: string;
      hotelAddress: string;
      website: string;
    }
    const formValues = ref<IRegisterMutationVariables>({
      fullName: '',
      phone: '',
      email: '',
      hotelTypeSn: 0,
      hotelName: '',
      hotelAddress: '',
      website: '',
    });

    // check validateion
    const isSubmited = ref(false);

    const hotelTypeSnField = ref<QInput | null>(null);
    const isValidhotelTypeSn = computed(() => formValues.value?.hotelTypeSn != 0);

    const fullNameField = ref<QInput | null>(null);
    const isValidFullName = computed(
      () => !!formValues.value?.fullName && formValues.value?.fullName?.length < 50,
    );

    const phoneField = ref<QInput | null>(null);
    const isValidPhone = computed(
      () =>
        !!formValues.value?.phone &&
        formValues.value?.phone?.length >= 8 &&
        formValues.value?.phone?.length <= 12,
    );

    const emailField = ref<QInput | null>(null);
    const isValidEmail = computed(
      () =>
        !!formValues.value?.email &&
        validateEmail(formValues.value?.email) &&
        formValues.value?.email?.length <= 100,
    );

    const hotelNameField = ref<QInput | null>(null);
    const isValidHotelName = computed(
      () => !!formValues.value?.hotelName && formValues.value?.hotelName?.length <= 100,
    );

    const hotelAddressField = ref<QInput | null>(null);
    const isValidHotelAddress = computed(
      () => !!formValues.value?.hotelAddress && formValues.value?.hotelAddress?.length <= 100,
    );

    const websiteField = ref<QInput | null>(null);
    const isValidWebsite = computed(() => formValues.value?.website?.length <= 100);

    // end check validation

    const onSubmitRegisterDirectToEmail = () => {
      isSubmited.value = true;

      if (
        !isValidhotelTypeSn.value ||
        !isValidFullName.value ||
        !isValidPhone.value ||
        !isValidEmail.value ||
        !isValidHotelName.value ||
        !isValidHotelAddress.value ||
        !isValidWebsite.value
      ) {
        return false;
      } else {
        mutateRegisterDirectToEmail(formValues.value, {
          onSuccess: async () => {
            notifySaveSuccess();
          },
        });
      }
    };
    return {
      t,
      toggleLocale,
      locale,
      formValues,
      hotelTypeOptions,
      isFetching,
      // validation
      fullNameField,
      isValidFullName,
      phoneField,
      isValidPhone,
      emailField,
      isValidEmail,
      hotelNameField,
      isValidHotelName,
      hotelAddressField,
      isValidHotelAddress,
      websiteField,
      isValidWebsite,
      onSubmitRegisterDirectToEmail,
      isSubmitting,
      registerFormRef,
      isSubmited,
      validateEmail,

      hotelTypeSnField,
      isValidhotelTypeSn,
    };
  },
};
</script>

<template>
  <q-form ref="registerFormRef" class="q-gutter-md">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 offset-md-2 q-pa-sm">
        <p>{{ t('hotel_type') }}*</p>
        <q-select
          ref="hotelTypeSnField"
          v-model="formValues.hotelTypeSn"
          :loading="isFetching"
          map-options
          option-label="name"
          option-value="sn"
          :options="hotelTypeOptions"
          emit-value
          outlined
          :placeholder="t('select_an_option')"
          :error="!isValidhotelTypeSn && isSubmited"
        >
          <template #error>
            <p v-if="formValues.hotelTypeSn == 0 && isSubmited">
              {{ t('this_field_is_required') }}
            </p>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-sm-6 col-md-4 q-pa-sm">
        <p>{{ t('full_name') }}*</p>
        <q-input
          ref="fullNameField"
          v-model="formValues.fullName"
          outlined
          :placeholder="t('input_your_full_name')"
          lazy-rules
          :error="!isValidFullName && isSubmited"
        >
          <template #error>
            <p v-if="!formValues.fullName && isSubmited">{{ t('this_field_is_required') }}</p>
            <p
              v-else-if="
                formValues.fullName.length < 1 || (formValues.fullName.length > 50 && isSubmited)
              "
            >
              {{ t('the_length_is_from_1_to_50_characters') }}
            </p>
          </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6 col-md-4 offset-md-2 q-pa-sm">
        <p>{{ t('hotel_name') }}*</p>
        <q-input
          ref="hotelNameField"
          v-model="formValues.hotelName"
          :placeholder="t('input_your_hotel_name')"
          outlined
          :error="!isValidHotelName && isSubmited"
        >
          <template #error>
            <p v-if="!formValues.hotelName && isSubmited">{{ t('this_field_is_required') }}</p>
            <p v-else-if="formValues.hotelName.length > 100 && isSubmited">
              {{ t('the_length_is_from_1_to_100_characters') }}
            </p>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 col-md-4 q-pa-sm">
        <p>{{ t('hotel_phone') }}*</p>
        <q-input
          ref="phoneField"
          v-model="formValues.phone"
          outlined
          mask="############"
          :placeholder="t('input_your_hotel_phone')"
          :error="!isValidPhone && isSubmited"
        >
          <template #error>
            <p v-if="!formValues.phone && isSubmited">{{ t('this_field_is_required') }}</p>
            <p
              v-else-if="
                formValues.phone.length < 8 || (formValues.phone.length > 12 && isSubmited)
              "
            >
              {{ t('the_length_is_from_8_to_12_characters') }}
            </p>
          </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6 col-md-4 offset-md-2 q-pa-sm">
        <p>{{ t('hotel_website') }}</p>
        <q-input
          ref="websiteField"
          v-model="formValues.website"
          :placeholder="t('input_your_hotel_website')"
          type="email"
          outlined
          :error="!isValidWebsite && isSubmited"
        >
          <template #error>
            <p v-if="formValues.website.length > 100 && isSubmited">
              {{ t('the_length_is_from_1_to_100_characters') }}
            </p>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 col-md-4 q-pa-sm">
        <p>{{ t('email') }}*</p>
        <q-input
          ref="emailField"
          v-model="formValues.email"
          type="email"
          outlined
          :placeholder="t('input_your_email')"
          :error="!isValidEmail && isSubmited"
        >
          <template #error>
            <p v-if="!formValues.email && isSubmited">{{ t('this_field_is_required') }}</p>
            <p v-else-if="formValues.email.length > 100 && isSubmited">
              {{ t('the_length_is_from_1_to_100_characters') }}
            </p>
            <p v-else-if="!validateEmail(formValues.email) && isSubmited">
              {{ t('invalid_email_format') }}
            </p>
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-8 offset-md-2 q-pa-sm">
        <p>{{ t('hotel_address') }}*</p>
        <q-input
          ref="hotelAddressField"
          v-model="formValues.hotelAddress"
          outlined
          :placeholder="t('input_your_hotel_address')"
          :error="!isValidHotelAddress && isSubmited"
        >
          <template #error>
            <p v-if="!formValues.hotelAddress && isSubmited">{{ t('this_field_is_required') }}</p>
            <p v-else-if="formValues.hotelAddress.length > 100 && isSubmited">
              {{ t('the_length_is_from_1_to_100_characters') }}
            </p>
          </template>
        </q-input>
      </div>
    </div>
  </q-form>

  <div class="col-12 col-md-12 row justify-center q-pa-md">
    <q-btn
      :loading="isSubmitting"
      :label="t('register')"
      type="submit"
      color="orange-9"
      size="lg"
      class="q-pl-lg q-pr-lg"
      no-caps
      @click="onSubmitRegisterDirectToEmail"
    />
  </div>
</template>
