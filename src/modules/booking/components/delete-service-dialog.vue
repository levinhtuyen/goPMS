<template>
  <q-dialog v-model="dialogVisible" @hide="onDialogHide">
    <q-card class="custom-size-dialog hight-block-loading">
      <q-card-section>
        <q-toolbar>
          <q-toolbar-title>
            <div class="text-title text-weight-bold">
              {{ t('are_you_sure_you_want_to_delete_this_product') }}
            </div>
          </q-toolbar-title>
        </q-toolbar>
      </q-card-section>
      <div>
        <q-form ref="deleteService" class="q-gutter-md" @submit.prevent.stop="confirmService">
          <q-card-section class="row">
            <div class="col-12 col-md-12 q-pa-sm">
              <q-input
                ref="reason"
                v-model="confirm"
                filled
                dense
                type="textarea"
                :placeholder="t('reason_placeholder_require')"
                lazy-rules
                :rules="[
                  (value) =>
                    (!!value && 200 >= value?.length) ||
                    t('the_length_is_from_1_to_200_characters'),
                ]"
              >
              </q-input>
            </div>
            <div class="row col-12 col-md-12 custome-btn justify-end">
              <q-btn
                v-close-popup
                :label="t('cancel')"
                dense
                outline
                no-caps
                color="grey-8"
                class="q-mr-sm"
                style="padding: 8px 20px"
                @click="onCancel"
              />
              <q-btn :label="t('confirm')" type="submit" no-caps color="negative" />
            </div>
          </q-card-section>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from '~/composable/useI18n';
import type { QInput } from 'quasar';
import { useQuasar, date } from 'quasar';
import { LS_PROFILE } from '~/constants';

const { t } = useI18n();
const $q = useQuasar();

interface IItemService {
  createBy: string;
  createTime: number;
  deleteBy: string;
  deleteReason: string;
  deleteTime: number;
  productName: string;
  productSn: number;
  quantity: number;
  sn: number;
  totalPrice: number;
  unitPrice: number;
}

interface Emits {
  (e: 'close', item: IItemService): void;
  (e: 'update:modelValue', value: boolean): void;
}
// const $date = date.formatDate;
// let deleteTime = ref($date(Date.now(), 'YYYY/MM/DD'));
const deleteService = ref<HTMLFormElement>();
const emits = defineEmits<Emits>();
const props = defineProps({
  modelValue: { type: Boolean, require: true },
});
// data
const addServiceSn = ref(-1);
const confirm = ref();
let dataEdit = reactive<IItemService>({
  createBy: '',
  createTime: 0,
  deleteBy: '',
  deleteReason: '',
  deleteTime: 0,
  productName: '',
  productSn: 0,
  quantity: 0,
  sn: 0,
  totalPrice: 0,
  unitPrice: 0,
});
const setupDeleteServiceDialog = async (item: IItemService, sn: number) => {
  addServiceSn.value = sn;
  dataEdit = item;
  deleteService.value?.resetValidation();
};
defineExpose({
  setupDeleteServiceDialog,
});

const reason = ref<QInput | null>(null);

// computed
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val: boolean) {
    emits('update:modelValue', val);
  },
});
// watch
// method
const onDialogHide = () => {
  confirm.value = '';
  deleteService.value?.resetValidation();
  // onCancel();
};
const onCancel = () => {
  // deleteService.value?.resetValidation();
};
const confirmService = () => {
  const now = ref<number>(Date.now());
  let deleteTime = ref(Number(date.formatDate(now.value, 'X')));
  dataEdit.deleteTime = deleteTime.value;
  dataEdit.deleteReason = confirm.value;
  dataEdit.deleteBy = JSON.parse(localStorage.getItem(LS_PROFILE) || '{}')?.value?.fullName;
  deleteService.value?.validate().then((success: boolean) => {
    if (!success) {
      return false;
    } else {
      $q.notify({
        message: t('delete_success'),
        position: 'top',
        type: 'positive',
        actions: [{ color: 'white' }],
      });
      deleteService.value?.resetValidation();

      setTimeout(() => {
        emits('close', dataEdit);
      }, 600);
    }
  });
};
</script>
<style lang="scss" scoped>
.text-title {
  font-size: 16px;
  color: $grey-8;
}
</style>
