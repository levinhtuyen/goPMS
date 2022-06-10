<script setup lang="ts">
import { useAuth } from '~/composable/useAuth';
import { useQuasar } from 'quasar';
import { ref, watch } from 'vue';
import { usePermissionQuery } from './api/permissionQuery';
import { useRoleQuery } from './api/roleQuery';
import { useSetPermissionMutation } from './api/useSetPermissionMutation';
import { useI18n } from '~/composable/useI18n';
import { i18n } from '~/plugins/i18n';
import { useNotify } from '~/composable/useNotify';

const { profile, hasPermission } = useAuth();
// interface
interface IRes {
  children: [];
  grant: number;
  name: string;
  parentSn: number;
  slug: string;
  sn: number;
  status: number;
  isDisable: number;
}
interface IResChild {
  permissionSn: number;
  grant: number;
}
// data
const $q = useQuasar();
const { t } = useI18n();
const { notifyUpdateSuccess } = useNotify();
const roleSelected = ref();
const {
  data: dataForm,
  isFetching: isPerFetch,
  refetch: refetchPermission,
} = usePermissionQuery(roleSelected);
const permissionList = ref();
const { data: dataFilter, isFetching: isRoleFetch, refetch: refetchRole } = useRoleQuery();
const roleList = ref();
const mutation = useSetPermissionMutation();

let listGrant: [IResChild | object] = [{}];
// watch
watch(isPerFetch, () => {
  permissionList.value = dataForm?.value ? JSON.parse(JSON.stringify(dataForm?.value)) : [];
});
watch(isRoleFetch, () => {
  roleList.value = JSON.parse(JSON.stringify(dataFilter.value));
  roleSelected.value = roleList.value.find(
    (role: { sn: number }) => role.sn === Number(profile.value?.roleSn),
  );
});

watch(
  () => (i18n.global.locale as any).value,
  () => {
    refetchRole.value();
    refetchPermission.value();
  },
);

// method
const onSelectPermission = (val: IRes) => {
  listGrant.push({ permissionSn: val.sn, grant: val.grant }); // default set current permission
  if (val.children?.length > 0) {
    val.children.forEach((items: IRes) => {
      items.grant = items.status = val.grant;
      if (items.children?.length > 0) {
        onSelectPermission(items);
      } else {
        listGrant.push({ permissionSn: items.sn, grant: items.grant });
      }
    }); // set child permission
  }
};
const onSetPermission = () => {
  $q.loading.show();
  listGrant.splice(0, 1); // remove first index is empty
  mutation.mutate(
    { permissionList: listGrant },
    {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSuccess: () => {
        $q.loading.hide();
        notifyUpdateSuccess();
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onError: ({ response }) => {
        $q.loading.hide();
        response?.data.error.forEach(
          (val: { message: string | undefined; [key: string]: string | object | undefined }) => {
            $q.notify({
              message: val.message,
              position: 'bottom-right',
              type: 'negative',
              actions: [{ label: 'Dismiss', color: 'white' }],
            });
          },
        );
      },
    },
  );
};
</script>

<template>
  <pms-sections>
    <template #header>
      <h5 class="q-ma-none q-px-lg q-pb-md text-bold">{{ t('permission') }}</h5>
      <div>
        <p class="text-bold q-my-xs">{{ t('select_role') }}</p>
        <q-select
          v-model="roleSelected"
          dense
          filled
          :options="roleList"
          option-value="sn"
          option-label="name"
        />
      </div>
    </template>
    <div v-if="!isPerFetch" class="container q-pt-md borders-table q-mt-md q-mx-lg">
      <p class="q-mx-md text-bold">{{ t('permission_name') }}</p>
      <q-separator inset />
      <q-tree
        v-if="permissionList"
        :nodes="permissionList"
        class="q-ml-md"
        node-key="sn"
        no-connectors
      >
        <template #default-header="prop">
          <div class="block" style="width: 100%">
            <p class="q-ma-none q-pa-xs" :class="prop.node.parentSn == 0 ? 'text-bold' : ''">
              {{ prop.node.name }}
              <q-checkbox
                v-model="prop.node.grant"
                :disable="prop.node.status === 1 ? false : true"
                :class="hasPermission('edit-permission') === false ? 'hidden' : ''"
                class="float-right q-mx-lg"
                dense
                :true-value="1"
                :false-value="0"
                color="negative"
                @update:model-value="onSelectPermission(prop.node)"
              />
            </p>
          </div>
        </template>
      </q-tree>
    </div>
    <div v-else class="full-width full-height q-mt-md row justify-center relative-position">
      <q-inner-loading
        :showing="true"
        label="Please wait..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      >
        <div lass="full-width full-height q-mt-md row justify-center">
          <q-spinner color="negative" :thickness="2" size="2em" />
        </div>
      </q-inner-loading>
    </div>
    <template #footer>
      <div class="q-pt-xl q-gutter-sm row justify-end items-center q-gutter-lg">
        <router-link :to="{ name: 'Staff' }" class="text-bold" style="text-decoration: none">
          {{ t('back_to_staff_list') }}
        </router-link>
        <q-btn
          class="q-px-lg"
          :label="t('save')"
          color="negative"
          no-caps
          unelevated
          @click="onSetPermission()"
        />
      </div>
    </template>
  </pms-sections>
</template>

<style lang="scss" scoped>
.borders-table {
  border: 1px solid $grey-3;
}
</style>
