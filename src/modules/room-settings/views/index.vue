<script setup lang="ts">
import type { ValidationRule } from 'quasar';
import { computed, ref, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useEditable } from '~/composable/useEditable';
import { useI18n } from '~/composable/useI18n';
import { useNotify } from '~/composable/useNotify';
import { router } from '~/router';
import { useCreateFloorMutation } from '../apis/useCreateFloorMutation';
import { useRoomTypeFloorInfoQuery } from '../apis/useRoomTypeFloorInfoQuery';
import { useRoomTypeListQuery } from '../apis/useRoomTypeListQuery';
import Floor from '../components/floor.vue';
import { useAuth } from '~/composable/useAuth';
import { Emitter } from 'mitt';

const { data: roomTypeListData, refetch: refetchRoomTypeData } = useRoomTypeListQuery();
let { data: roomTypeFloorInfoData, refetch: refetchTypeFloorInfoData } =
  useRoomTypeFloorInfoQuery();
const createFloorMutation = useCreateFloorMutation();
const emitter = inject('emitter') as Emitter<any>;
onMounted(() => {
  emitter.on('addRoomType', async () => {
    refetchRoomTypeData.value();
  });
  emitter.on('changeHotelInfo', async () => {
    refetchRoomTypeData.value();
  });
  emitter.on('refetchListRoomSetting', async () => {
    refetchTypeFloorInfoData.value();
  });
  if (roomTypeListData.value) {
    refetchRoomTypeData.value();
  }
});
const route = useRoute();
const { t } = useI18n();

const { notifySaveSuccess, notifySaveFailed } = useNotify();
const { hasPermission } = useAuth();
const newFloorNameValue = ref('');
const newFloorNameRules: ValidationRule<string>[] = [
  (value) => !!value.trim() || t('this_field_is_required'),
  (value) => value.trim().length <= 10 || t('the_length_is_from_1_to_10_characters'),
  (value) =>
    !roomTypeFloorInfoData.value?.some(({ name }) => name === value.trim()) ||
    t('this_is_invalid_value'),
];

const { inputElementRef, isEditMode, finishEdit, startEdit } = useEditable({
  onFinishEdit: () => (newFloorNameValue.value = ''),
});

const totalRoomsCount = computed(() => {
  let count = 0;
  roomTypeListData.value?.forEach(({ numOfRoom }) => (count += numOfRoom));
  return count;
});

const onSubmitNewFloor = async () => {
  const isValid = inputElementRef.value?.validate();

  if (!isValid) return;
  createFloorMutation.mutate(
    { name: newFloorNameValue.value.trim() },
    {
      onSuccess: () => {
        notifySaveSuccess();
        finishEdit();
        refetchTypeFloorInfoData.value();
      },
      onError: () => {
        notifySaveFailed();
      },
    },
  );
};

const onClickNewRoomType = () => {
  router.replace({
    path: `/settings/room-settings/room-types/new`,
    query: route.query,
    state: { code: null },
  });
};

const onClickEditRoomType = (roomTypeId: number, code: string) => {
  router.replace({
    path: `/settings/room-settings/room-types/${roomTypeId}`,
    query: route.query,
    state: { code },
  });
};
</script>

<template>
  <pms-sections>
    <div class="row">
      <div class="col-12">
        <p class="custom-title-room">{{ t('room_configuration') }}</p>
      </div>
      <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <q-list
          separator
          class="room-types-list border-all-top"
          style="border: 1px solid #dee2e6; margin: 0 -1px"
        >
          <q-item
            to="/settings/room-settings"
            replace
            class="text-white border-all-top q-py-sm"
            :class="[route.query.code ? 'item-no-active' : ' item-active']"
          >
            <q-toolbar-title class="row justify-center no-padding text-weight-bold"
              ><q-item-section :class="[route.query.code ? 'text-black' : 'text-white']">
                {{ t('all') }}
              </q-item-section>
              <q-item-section side>
                <q-badge
                  class="custom-p-badge"
                  :class="[route.query.code ? 'item-active' : 'item-no-active']"
                  :label="totalRoomsCount"
                  rounded
                />
              </q-item-section>
            </q-toolbar-title>
          </q-item>
          <q-item
            v-for="{ numOfRoom, code, name, sn } in roomTypeListData"
            :key="sn"
            style="min-height: 60px"
            :to="`/settings/room-settings?code=${code?.replaceAll(' ', '_')}`"
            replace
            :class="[
              route.query?.code === code?.replaceAll(' ', '_') ? 'item-active' : ' item-no-active',
            ]"
          >
            <q-item-section>
              <q-item-label
                class="limit-text style-code"
                :class="[
                  route.query?.code === code?.replaceAll(' ', '_') ? 'text-white' : 'text-black',
                ]"
              >
                {{ code }} <q-tooltip v-if="code">{{ code }}</q-tooltip>
              </q-item-label>
              <q-item-label caption
                ><div
                  class="limit-text style-name"
                  :class="[
                    route.query?.code === code?.replaceAll(' ', '_') ? 'text-white' : 'text-black',
                  ]"
                >
                  {{ name }} <q-tooltip v-if="name">{{ name }}</q-tooltip>
                </div></q-item-label
              >
            </q-item-section>
            <q-item-section
              side
              :class="hasPermission('add-edit-room-type') === false ? 'hidden' : ''"
            >
              <div style="margin-top: -12px">
                <q-btn icon="create" flat round @click.prevent="onClickEditRoomType(sn, code)">
                  <q-tooltip>
                    {{ t('edit_room_type') }}
                  </q-tooltip>
                </q-btn>
                <q-badge
                  class="custom-p-badge"
                  :class="[
                    route.query?.code === code?.replaceAll(' ', '_')
                      ? 'q-badge-active'
                      : 'q-badge-no-active',
                  ]"
                  :label="numOfRoom"
                  rounded
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div>
          <q-btn
            style="width: 100%"
            :class="hasPermission('add-edit-room-type') === false ? 'hidden' : ''"
            :label="t('new_room_type')"
            class="q-my-md text-weight-bold custom-btn-add-room-type custom-block-add-room-type"
            icon="add_circle"
            @click="onClickNewRoomType"
          />
        </div>
      </div>
      <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-xs-12">
        <Floor
          v-for="{ name, sn, roomList } in roomTypeFloorInfoData
            ?.slice()
            .sort((a, b) => a.name.localeCompare(b.name))"
          :key="sn"
          :floor-name="name"
          :floor-sn="sn"
          :rooms="roomList"
        />
        <div class="q-pl-md">
          <div class="q-table__grid-item col-12">
            <div
              v-if="isEditMode"
              class="custom-input-add-floor full-width justify-center items-center"
            >
              <q-input
                ref="inputElementRef"
                v-model="newFloorNameValue"
                :class="hasPermission('add-edit-delete-floor') === false ? 'hidden' : ''"
                borderless
                color="none"
                style="font-size: 22px"
                :rules="newFloorNameRules"
                :placeholder="t('input_floor_name')"
                maxlength="10"
                @keydown.enter.prevent="onSubmitNewFloor"
                @keydown.esc.prevent="finishEdit"
                @keydown.tab.prevent="finishEdit"
              >
                <template #prepend> <div class="q-px-sm"></div> </template>
                <template #append> <div></div> </template>
              </q-input>
            </div>
            <q-btn
              v-else
              :class="hasPermission('add-edit-delete-floor') === false ? 'hidden' : ''"
              :label="t('new_floor')"
              class="custom-block-add-floor full-width q-py-md"
              icon="add_circle"
              @click="startEdit"
            />
          </div>
        </div>
        <router-view />
      </div>
    </div>
  </pms-sections>
</template>

<style scoped lang="scss">
$color-active: #ff6400;
$background-active: #ff6400;
$color-no-active: #ffffff;
$background-no-active: #ffffff;
$background-focus: #ffebe3;
$color-icon-no-active: #3f3f46;
$color-icon-active: #ffffff;

.q-item {
  min-height: 50px;
}
.item-no-active {
  background: $background-no-active !important;
  color: $color-active !important;
}
.item-active {
  background: $color-active !important;
  color: $color-no-active !important;
}
.q-badge-active {
  background: $background-no-active !important;
  color: $color-active !important;
}
.q-badge-no-active {
  background: $background-active !important;
  color: $color-no-active !important;
}
.item-active :deep(.q-icon) {
  color: $color-icon-active !important;
}
.room-types-container {
  position: fixed;
  top: 5rem;
  width: 18rem;
}
.border-all-top {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  cursor: pointer;
}
.room-types-list {
  width: 100%;
  // max-height: 80vh;
  background-color: $background-no-active;
  overflow-y: auto;
}

.style-code {
  font-size: 16px;
  font-weight: 700;
}
.style-name {
  font-size: 12px;
  font-weight: 400;
}
.floors-container {
  margin-left: 19rem;
}
.limit-text {
  max-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 170px;
  text-align: left;
}
.custom-block-add-room-type {
  background: $background-no-active;
  color: $color-active;
  border-radius: 8px;
  border: 1px solid;
  &::before {
    border-radius: 8px;
    box-shadow: none;
  }
}
.custom-p-badge {
  padding: 6px 14px;
  font-weight: 600;
}
.custom-input-add-floor {
  // background: $background-no-active;
  color: $color-active;
  // border-radius: 16px;
  //
  border: none;
  font-size: 16px;
  &::before {
    border-radius: 16px;
  }
}
.custom-input-add-floor :deep(.q-field__inner) {
  border-radius: 16px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}
.custom-block-add-floor {
  background: $background-no-active;
  color: $color-active;
  border-radius: 16px;
  font-size: 16px;
  border: 1px solid $background-active;
  &::before {
    border-radius: 16px;
    box-shadow: none;
  }
}
.custom-title-room {
  font-size: 24px;
  font-weight: 700;
  color: #3f3f46;
}
</style>
