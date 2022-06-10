<script lang="ts">
import { ref, watchEffect, computed } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useRoute } from 'vue-router';
import { useRegisterMutation } from '../apis/useRegisterMutation';
import { useHotelTypeListQuery } from '../apis/useHotelTypeList';
import type { QInput } from 'quasar';
import { useNotify } from '~/composable/useNotify';
import { validateEmail } from '~/composable/useValidate';

export default {
  setup() {
    const { data: hotelTypeOptions, isFetching } = useHotelTypeListQuery();
    const { mutate, isLoading: isSubmitting } = useRegisterMutation();
    const { toggleLocale, locale, t } = useI18n();
    const { notifySaveSuccess } = useNotify();
    const handleRegisterFormRef = ref<HTMLFormElement>();

    const hidenPassword = ref(true);
    const route = useRoute();

    interface IRegisterMutationVariables {
      token: string;
      password: string;
      fullName: string;
      phone: string;
      email: string;
      hotelTypeSn: number;
      hotelName: string;
      hotelAddress: string;
      website: string;
    }

    const formValues = ref<IRegisterMutationVariables>({
      token: '',
      password: '',
      fullName: '',
      phone: '',
      email: '',
      hotelTypeSn: 0,
      hotelName: '',
      hotelAddress: '',
      website: '',
    });

    watchEffect(() => {
      formValues.value = {
        token: route.query.token ? String(route.query.token) : '',
        password: route.query.password ? String(route.query.password) : '',
        fullName: route.query.fullName ? String(route.query.fullName) : '',
        phone: route.query.phone ? String(route.query.phone) : '',
        email: route.query.email ? String(route.query.email) : '',
        hotelTypeSn: route.query.hotelTypeSn ? Number(route.query.hotelTypeSn) : 0,
        hotelName: route.query.hotelName ? String(route.query.hotelName) : '',
        hotelAddress: route.query.hotelAddress ? String(route.query.hotelAddress) : '',
        website: route.query.site ? String(route.query.site) : '',
      };
    });

    const randomPassword = () => {
      var length = 8,
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()',
        retVal = '';
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      formValues.value.password = retVal;
      return formValues.value.password;
    };

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

    const passwordField = ref<QInput | null>(null);
    const isValidPassword = computed(
      () =>
        !!formValues.value?.password &&
        formValues.value?.password?.length >= 8 &&
        formValues.value?.password?.length <= 16,
    );

    // end check validation

    const onSubmit = () => {
      isSubmited.value = true;

      if (
        !isValidhotelTypeSn.value ||
        !isValidFullName.value ||
        !isValidPhone.value ||
        !isValidEmail.value ||
        !isValidHotelName.value ||
        !isValidHotelAddress.value ||
        !isValidWebsite.value ||
        !isValidPassword.value
      ) {
        return false;
      } else {
        mutate(formValues.value, {
          onSuccess: async () => {
            notifySaveSuccess();
          },
        });
      }
    };

    return {
      onSubmit,
      t,
      toggleLocale,
      locale,
      formValues,
      hotelTypeOptions,
      isFetching,

      // validation
      passwordField,
      fullNameField,
      phoneField,
      emailField,
      hotelNameField,
      hotelAddressField,
      websiteField,
      randomPassword,
      route,
      hidenPassword,
      isSubmitting,
      handleRegisterFormRef,

      // validation
      isValidFullName,
      isValidPhone,
      isValidEmail,
      isValidHotelName,
      isValidHotelAddress,
      isValidWebsite,
      isSubmited,
      hotelTypeSnField,
      isValidhotelTypeSn,
      isValidPassword,
      validateEmail,
    };
  },
};
</script>

<template>
  <q-form ref="handleRegisterFormRef" class="q-gutter-md">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 offset-md-2 q-pa-sm">
        <p>{{ t('hotel_type') }}*</p>
        <q-select
          v-model="formValues.hotelTypeSn"
          :loading="isFetching"
          :options="hotelTypeOptions"
          :label="t('select_hotel_type')"
          outlined
          map-options
          option-label="name"
          option-value="sn"
          emit-value
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
          :placeholder="t('input_name')"
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
          :placeholder="t('input_hotel_name')"
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
          :placeholder="t('input_hotel_phone')"
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
          :placeholder="t('input_hotel_website')"
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
          :placeholder="t('input_email')"
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
          :placeholder="t('input_hotel_address')"
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

      <div class="col-12 col-md-8 offset-md-2 q-pa-sm">
        <div class="row items-center q-gutter-sm">
          <p>{{ t('password') }}*</p>
          <p>
            <q-btn icon="loop" round flat dense @click="randomPassword()">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>{{ t('generate_random_password') }}</strong>
              </q-tooltip>
            </q-btn>
          </p>
        </div>
        <q-input
          ref="passwordField"
          v-model="formValues.password"
          outlined
          :placeholder="t('input_your_password')"
          :type="hidenPassword ? 'password' : 'text'"
          :error="!isValidPassword && isSubmited"
        >
          <template #append>
            <q-btn
              v-show="!hidenPassword"
              round
              dense
              flat
              icon="visibility"
              @click="hidenPassword = !hidenPassword"
            />
            <q-btn
              v-show="hidenPassword"
              round
              dense
              flat
              icon="visibility_off"
              @click="hidenPassword = !hidenPassword"
            />
          </template>

          <template #error>
            <p v-if="!formValues.password && isSubmited">{{ t('this_field_is_required') }}</p>
            <p
              v-else-if="
                formValues.password.length < 8 || (formValues.password.length > 16 && isSubmited)
              "
            >
              {{ t('the_length_is_from_8_to_16_characters') }}
            </p>
          </template>
        </q-input>
      </div>
    </div>
  </q-form>
  <!-- submit when email direct -->
  <div class="col-12 col-md-12 row justify-center q-pa-md q-gutter-md">
    <q-btn
      :loading="isSubmitting"
      :label="t('register_submit')"
      type="submit"
      color="orange-9"
      size="lg"
      class="q-pl-lg q-pr-lg"
      no-caps
      @click="onSubmit"
    />
  </div>
  <!-- end submit when email direct -->
</template>
