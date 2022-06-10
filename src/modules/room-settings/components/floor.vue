<script setup lang="ts">
import type { ValidationRule } from 'quasar';
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useEditable } from '~/composable/useEditable';
import { useI18n } from '~/composable/useI18n';
import { useNotify } from '~/composable/useNotify';
import { router } from '~/router';
import { useDeleteFloorMutation } from '../apis/useDeleteFloorMutation';
import { useRoomTypeFloorInfoQuery } from '../apis/useRoomTypeFloorInfoQuery';
import { useUpdateFloorMutation } from '../apis/useUpdateFloorMutation';
import { useAuth } from '~/composable/useAuth';

interface IFloorProps__room {
  sn: number;
  roomTypeCode: string;
  name: string;
}

interface IFloorProps {
  floorName: string;
  floorSn: number;
  rooms: IFloorProps__room[];
}

const props = defineProps<IFloorProps>();
const { hasPermission } = useAuth();
const { data: roomTypeFloorInfoData } = useRoomTypeFloorInfoQuery();
const { notifySaveSuccess, notifySaveFailed } = useNotify();
const $q = useQuasar();
const route = useRoute();
const { t } = useI18n();

const sortedRooms = computed(() => {
  const { code } = route.query;
  if (!code || Array.isArray(code)) return props.rooms;

  return props.rooms.filter(({ roomTypeCode }) => roomTypeCode === code.replaceAll('_', ' '));
});

const updateFloorMutation = useUpdateFloorMutation();
const deleteFloorMutation = useDeleteFloorMutation();

const floorNameValue = ref(props.floorName);
const { inputElementRef, isEditMode, startEdit, finishEdit } = useEditable({
  onFinishEdit: () => (floorNameValue.value = props.floorName),
});
const floorNameRules: ValidationRule<string>[] = [
  (value) => !!value.trim() || t('this_is_invalid_value'),
  (value) => value.trim().length <= 10 || t('the_length_is_from_1_to_10_characters'),
  (value) =>
    !roomTypeFloorInfoData.value?.some(
      ({ name, sn }) => props.floorSn !== sn && name.toLowerCase() === value.trim().toLowerCase(),
    ) || t('this_is_invalid_value'),
];

const onSubmitFloorName = async (event: KeyboardEvent) => {
  const isValid = inputElementRef.value?.validate();
  if (!isValid) return;
  const { value } = event.currentTarget as HTMLInputElement;
  updateFloorMutation.mutate(
    { sn: props.floorSn, name: value.trim() },
    {
      onSuccess: () => {
        notifySaveSuccess();
        finishEdit();
      },
      onError: () => {
        notifySaveFailed();
      },
    },
  );
};

const onClickDeleteFloor = () => {
  if (props.rooms.length !== 0) {
    $q.notify({
      message: t('please_remove_all_rooms_of_this_floor'),
      position: 'top',
      type: 'negative',
      color: 'red-1',
      textColor: 'negative',
    });
    return;
  }
  $q.dialog({
    // title: t('confirm'),
    message: t('are_you_sure_you_want_to_delete_this_floor'),
    cancel: {
      color: 'grey-8',
      label: t('cancel'),
      noCaps: true,
      dense: true,
      outline: true,
    },
    ok: {
      color: 'negative',
      label: t('confirm'),
      dense: true,
      noCaps: true,
    },
    persistent: true,
  }).onOk(() => {
    deleteFloorMutation.mutate(
      { sn: props.floorSn },
      {
        onSuccess: () => {
          notifySaveSuccess();
        },
        onError: () => {
          notifySaveFailed();
        },
      },
    );
  });
};

const onClickRoom = (room: IFloorProps__room) => {
  if (hasPermission('add-edit-room') === false) {
    return;
  }
  router.replace({
    path: `/settings/room-settings/rooms/${room.sn}`,
    state: { roomName: room.name, floorId: props.floorSn },
    query: route.query,
  });
};

const onClickAddRoom = () => {
  router.replace({
    path: `/settings/room-settings/rooms/new`,
    state: { roomName: null, floorId: props.floorSn },
    query: route.query,
  });
};
</script>

<template>
  <div class="q-pl-md">
    <div class="q-table__grid-item col-12">
      <div class="block-floor">
        <div class="row">
          <div class="col-11">
            <div class="cursor-pointer q-px-sm q-py-md">
              <q-input
                v-if="isEditMode"
                ref="inputElementRef"
                v-model="floorNameValue"
                :class="hasPermission('add-edit-delete-floor') === false ? 'hidden' : ''"
                class="is-floor-name"
                :rules="floorNameRules"
                :placeholder="t('input_floor_name')"
                borderless
                dense
                @keydown.enter.prevent="onSubmitFloorName"
                @keydown.esc.prevent="finishEdit"
                @keydown.tab.prevent="finishEdit"
              />
              <div v-else>
                <span class="is-floor-name"> {{ props.floorName }}</span
                ><q-icon
                  class="q-px-sm q-pb-sm"
                  name="create"
                  size="sm"
                  :class="hasPermission('add-edit-delete-floor') === false ? 'hidden' : ''"
                  @click="startEdit"
                />
              </div>
            </div>
          </div>
          <div
            v-close-popup
            class="col-1 justify-end flex items-center cursor-pointer"
            :class="hasPermission('add-edit-delete-floor') === false ? 'hidden' : ''"
            clickable
            @click="onClickDeleteFloor"
          >
            <q-icon class="float-right q-mb-sm" name="delete" size="sm" />
          </div>
        </div>
        <div class="row">
          <div
            v-for="(roomlist, index) in sortedRooms"
            :key="index"
            class="col-lg-2 col-xl-2 col-md-3 col-sm-3 col-xs-12 cursor-pointer q-pa-sm"
          >
            <div
              class="item-floor row justify-center full-width full-height items-center"
              @click="hasPermission('add-edit-room') === false ? '' : onClickRoom(roomlist)"
            >
              <div class="is-code color-text-block row justify-center">
                <p class="q-mb-none full-height limit-text">
                  {{ roomlist.name }}
                  <q-tooltip v-if="roomlist.name">{{ roomlist.name }}</q-tooltip>
                </p>
              </div>
              <div class="is-name color-text-block row justify-center">
                <p class="full-height limit-text">
                  {{ roomlist.roomTypeCode }}
                  <q-tooltip v-if="roomlist.roomTypeCode">{{ roomlist.roomTypeCode }}</q-tooltip>
                </p>
              </div>
            </div>
          </div>
          <div class="col-lg-2 col-xl-2 col-md-3 col-sm-3 col-xs-12 q-pa-sm">
            <div
              v-close-popup
              class="item-add-floor row justify-center full-width full-height items-center cursor-pointer"
              :class="hasPermission('add-edit-room') === false ? 'hidden' : ''"
              clickable
              @click="onClickAddRoom"
            >
              <div class="block-code">
                <p class="q-mb-none full-height color-text-add-block">{{ t('new_room') }}</p>
              </div>
              <div class="block-name">
                <p class="full-height color-text-add-block"><q-icon name="add" size="sm" /></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$color-active: #ff6400;
$color-no-active: #71717a;
$background-item: #ffebe3;
$background-add-item: #ffffff;
.is-floor-name {
  font-size: 24px;
  font-weight: 600;
  color: #3f3f46;
  padding-bottom: 0;
}
.block-floor {
  border-radius: 16px;
  vertical-align: top;
  padding: 12px;
  color: #000;
  background-color: #fff;
  border: 1px solid rgba(189, 189, 189, 0.7);
}
.item-floor {
  background: $background-item;
  min-height: 89px;
  border-radius: 8px;
  .is-code {
    font-weight: 700;
    font-size: 22px;
  }
  .is-name {
    font-weight: 600;
    font-size: 14px;
  }
}
.item-add-floor {
  background: $background-add-item;
  min-height: 89px;
  border-radius: 8px;
  border: 1px solid #6c757d;
  .block-code {
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    width: 100%;
    color: $color-no-active;
  }
  .block-name {
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    width: 100%;
    color: $color-no-active;
  }
}
.color-text-block {
  text-align: center;
  width: 100%;
  color: $color-active;
}
.limit-text {
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
</style>
