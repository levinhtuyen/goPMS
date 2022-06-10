<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from '~/composable/useI18n';
import type { QInput, ValidationRule, QSelect } from 'quasar';
import { IPayload, useCreateGuestMutation } from '../apis/useCreateGuestMutation';
import { useCountryListQuery } from '../apis/useContryQuery';
import { validateEmail } from '~/composable/useValidate';
import { useNotify } from '~/composable/useNotify';

const { t } = useI18n();
interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
}
interface ICountry {
  sn: number | null;
  name: string | null;
  isoCode: string | null;
  countryCode: string | null;
  currency: string | null;
}
const { notifyUpdateSuccess } = useNotify();
const props = defineProps({
  modelValue: { type: Boolean, require: true },
});
const emits = defineEmits<Emits>();

const valueGender = ref(0);

const genderOptions = computed(() => [
  { key: t('select_gender'), id: 0 },
  { key: t('male'), id: 1 },
  { key: t('female'), id: 2 },
]);

const mutation = useCreateGuestMutation();

const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val: boolean) {
    emits('update:modelValue', val);
  },
});
// const valueChooseGender = ref();
const formValues = ref<IPayload>({
  fullName: '',
  identityNumber: '',
  address: '',
  mobile: '',
  email: ' ',
  birthday: '',
  countrySn: 0,
  gender: 0,
  note: '',
});
const keywordCountrySearch = ref('');
let { data: contryData, refetch: refetchGuest } = useCountryListQuery(keywordCountrySearch);
const setupGuestCreateDialog = async () => {
  refetchGuest.value();
};
const countryOptions = ref<ICountry[]>();

const filterCountry = ref<ICountry>({
  sn: 233,
  name: 'Việt Nam',
  isoCode: '84',
  countryCode: 'VN',
  currency: 'VND',
});
watch(contryData, () => {
  countryOptions.value = contryData.value;
});
const filterCountryFn = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    countryOptions.value = contryData?.value?.filter(
      (element: any) => String(element?.name).indexOf(String(val)) > -1,
    );
  });
};
const getFlagCountry = () => {
  const imageURL = ref('');
  const urlName = filterCountry?.value?.countryCode;
  imageURL.value = `flag_${urlName?.toLowerCase()}.png`;
  return new URL(`../../../assets/area/${imageURL.value}`, import.meta.url).href;
};
let setKeySearchCountryModel = (val: string) => {
  keywordCountrySearch.value = val;
};
const changeCountryInfo = (val: ICountry) => {
  filterCountry.value = val;
};
// name
const name = ref<QInput | null>(null);
const fullNameRules: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => 50 > value?.length || t('the_length_is_from_1_to_50_characters'),
];
// identity
const identity = ref<QInput | null>(null);
const identityRules: ValidationRule<string>[] = [
  (value) => 1 > value?.length || 9 <= value?.length || t('the_length_is_from_9_to_15_characters'),

  (value) => 15 > value?.length || t('the_length_is_from_9_to_15_characters'),
];
const identityError = computed(
  () =>
    (formValues.value?.identityNumber?.length >= 1 &&
      formValues.value?.identityNumber?.length < 9) ||
    formValues.value?.identityNumber?.length > 15,
);
// email
const email = ref<QInput | null>(null);
const emailRules: ValidationRule<string>[] = [
  (value) => 100 >= value?.length || t('the_length_is_from_1_to_100_characters'),
  (value) => 1 >= value?.length || validateEmail(value) || t('invalid_email_format'),
];

// address
const addressRules: ValidationRule<string>[] = [
  (value) => 100 >= value?.length || t('the_length_is_from_1_to_100_characters'),
];

// note
const note = ref<QInput | null>(null);
const noteRules: ValidationRule<string>[] = [
  (value) => 50 >= value?.length || t('the_length_is_from_1_to_50_characters'),
];
// phone
const phoneRules: ValidationRule<string>[] = [
  (value) => 1 > value?.length || 8 <= value?.length || t('the_length_is_from_8_to_12_characters'),
  (value) => 12 >= value?.length || t('the_length_is_from_8_to_12_characters'),
];
const phoneError = computed(
  () =>
    (formValues.value?.mobile?.length >= 1 && formValues.value?.mobile?.length < 8) ||
    formValues.value?.mobile?.length > 12,
);
const onDialogHide = () => {
  onCancel();
};
const onCancel = () => {
  formValues.value = {
    fullName: '',
    identityNumber: '',
    address: '',
    mobile: '',
    email: '',
    birthday: '',
    countrySn: 0,
    gender: 0,
    note: '',
  };
  valueGender.value = 0;
  filterCountry.value = {
    sn: 233,
    name: 'Việt Nam',
    isoCode: '84',
    countryCode: 'VN',
    currency: 'VND',
  };
};
const createGuestForm = ref<HTMLFormElement>();
defineExpose({
  setupGuestCreateDialog,
});

const onSubmit = () => {
  createGuestForm.value?.validate().then((success: boolean) => {
    if (!success) {
      return false;
    } else {
      const dataFormCreate = ref({
        ...formValues.value,
        gender: 0,
        countrySn: filterCountry.value.sn,
      });
      if (dataFormCreate?.value?.email === null) {
        dataFormCreate.value.email = ' ';
      }
      if (dataFormCreate?.value?.note === null) {
        dataFormCreate.value.note = ' ';
      }
      if (dataFormCreate.value?.address === null) {
        dataFormCreate.value.address = ' ';
      }
      if (dataFormCreate.value?.mobile === null) {
        dataFormCreate.value.mobile = ' ';
      }
      if (dataFormCreate.value?.identityNumber === null) {
        dataFormCreate.value.identityNumber = ' ';
      }
      dataFormCreate.value.gender = valueGender.value;

      mutation.mutate(dataFormCreate.value, {
        onSuccess: (data) => {
          if (data?.code === 1) {
            notifyUpdateSuccess();
          }
          setTimeout(() => {
            formValues.value = {
              fullName: '',
              identityNumber: '',
              address: '',
              mobile: '',
              email: '',
              birthday: '',
              countrySn: 0,
              gender: 0,
              note: '',
            };
            valueGender.value = 0;
            filterCountry.value = {
              sn: 233,
              name: 'Việt Nam',
              isoCode: '84',
              countryCode: 'VN',
              currency: 'VND',
            };
            emits('close');
          }, 600);
        },
      });
    }
  });
};
</script>

<template>
  <q-dialog ref="dialogCreate" v-model="dialogVisible" @hide="onDialogHide">
    <q-card class="custom-size-dialog">
      <q-toolbar class="q-pa-md">
        <q-toolbar-title
          ><span class="text-weight-bold">{{ t('add_new_guest') }} </span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <div class="q-pa-md">
        <q-form ref="createGuestForm" @submit="onSubmit">
          <div class="wrapper">
            <div class="doc-container form-guest">
              <div class="col column">
                <div class="row">
                  <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                    <p class="q-ma-none text-weight-bold">{{ t('guest_name') }}<span>*</span></p>
                    <q-input
                      ref="name"
                      v-model="formValues.fullName"
                      filled
                      dense
                      lazy-rules
                      :placeholder="t('input_guest_name')"
                      :rules="fullNameRules"
                    ></q-input>
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                    <p class="q-ma-none text-weight-bold">{{ t('country') }}<span>*</span></p>
                    <q-select
                      ref="country"
                      v-model="filterCountry"
                      filled
                      dense
                      emit-value
                      use-input
                      :label="t('select_country')"
                      clearable
                      map-options
                      :options="countryOptions"
                      option-label="name"
                      input-debounce="0"
                      behavior="menu"
                      lazy-rules
                      :rules="[(val) => !!val || t('this_field_is_required')]"
                      @filter="filterCountryFn"
                      @input-value="setKeySearchCountryModel"
                      @update:model-value="changeCountryInfo"
                    >
                      <template v-if="filterCountry" #prepend>
                        <img class="set-width" :src="getFlagCountry()" />
                      </template>
                    </q-select>
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                    <p class="q-ma-none text-weight-bold">{{ t('identity_number') }}</p>
                    <q-input
                      ref="identity"
                      v-model="formValues.identityNumber"
                      filled
                      mask="###############"
                      dense
                      :placeholder="t('input_identity_number')"
                      :rules="identityRules"
                      :error="identityError"
                    >
                      <template #error>
                        <p>
                          {{ t('the_length_is_from_9_to_15_characters') }}
                        </p>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                    <p class="q-ma-none text-weight-bold">{{ t('gender') }}</p>
                    <q-select
                      v-model="valueGender"
                      filled
                      dense
                      clearable
                      map-options
                      :label="t('select_gender')"
                      option-label="key"
                      option-value="id"
                      :options="genderOptions"
                      emit-value
                    />
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                    <p class="q-ma-none text-weight-bold">{{ t('email') }}</p>
                    <q-input
                      ref="email"
                      v-model="formValues.email"
                      filled
                      dense
                      type="email"
                      :placeholder="t('input_email')"
                      :rules="emailRules"
                    ></q-input>
                  </div>
                  <div class="col-md-3 col-sm-3 col-xs-6 q-pa-sm q-px-sm">
                    <p class="q-ma-none text-weight-bold">{{ t('phone_number') }}</p>
                    <q-input
                      v-model="formValues.mobile"
                      filled
                      mask="############"
                      dense
                      :placeholder="t('input_phone_number')"
                      :rules="phoneRules"
                      :error="phoneError"
                    >
                      <template #error>
                        <p>
                          {{ t('the_length_is_from_8_to_12_characters') }}
                        </p>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-3 col-sm-3 col-xs-6 q-pa-sm q-px-sm">
                    <p class="q-ma-none text-weight-bold">{{ t('birthday') }}</p>
                    <q-input
                      v-model="formValues.birthday"
                      :placeholder="t('select_date')"
                      class="col"
                      filled
                      dense
                    >
                      <template #prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="formValues.birthday" mask="DD/MM/YYYY" today-btn>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 q-pa-sm q-px-sm">
                    <p class="q-ma-none text-weight-bold">{{ t('address') }}</p>
                    <q-input
                      ref="address"
                      v-model="formValues.address"
                      filled
                      dense
                      :placeholder="t('input_address')"
                      :rules="addressRules"
                    ></q-input>
                  </div>
                  <div class="col-12 q-pa-sm q-px-sm">
                    <p class="q-ma-none text-weight-bold">{{ t('note') }}</p>
                    <q-input
                      ref="note"
                      v-model="formValues.note"
                      filled
                      dense
                      :placeholder="t('input_note')"
                      :rules="noteRules"
                    ></q-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="q-mt-xs row justify-end q-gutter-md">
            <q-btn
              v-close-popup
              :label="t('cancel')"
              dense
              outline
              no-caps
              color="grey-8"
              style="padding: 8px 20px"
              @click="onCancel"
            />
            <q-btn :label="t('save')" no-caps color="negative" type="submit">
              <template #loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>
<style lang="sass" scoped>

.set-width
  width: 30px
  height: auto
.q-field
  padding-bottom: 0
.q-dialog__inner--minimized div
    max-width: 876px
</style>
