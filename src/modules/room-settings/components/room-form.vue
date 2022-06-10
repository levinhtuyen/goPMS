<script setup lang="ts">
import type { QInput, QSelect, ValidationRule } from 'quasar';
import { computed, ref, watchEffect, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '~/composable/useI18n';
import { useNotify } from '~/composable/useNotify';
import { useCreateRoomMutation } from '../apis/useCreateRoomMutation';
import { useRoomTypeFloorInfoQuery } from '../apis/useRoomTypeFloorInfoQuery';
import { useRoomTypeListQuery } from '../apis/useRoomTypeListQuery';
import { useUpdateRoomMutation } from '../apis/useUpdateRoomMutation';
import { useAuth } from '~/composable/useAuth';

import { Emitter } from 'mitt';

export interface Props {
  roomSn: 'new' | number;
}
const emitter = inject('emitter') as Emitter<any>;
interface Emits {
  (event: 'onRequestSuccess'): void;
}

interface IRoomFormValues {
  roomTypeSn?: number | any;
  floorSn?: number;
  name: string;
}
const { hasPermission } = useAuth();
const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { notifySaveSuccess, notifySaveFailed } = useNotify();
const router = useRouter();
const route = useRoute();

const {
  data: roomTypeListData,
  isLoading: isRoomTypeListLoading,
  findRoomTypeByCode,
} = useRoomTypeListQuery();
const {
  data: roomTypeFloorInfoData,
  isLoading: isroomTypeFloorInfoLoading,
  findRoomByRoomSn,
  findFloorByRoomSn,
} = useRoomTypeFloorInfoQuery();

const createMutation = useCreateRoomMutation();
const updateMutation = useUpdateRoomMutation();

const isLoading = computed(() => isroomTypeFloorInfoLoading.value || isRoomTypeListLoading.value);

const roomTypeCodeUrlQuery = !Array.isArray(route.query.code)
  ? route.query.code?.replaceAll('_', ' ')
  : undefined;

const roomTypeSnFromUrl = findRoomTypeByCode(roomTypeCodeUrlQuery)?.sn
  ? findRoomTypeByCode(roomTypeCodeUrlQuery)?.sn
  : {
      name: 'Choose Room Type',
      sn: 0,
    };
// const roomTypeListDataOption = ref<any>();
// roomTypeListDataOption.value = roomTypeListData.value;
// if (roomTypeSnFromUrl === 0 && roomTypeListDataOption.value.length > 0) {
//   roomTypeListDataOption?.value.unshift({
//     name: 'Choose Room Type',
//     sn: 0,
//   });
// }
const formValues = ref<IRoomFormValues>({ name: '' });
watchEffect(() => {
  if (props.roomSn === 'new') {
    formValues.value = {
      roomTypeSn: roomTypeSnFromUrl,
      floorSn: router.options.history.state.floorId as number,
      name: '',
    };
  } else {
    const room = findRoomByRoomSn(props.roomSn);
    formValues.value = {
      roomTypeSn: findRoomTypeByCode(room?.roomTypeCode)?.sn,
      floorSn: findFloorByRoomSn(props.roomSn)?.sn,
      name: room?.name ?? '',
    };
  }
});

const floorSnField = ref<QSelect | null>(null);
const floorSnRules: ValidationRule<number>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => Number.isInteger(value) || t('this_is_invalid_value'),
];

const roomTypeField = ref<QSelect | null>(null);
const roomTypeRules: ValidationRule<number>[] = [
  (value) => !!value || t('this_field_is_required'),
  (value) => Number.isInteger(value) || t('this_is_invalid_value'),
];

const nameField = ref<QInput | null>(null);
const nameRules: ValidationRule<string>[] = [
  (value) => !!value.trim() || t('this_field_is_required'),
  (value) => value.trim().length <= 50 || t('the_length_is_from_1_to_50_characters'),
  (value) =>
    !roomTypeFloorInfoData.value?.some(({ roomList }) => {
      const isNameDuplicated = roomList.some(({ name, sn }) => {
        if (props.roomSn === 'new') {
          return name.toLowerCase() === value.trim().toLowerCase();
        } else {
          return name.toLowerCase() === value.trim().toLowerCase() && sn !== props.roomSn;
        }
      });
      return isNameDuplicated;
    }) || t('already_exists', { name: t('room_name').toLowerCase() }),
];

const { t } = useI18n();

const onSubmit = () => {
  nameField.value?.validate();
  roomTypeField.value?.validate();
  floorSnField.value?.validate();

  if (nameField.value?.error || roomTypeField.value?.error || floorSnField.value?.error) return;
  if (!formValues.value.floorSn || !formValues.value.roomTypeSn) return;
  if (props.roomSn === 'new') {
    createMutation.mutate(
      {
        roomTypeSn: formValues.value.roomTypeSn,
        floorSn: formValues.value.floorSn,
        name: formValues.value.name.trim(),
      },
      {
        onSuccess: () => {
          notifySaveSuccess();
          emits('onRequestSuccess');
          emitter.emit('refetchListRoomSetting');
        },
        onError: () => {
          notifySaveFailed();
        },
      },
    );
    return;
  }
  updateMutation.mutate(
    {
      sn: props.roomSn,
      roomTypeSn: formValues.value.roomTypeSn,
      floorSn: formValues.value.floorSn,
      name: formValues.value.name.trim(),
    },
    {
      onSuccess: () => {
        setTimeout(() => {
          notifySaveSuccess();
          emits('onRequestSuccess');
          emitter.emit('refetchListRoomSetting');
        }, 600);
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
      <q-skeleton v-for="num in 3" :key="num" type="QInput" />
    </div>
    <div v-else class="wrapper">
      <q-card-section class="row q-py-none">
        <div class="col-12 col-md-12">
          <p class="q-ma-none text-weight-bold">{{ t('room_name') }}<span>*</span></p>
          <q-input
            ref="nameField"
            v-model="formValues.name"
            filled
            dense
            :placeholder="t('input_room_name')"
            lazy-rules
            :rules="nameRules"
          >
          </q-input>
        </div>

        <div class="col-6 col-md-6 col-sm-12 col-xs-12 q-pr-sm">
          <p class="q-ma-none text-weight-bold">{{ t('room_type') }}<span>*</span></p>
          <q-select
            ref="roomTypeField"
            v-model="formValues.roomTypeSn"
            filled
            :rules="roomTypeRules"
            :options="roomTypeListData ?? undefined"
            map-options
            dense
            option-label="name"
            :label="t('select_room_type')"
            clearable
            option-value="sn"
            :bg-color="props.roomSn !== 'new' ? 'grey-5' : ''"
            class="custom-limit-select"
            emit-value
            :disable="props.roomSn !== 'new'"
          />
        </div>
        <div class="col-6 col-md-6 col-sm-12 col-xs-12">
          <p class="q-ma-none text-weight-bold">{{ t('floor') }}<span>*</span></p>
          <q-select
            ref="floorSnField"
            v-model="formValues.floorSn"
            filled
            :rules="floorSnRules"
            :options="roomTypeFloorInfoData ?? undefined"
            map-options
            dense
            :label="t('select_floor')"
            clearable
            class="custom-limit-select"
            option-label="name"
            option-value="sn"
            :bg-color="props.roomSn !== 'new' ? 'grey-5' : ''"
            emit-value
            :disable="props.roomSn !== 'new'"
          />
        </div>
      </q-card-section>
    </div>
    <div class="row justify-end q-gutter-md">
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
        no-caps
        :label="t('save')"
        color="negative"
        type="submit"
        :disable="isLoading"
        :class="hasPermission('add-edit-room') === false ? 'hidden' : ''"
        :loading="createMutation.isLoading.value || updateMutation.isLoading.value"
        data-testId="submit-btn"
      />
    </div>
  </q-form>
</template>

<style scoped lang="scss">
.custom-limit-select :deep(span) {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: left;
}
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
