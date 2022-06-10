<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useGuestListQuery, IGuest } from '../room-view/apis/useGuestListQuery';
import type { QInput, ValidationRule, QSelect } from 'quasar';
import { validateEmail } from '~/composable/useValidate';
import { useI18n } from '~/composable/useI18n';
import { GUESTS_ACTIONS } from '~/constants';
// interface
interface IEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'addGuest', value: IGuest): void;
}
interface IProps {
  modelValue: boolean;
}
// ref dom
const addGuestFormRef = ref<HTMLFormElement>();
// prop, emits
const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
// data
const { t } = useI18n();
const guestOptions = ref<IGuest[]>();
const keySearchGuest = ref<string>('');
const guestInputType = ref(GUESTS_ACTIONS.NEW_GUEST);
const formData = reactive({
  guestInfo: null as IGuest | null,
  fullName: '' as string | null,
  identityNumber: '' as string | null,
  email: null as string | null,
  mobile: '' as string | null,
  sn: null as number | null,
});
const email = ref<QInput | null>(null);
const emailRules: ValidationRule<string>[] = [
  (value) => !value || value?.length <= 100 || t('the_length_is_from_1_to_100_characters'),
  (value) => !value || validateEmail(value) || t('invalid_email_format'),
];
// validation
// name
const name = ref<QInput | null>(null);
const fullNameRules: ValidationRule<string>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => 50 > value?.length || t('the_length_is_from_1_to_50_characters'),
];
// vue-query
const { data: guestListData } = useGuestListQuery(keySearchGuest, {
  enabled: true,
});
// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emits('update:modelValue', value);
  },
});
// watch
watch(guestInputType, () => {
  clearGuestName();
});
watch(guestListData, () => {
  guestOptions.value = guestListData.value;
});
// methods
const filterGuest = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    guestOptions.value = guestListData?.value?.filter(
      (element) => String(element?.fullName).indexOf(String(val)) > -1,
    );
  });
};
const clearGuestName = () => {
  formData.guestInfo = null;
  formData.fullName = '';
  formData.identityNumber = '';
  formData.email = null;
  formData.mobile = '';
  formData.sn = null;
};
const setKeySearchGuestModel = (val: string) => {
  keySearchGuest.value = val;
  // refetchGuestList.value();
};
const changeGuestInfo = (val: IGuest) => {
  if (!formData.guestInfo) {
    return false;
  }
  formData.fullName = val.fullName;
  formData.identityNumber = val.identityNumber;
  formData.email = val.email;
  formData.mobile = val.mobile;
  formData.sn = val.sn;
};
const onSubmit = () => {
  addGuestFormRef.value?.validate().then((success: boolean) => {
    if (success) {
      const guestNew: IGuest = {
        email: formData.email,
        fullName: formData.fullName,
        identityNumber: formData.identityNumber,
        mobile: formData.mobile,
        sn: formData.sn,
      };
      emits('addGuest', guestNew);
      clearGuestName();
    } else {
      return false;
    }
  });
};
</script>
<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="padding: 0 20px 16px 20px; max-width: 1200px; width: 90%">
      <q-bar class="bg-white q-my-md q-mr-sm q-pa-none">
        <div class="text-h5 text-bold">{{ t('add_guest') }}</div>
        <q-space />
        <q-btn v-close-popup dense flat icon="close"> </q-btn>
      </q-bar>
      <q-separator class="q-mb-md" />
      <div class="q-pb-md q-ma-none">
        <div class="q-gutter-x-md">
          <q-radio
            v-model="guestInputType"
            dense
            val="Available guest"
            class="custom-font-bold"
            :label="t('available_guest')"
            color="negative"
          />
          <q-radio
            v-model="guestInputType"
            dense
            class="custom-font-bold"
            :val="GUESTS_ACTIONS.NEW_GUEST"
            :label="t('new_guest')"
            color="negative"
          />
        </div>
      </div>
      <q-card-section class="q-pa-none q-mt-md">
        <q-form ref="addGuestFormRef" class="q-gutter-md">
          <div class="q-mt-none row items-center">
            <div class="col col-md-3 col-sm-6 col-xs-12 q-pr-md">
              <p class="q-mb-xs text-weight-bold">{{ t('guest_name') }}*</p>
              <q-select
                v-if="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST"
                v-model="formData.guestInfo"
                filled
                dense
                fill-input
                use-input
                use-chips
                behavior="menu"
                hide-selected
                input-debounce="500"
                :options="guestListData"
                :placeholder="t('select_guest')"
                map-options
                option-label="fullName"
                option-value="sn"
                lazy-rules
                :rules="[(val) => !!val || t('please_input_guest_name')]"
                @filter="filterGuest"
                @input-value="setKeySearchGuestModel"
                @update:model-value="changeGuestInfo"
              >
                <template v-if="formData.fullName" #append>
                  <q-icon
                    name="cancel"
                    class="cursor-pointer text-caption"
                    @click.stop="clearGuestName"
                  />
                </template>
              </q-select>
              <q-input
                ref="name"
                v-else-if="guestInputType === GUESTS_ACTIONS.NEW_GUEST"
                v-model="formData.fullName"
                :placeholder="t('input_guest_name')"
                filled
                dense
                :rules="fullNameRules"
              >
              </q-input>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12 q-pr-md">
              <p class="q-mb-xs text-weight-bold">{{ t('identity_number') }}</p>
              <q-input
                v-model="formData.identityNumber"
                dense
                :disable="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? true : false"
                :bg-color="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? 'grey-5' : ''"
                :placeholder="t('input_identity_number')"
                class="col q-field--with-bottom"
                filled
                type="number"
                :rules="[
                  (val) => !val || val.length >= 9 || t('the_length_is_from_9_to_15_characters'),
                  (val) => !val || val.length <= 15 || t('the_length_is_from_9_to_15_characters'),
                ]"
              >
              </q-input>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12 q-pr-md">
              <p class="q-mb-xs text-weight-bold">{{ t('email') }}</p>
              <q-input
                v-model="formData.email"
                dense
                :disable="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? true : false"
                :bg-color="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? 'grey-5' : ''"
                :placeholder="t('input_email')"
                class="col q-field--with-bottom"
                filled
                type="email"
                ref="email"
                :rules="emailRules"
              >
              </q-input>
            </div>
            <div class="col col-md-3 col-sm-6 col-xs-12">
              <p class="q-mb-xs text-weight-bold">{{ t('phone') }}</p>
              <q-input
                v-model="formData.mobile"
                dense
                :disable="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? true : false"
                :bg-color="guestInputType === GUESTS_ACTIONS.AVAILABLE_GUEST ? 'grey-5' : ''"
                :placeholder="t('input_phone_number')"
                class="col q-field--with-bottom"
                filled
                :rules="[
                  (val) => !val || val.length >= 8 || t('the_length_is_from_8_to_12_characters'),
                  (val) => !val || val.length <= 12 || t('the_length_is_from_8_to_12_characters'),
                ]"
              >
              </q-input>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal text-right">
        <q-btn v-close-popup dense outline no-caps color="grey-8" style="padding: 8px 20px"
          >{{ t('cancel') }}
        </q-btn>
        <q-btn no-caps color="negative" style="padding: 8px 20px" @click="onSubmit">{{
          t('add')
        }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style lang="scss" scoped>
.custom-font-bold :deep(.q-radio__label) {
  font-weight: 600;
}
</style>
