<script setup lang="ts">
import type { QInput, ValidationRule } from 'quasar';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useNotify } from '~/composable/useNotify';
import { useCreateRoomTypeMutation } from '../apis/useCreateRoomTypeMutation';
import { useRoomTypeListQuery } from '../apis/useRoomTypeListQuery';
import { useUpdateRoomTypeMutation } from '../apis/useUpdateRoomTypeMutation';
import { useAuth } from '~/composable/useAuth';

export interface Props {
  roomTypeSn: 'new' | number;
}

export interface Emits {
  (event: 'onRequestSuccess', newCode?: string): void;
}

interface IRoomTypeFormValues {
  numOfAdult: number;
  numOfChildren: number;
  numOfBed: number;
  name: string;
  code: string;
}

const { hasPermission } = useAuth();
const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { notifySaveSuccess, notifySaveFailed } = useNotify();
const { t } = useI18n();

const {
  data: roomTypeListData,
  isLoading: isRoomTypeListLoading,
  findRoomTypeBySn,
} = useRoomTypeListQuery();

const roomTypeData = computed(() =>
  props.roomTypeSn === 'new' ? null : findRoomTypeBySn(props.roomTypeSn),
);

const createMutation = useCreateRoomTypeMutation();
const updateMutation = useUpdateRoomTypeMutation();

const isLoading = computed(() => isRoomTypeListLoading.value);

const formValues = ref<IRoomTypeFormValues>({
  numOfAdult: 2,
  numOfChildren: 0,
  numOfBed: 1,
  name: '',
  code: '',
});
watchEffect(() => {
  formValues.value = {
    numOfAdult: roomTypeData.value?.numOfAdult ?? 2,
    numOfChildren: roomTypeData.value?.numOfChildren ?? 0,
    numOfBed: roomTypeData.value?.numOfBed ?? 1,
    name: roomTypeData.value?.name ?? '',
    code: roomTypeData.value?.code ?? '',
  };
});

const numOfAdultField = ref<QInput | null>(null);
const numOfAdultRules: ValidationRule<number>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => Number.isInteger(value) || t('this_is_invalid_value'),
  (value) => 1 <= value || t('the_value_is_from_1_to_10'),
  (value) => value <= 10 || t('the_value_is_from_1_to_10'),
];

const numOfChildrenField = ref<QInput | null>(null);
// const numOfChildrenRules: ValidationRule<number>[] = [
//   (value) => value !== undefined || t('this_field_is_required'),
//   (value) => Number.isInteger(value) || t('this_is_invalid_value'),
//   (value) => 0 <= value || t('this_is_invalid_value'),
//   (value) => value <= 10 || t('the_value_is_from_1_to_10'),
// ];

const numOfBedField = ref<QInput | null>(null);
const numOfBedRules: ValidationRule<number>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => Number.isInteger(value) || t('this_is_invalid_value'),
  (value) => 1 <= value || t('the_value_is_from_1_to_10'),
  (value) => value <= 10 || t('the_value_is_from_1_to_10'),
];

const nameField = ref<QInput | null>(null);
const nameRules: ValidationRule<string>[] = [
  (value) => !!value.trim() || t('this_field_is_required'),
  (value) => value.trim().length <= 50 || t('the_length_is_from_1_to_50_characters'),
  (value) =>
    !roomTypeListData.value
      ?.filter((roomType) => roomType.sn !== roomTypeData.value?.sn)
      .some((roomType) => roomType.name.toLowerCase() === value.trim().toLowerCase()) ||
    t('already_exists', { name: t('room_type_name').toLowerCase() }),
];

const codeField = ref<QInput | null>(null);
const codeRules: ValidationRule<string>[] = [
  (value) => !!value.trim() || t('this_field_is_required'),
  (value) => value.trim().length <= 10 || t('the_length_is_from_1_to_10_characters'),
  (value) =>
    !roomTypeListData.value
      ?.filter((roomType) => roomType.sn !== roomTypeData.value?.sn)
      .some((roomType) => roomType.code === value.trim()) ||
    t('already_exists', { name: t('room_type_code').toLowerCase() }),
];

const onSubmit = () => {
  numOfAdultField.value?.validate();
  numOfChildrenField.value?.validate();
  numOfBedField.value?.validate();
  nameField.value?.validate();
  codeField.value?.validate();

  if (
    numOfAdultField.value?.error ||
    numOfChildrenField.value?.error ||
    numOfBedField.value?.error ||
    nameField.value?.error ||
    codeField.value?.error
  )
    return;

  if (props.roomTypeSn === 'new') {
    createMutation.mutate(
      {
        ...formValues.value,
        code: formValues.value.code.trim(),
        name: formValues.value.name.trim(),
      },
      {
        onSuccess: () => {
          notifySaveSuccess();
          emits('onRequestSuccess');
        },
        onError: () => {
          notifySaveFailed();
        },
      },
    );
    return;
  }
  const isCodeChanged = roomTypeData.value?.code !== formValues.value.code;
  updateMutation.mutate(
    {
      ...formValues.value,
      code: formValues.value.code.trim(),
      name: formValues.value.name.trim(),
      sn: props.roomTypeSn,
    },
    {
      onSuccess: () => {
        notifySaveSuccess();
        emits('onRequestSuccess', isCodeChanged ? formValues.value.code : undefined);
      },
      onError: () => {
        notifySaveFailed();
      },
    },
  );
};
</script>

<template>
  <q-form @submit="onSubmit">
    <div v-if="isLoading" class="wrapper">
      <q-skeleton v-for="num in 2" :key="num" type="QInput" />
      <div class="container">
        <q-skeleton v-for="num in 3" :key="num" class="col" type="QInput" />
      </div>
    </div>
    <div v-else class="wrapper">
      <q-card-section class="row">
        <div class="col-12 col-md-12">
          <p class="q-ma-none text-weight-bold">{{ t('room_type_code') }}<span>*</span></p>
          <q-input
            ref="codeField"
            v-model="formValues.code"
            filled
            dense
            :placeholder="t('input_room_type_code')"
            lazy-rules
            :rules="codeRules"
          />
        </div>

        <div class="col-12 col-md-12">
          <p class="q-ma-none text-weight-bold">{{ t('room_type_name') }}<span>*</span></p>
          <q-input
            ref="nameField"
            v-model="formValues.name"
            filled
            dense
            lazy-rules
            :placeholder="t('input_room_type_name')"
            :rules="nameRules"
          />
        </div>
        <div class="row col-12">
          <div class="col-4 q-pr-sm">
            <p class="q-ma-none text-weight-bold">{{ t('number_of_adults') }}<span>*</span></p>
            <q-input
              ref="numOfAdultField"
              v-model.number="formValues.numOfAdult"
              filled
              dense
              lazy-rules
              :rules="numOfAdultRules"
              type="number"
            />
          </div>
          <div class="col-4 q-pr-sm">
            <p class="q-ma-none text-weight-bold">{{ t('number_of_children') }}</p>
            <q-input
              ref="numOfChildrenField"
              v-model.number="formValues.numOfChildren"
              filled
              dense
              lazy-rules
              type="number"
            />
          </div>
          <div class="col-4">
            <p class="q-ma-none text-weight-bold">{{ t('number_of_beds') }}<span>*</span></p>
            <q-input
              ref="numOfBedField"
              v-model.number="formValues.numOfBed"
              filled
              dense
              lazy-rules
              :rules="numOfBedRules"
              type="number"
            />
          </div>
        </div>
      </q-card-section>
    </div>
    <div class="row justify-end q-gutter-md">
      <q-btn v-close-popup dense outline no-caps color="grey-8" style="padding: 8px 20px">{{
        t('cancel')
      }}</q-btn>
      <q-btn
        no-caps
        :label="t('save')"
        color="negative"
        type="submit"
        :class="hasPermission('add-edit-room-type') === false ? 'hidden' : ''"
        :disable="isLoading"
        :loading="createMutation.isLoading.value || updateMutation.isLoading.value"
        data-testId="submit-btn"
      />
    </div>
  </q-form>
</template>

<style scoped lang="scss">
.wrapper {
  display: grid;
  gap: 1rem;
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }
}
</style>
