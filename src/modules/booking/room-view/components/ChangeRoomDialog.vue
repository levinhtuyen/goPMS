<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useNotify } from '~/composable/useNotify';
import { useChangeRoomMutation } from '../apis/useChangeRoomMutation';
import { useRoomListQuery } from '../apis/useRoomListAppendixQuery';
import { useRoomTypeListQuery } from '../apis/useRoomTypeListAppendixQuery';
export interface ICancelReservationDialog {
  setupChangeRoomDialog(
    roomSn: number | null,
    name: string | null,
    guest: string | null,
    bookingSn: number | null,
    roomTypeSn: number | null,
  ): void;
}
interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'changeSuccess'): void;
}
interface Props {
  modelValue: boolean;
}
// prop, emits
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
// data
const roomTypeSn = ref<number | null>(null);
const { notifyUpdateSuccess } = useNotify();
const changeRoomMutation = useChangeRoomMutation();
const guestName = ref<string | null>('');
const roomName = ref<string | null>('');
const changeRoomFomRef = ref<HTMLFormElement>();
const { t } = useI18n();
const formData = reactive({
  bookingSn: null as number | null,
  roomSn: null as number | null,
  reason: '' as string,
  roomTypeSn: null as number | null,
});
// vue-query
const { data: roomTypeListData } = useRoomTypeListQuery();

// onMounted(() => {
//   if (roomTypeListData.value) {
//     refetchData.value();
//   }
// });
// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emits('update:modelValue', value);
  },
});
// methods
const { data: roomListData, isFetching: roomListFetching } = useRoomListQuery(roomTypeSn, {
  enabled: true,
});
const changeRoom = () => {
  changeRoomFomRef.value?.validate().then((success: boolean) => {
    if (success) {
      changeRoomMutation.mutate(formData, {
        onSuccess: (data: any) => {
          if (data) {
            notifyUpdateSuccess();
            emits('changeSuccess');
          }
        },
      });
    } else {
      return false;
    }
  });
  // changeRoomMutation.mutate(() => {});
};
const setupChangeRoomDialog = async (
  roomSn: number | null,
  name: string | null,
  guest: string | null,
  bookingSn: number | null,
  roomType: number | null,
) => {
  formData.bookingSn = bookingSn;
  formData.roomSn = roomSn;
  formData.roomTypeSn = roomType;
  roomTypeSn.value = roomType;
  guestName.value = guest;
  roomName.value = name;
};
const resetFormData = () => {
  formData.bookingSn = null;
  formData.roomSn = null;
  formData.reason = '';
  formData.roomTypeSn = null;
};
// defineExpose
defineExpose<ICancelReservationDialog>({
  setupChangeRoomDialog,
});
</script>
<template>
  <q-dialog v-model="dialogVisible" @hide="resetFormData">
    <q-card style="padding: 0 32px 24px 32px; width: 486px">
      <q-bar class="bg-white q-my-md q-mr-sm q-pa-none">
        <div class="text-h5 text-bold">{{ t('change_room') }}</div>
        <q-space />
        <q-btn v-close-popup dense flat icon="close"> </q-btn>
      </q-bar>
      <q-separator />
      <div class="row items-center justify-between q-mt-md">
        <p class="text-bold text-body1">{{ roomName }}</p>
        <p class="text-bold text-body1">{{ guestName }}</p>
      </div>
      <q-card-section class="q-pa-none q-py-md">
        <q-form ref="changeRoomFomRef" class="q-gutter-md">
          <div class="col">
            <p class="q-mb-xs">{{ t('room_type_name') }}</p>
            <q-select
              v-model="formData.roomTypeSn"
              filled
              dense
              :options="roomTypeListData || []"
              option-label="name"
              option-value="sn"
              map-options
              emit-value
              readonly
              class="custom-input-readonly"
              bg-color="grey-5"
            />
          </div>
          <div class="col">
            <p class="q-mb-xs">{{ t('room_name') }}*</p>
            <q-select
              v-model="formData.roomSn"
              :loading="roomListFetching"
              filled
              dense
              map-options
              :options="roomListData || []"
              emit-value
              option-label="name"
              option-value="sn"
              :rules="[(val) => !!val || 'Please select Room name']"
            />
          </div>
          <q-input
            v-model="formData.reason"
            :placeholder="t('reason_placeholder_require')"
            class="col"
            filled
            :rules="[
              (val) => !!val || t('this_field_is_required'),
              (val) => val.length <= 200 || t('reason_cancel_booking_valid_max'),
            ]"
            type="textarea"
            input-style="height: 100px;"
            style="min-height: 100px"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal text-right">
        <q-btn v-close-popup no-caps outline color="grey-8" style="padding: 8px 20px">
          {{ t('cancel') }}
        </q-btn>
        <q-btn no-caps color="negative" style="padding: 8px 20px" @click="changeRoom">{{
          t('save')
        }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style lang="scss" scoped>
.custom-input-readonly :deep(.q-field__control) {
  &::before {
    border: none;
  }
}
</style>
