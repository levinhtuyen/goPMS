<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useGuestByIdQuery } from '../apis/getGuestById';
import { useUpdateGuestMutation } from '../apis/useUpdateGuestMutation';
import { useCountryListQuery } from '../apis/useContryQuery';
import { QInput } from 'quasar';
import type { ValidationRule } from 'quasar';
import { validateEmail } from '~/composable/useValidate';
import { useNotify } from '~/composable/useNotify';
import { FORMAT_DATE_UI } from '~/constants';
import { date } from 'quasar';

interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
}
const { notifyUpdateSuccess } = useNotify();
const emits = defineEmits<Emits>();
const props = defineProps({
  modelValue: { type: Boolean, require: true },
});
interface ICountry {
  sn: number | null;
  name: string | null;
  isoCode: string | null;
  countryCode: string | null;
  currency: string | null;
}
const guestId = ref(-1);
const enabledGuestQuery = computed(() => {
  return !!guestId.value;
});
const setupGuestEditDialog = async (sn: number) => {
  guestId.value = sn;
  refetchGuest.value();
};
const {
  data: dataGuestDetail,
  isLoading: isLoadingGuestEdit,
  refetch: refetchGuest,
} = useGuestByIdQuery(guestId, {
  enabled: enabledGuestQuery.value,
});
const dataForm = ref({
  sn: '',
  fullName: '',
  identityNumber: '',
  address: '',
  mobile: '',
  email: '',
  birthday: 0,
  gender: 0,
  countrySn: 0,
  country: {
    sn: 0,
    name: '',
    isoCode: '',
    countryCode: '',
    currency: '',
  },
  note: '',
});
const dialogEdit = ref<HTMLFormElement>();
const keywordCountrySearch = ref('');
const { t } = useI18n();
let { data: contryData } = useCountryListQuery(keywordCountrySearch);
const countryOptions = ref<ICountry[]>();
watch(contryData, () => {
  countryOptions.value = contryData.value;
});
const getFlagCountry = () => {
  const imageURL = ref('');
  const urlName = dataForm.value?.country?.countryCode;
  imageURL.value = `flag_${urlName?.toLowerCase()}.png`;
  return new URL(`../../../assets/area/${imageURL.value}`, import.meta.url).href;
};
const filterCountryFn = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    countryOptions.value = contryData?.value?.filter(
      (element: any) => String(element?.name).indexOf(String(val)) > -1,
    );
  });
};
let setKeySearchCountryModel = (val: any) => {
  keywordCountrySearch.value = val;
};

// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val: boolean) {
    emits('update:modelValue', val);
  },
});

const genderOptions = computed(() => [
  { key: t('select_gender'), sn: Number(0) },
  { key: t('male'), sn: Number(1) },
  { key: t('female'), sn: Number(2) },
]);

// const reformatDate = (date: string) => {
//   if (!date) {
//     return;
//   }
//   const [day, month, year] = date.split('-');
//   return `${year}/${month}/${day}`;
// };
watch(dataGuestDetail, () => {
  dataForm.value = JSON.parse(dataGuestDetail.value || '[]');
  dataForm.value.birthday =
    dataForm.value.birthday !== null
      ? (date.formatDate(dataForm.value.birthday * 1000.0, FORMAT_DATE_UI) as any)
      : '';
  if (dataForm?.value?.email === null) {
    dataForm.value.email = '';
  }
  if (dataForm?.value?.note === null) {
    dataForm.value.note = '';
  }
  if (dataForm.value?.address === null) {
    dataForm.value.address = '';
  }
  if (dataForm.value?.mobile === null) {
    dataForm.value.mobile = '';
  }
  if (dataForm.value?.identityNumber === null) {
    dataForm.value.identityNumber = '';
  }
});

const mutation = useUpdateGuestMutation();
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
    (dataForm.value?.identityNumber?.length >= 1 && dataForm.value?.identityNumber?.length < 9) ||
    dataForm.value?.identityNumber?.length > 15,
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
    (dataForm.value?.mobile?.length >= 1 && dataForm.value?.mobile?.length < 8) ||
    dataForm.value?.mobile?.length > 12,
);

const onDialogHide = () => {
  onCancel();
};
const onCancel = () => {
  refetchGuest.value();
  dataForm.value = JSON.parse(dataGuestDetail.value || '[]');
  if (dataForm?.value?.email === null) {
    dataForm.value.email = '';
  }
  if (dataForm?.value?.note === null) {
    dataForm.value.note = '';
  }
  if (dataForm.value?.address === null) {
    dataForm.value.address = '';
  }
  if (dataForm.value?.mobile === null) {
    dataForm.value.mobile = '';
  }
  if (dataForm.value?.identityNumber === null) {
    dataForm.value.identityNumber = '';
  }
  dataForm.value.birthday =
    dataForm.value.birthday !== null
      ? (date.formatDate(dataForm.value.birthday * 1000.0, FORMAT_DATE_UI) as any)
      : '';
};

const onSubmit = () => {
  dialogEdit.value?.validate().then((success: boolean) => {
    if (!success) {
      return false;
    } else {
      const dataFormEdit = ref({
        guestSn: dataForm.value.sn,
        ...dataForm.value,
        countrySn: dataForm?.value?.country.sn,
      });

      dataFormEdit.value.gender = dataForm?.value?.gender ? dataForm?.value?.gender : 0;
      mutation.mutate(dataFormEdit.value, {
        onSuccess: (data) => {
          if (data) {
            notifyUpdateSuccess();
            setTimeout(() => {
              emits('close');
            }, 600);
          }
        },
      });
    }
  });
};
defineExpose({
  setupGuestEditDialog,
});
</script>

<template>
  <q-dialog v-model="dialogVisible" @hide="onDialogHide">
    <q-card class="custom-size-dialog">
      <q-toolbar class="q-pa-md">
        <q-toolbar-title
          ><span class="text-weight-bold">{{ t('edit_guest') }} </span>
        </q-toolbar-title>
        <q-btn v-close-popup flat round dense icon="close" />
      </q-toolbar>
      <div class="q-pa-md">
        <q-form ref="dialogEdit" @submit="onSubmit">
          <div v-if="isLoadingGuestEdit" class="wrapper q-pa-md">
            <q-inner-loading
              :showing="isLoadingGuestEdit"
              label="Please wait..."
              label-class="text-teal"
              label-style="font-size: 1.1em"
            />
          </div>

          <div v-if="dataForm" class="q-pa-md q-gutter-sm doc-container">
            <div class="col column">
              <div class="row">
                <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                  <p class="q-ma-none text-weight-bold">{{ t('guest_name') }}<span>*</span></p>
                  <q-input
                    ref="name"
                    v-model="dataForm.fullName"
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
                    v-model="dataForm.country"
                    filled
                    dense
                    use-input
                    emit-value
                    input-debounce="0"
                    behavior="menu"
                    :label="t('select_country')"
                    clearable
                    map-options
                    :options="countryOptions"
                    option-label="name"
                    lazy-rules
                    :rules="[(val) => !!val || t('this_field_is_required')]"
                    @filter="filterCountryFn"
                    @input-value="setKeySearchCountryModel"
                  >
                    <template v-if="dataForm.country" #prepend>
                      <img class="set-width" :src="getFlagCountry()" />
                    </template>
                  </q-select>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                  <p class="q-ma-none text-weight-bold">{{ t('identity_number') }}</p>
                  <q-input
                    ref="identity"
                    v-model="dataForm.identityNumber"
                    filled
                    dense
                    mask="###############"
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
                    ref="country"
                    v-model="dataForm.gender"
                    :options="genderOptions"
                    filled
                    emit-value
                    map-options
                    dense
                    :label="t('select_gender')"
                    clearable
                    :option-value="(opt) => (Object(opt) === opt && 'sn' in opt ? opt.sn : null)"
                    option-label="key"
                  ></q-select>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                  <p class="q-ma-none text-weight-bold">{{ t('email') }}</p>
                  <q-input
                    ref="email"
                    v-model="dataForm.email"
                    filled
                    dense
                    :placeholder="t('input_email')"
                    :rules="emailRules"
                  ></q-input>
                </div>
                <div class="col-md-3 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                  <p class="q-ma-none text-weight-bold">{{ t('phone_number') }}</p>
                  <q-input
                    ref="phone"
                    v-model="dataForm.mobile"
                    filled
                    dense
                    mask="############"
                    :placeholder="t('input_phone_number')"
                    :rules="phoneRules"
                    :error="phoneError"
                  >
                    <template #error>
                      <p>
                        {{ t('the_length_is_from_8_to_12_characters') }}
                      </p>
                    </template></q-input
                  >
                </div>
                <div class="col-md-3 col-sm-6 col-xs-12 q-pa-sm q-px-sm">
                  <p class="q-ma-none text-weight-bold">{{ t('birthday') }}</p>
                  <q-input v-model="dataForm.birthday" :placeholder="t('select_date')" filled dense>
                    <template #prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="dataForm.birthday" mask="DD/MM/YYYY" today-btn>
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
                    v-model="dataForm.address"
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
                    v-model="dataForm.note"
                    filled
                    dense
                    :placeholder="t('input_note')"
                    :rules="noteRules"
                  ></q-input>
                </div>
              </div>
            </div>
          </div>
          <div class="q-mt-md row justify-end q-gutter-md">
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
.q-field
  padding-bottom: 0
.custom-size-dialog
  width: 876px
.set-width
  width: 30px
  height: auto
.q-dialog__inner--minimized div
  max-width: 876px
</style>
