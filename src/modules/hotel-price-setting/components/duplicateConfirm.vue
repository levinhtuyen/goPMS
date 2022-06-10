<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoomTypeQuery } from '~/apis/commons/useOptionsQuery';
import { useI18n } from '~/composable/useI18n';
import {
  useDuplicatePriceOfPricingPlanMutation,
  IPriceOfPricingPlanMutationVariables,
  IPriceOfTimeFrameMutationVariables,
} from '../apis/useDuplicatePricingMutation';
import { usePricingDetailQuery } from '../apis/pricingDetailQuery ';

import { useNotify } from '~/composable/useNotify';

// interface
interface Emits {
  (e: 'close'): void;
  (e: 'update:modelValue', value: boolean): void;
  (e: 'onConfirm', value: IFormData): void;
}
interface Props {
  modelValue: boolean;
}
interface IFormData {
  roomTypeSn: number;
  name: string;
}
// data
const { t } = useI18n();
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
let formData: IFormData = reactive({
  roomTypeSn: 1,
  name: '',
});
const { notifyUpdateSuccess } = useNotify();
const pricingSn = ref(-1);
const overnightFrame = ref('');
const dailyFrame = ref('');
const mutation = useDuplicatePriceOfPricingPlanMutation();
const newHour = ref<IPriceOfTimeFrameMutationVariables[]>([]);
const newHourEarlyOv = ref<IPriceOfTimeFrameMutationVariables[]>([]);
const newHourLateOv = ref<IPriceOfTimeFrameMutationVariables[]>([]);
const newHourEarlyDl = ref<IPriceOfTimeFrameMutationVariables[]>([]);
const newHourLateDl = ref<IPriceOfTimeFrameMutationVariables[]>([]);
const timeArrFrame = ref<IPriceOfPricingPlanMutationVariables[]>([]);
const { data: roomTypeData, isFetching: isFetchingRoom } = useRoomTypeQuery({
  enabled: true,
});
const roomTypeList = ref([{ name: 'Twin 01', sn: 1 }]);
const enabledPricingQuery = computed(() => {
  return !!pricingSn.value;
});
const { data: pricingDetail, isFetching } = usePricingDetailQuery(pricingSn, {
  enabled: enabledPricingQuery.value,
});
const setupPricingDuplicateDialog = async (val: any) => {
  pricingSn.value = val.sn;
};
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
watch(isFetchingRoom, () => {
  roomTypeList.value = JSON.parse(JSON.stringify(roomTypeData.value));
});
watch(isFetching, () => {
  clearCol();
  formData.roomTypeSn = pricingDetail.value?.roomTypeSn;
  formData.name = pricingDetail.value?.name;
  pricingDetail.value?.priceOfTimeFrame &&
    pricingDetail.value.priceOfTimeFrame.forEach((val: any) => {
      if (val.bookingType === 1) {
        newHour.value.push(val);
      } else if (val.bookingType === 2) {
        if (val.priceType === 2) {
          newHourEarlyOv.value.push(val);
        } else {
          newHourLateOv.value.push(val);
        }
      } else if (val.bookingType === 3) {
        if (val.priceType === 2) {
          newHourEarlyDl.value.push(val);
        } else {
          newHourLateDl.value.push(val);
        }
      }
    });
  pricingDetail.value?.priceOfPricingPlan &&
    pricingDetail.value?.priceOfPricingPlan.forEach((val: any) => {
      if (val.bookingType === 2) {
        overnightFrame.value = val.price;
      } else if (val.bookingType === 3) {
        dailyFrame.value = val.price;
      }
    });
});
const onConfirm = () => {
  timeArrFrame.value.splice(0, 1); // remove first index is empty
  overnightFrame.value &&
    timeArrFrame.value.push({
      bookingType: 2,
      price: overnightFrame.value,
    });
  dailyFrame.value &&
    timeArrFrame.value.push({
      bookingType: 3,
      price: dailyFrame.value,
    });
  mutation.mutate(
    {
      pricingPlanSn: pricingSn.value,
      roomTypeSn: formData.roomTypeSn,
    },
    {
      onSuccess: (response) => {
        if (response?.code == 1) {
          notifyUpdateSuccess();
          setTimeout(() => {
            emits('close');
          }, 400);
        }
      },
    },
  );
};
const clearCol = () => {
  overnightFrame.value = '';
  dailyFrame.value = '';
  timeArrFrame.value.splice(0, timeArrFrame.value.length);
  newHour.value.splice(0, newHour.value.length);
  newHourEarlyOv.value.splice(0, newHourEarlyOv.value.length);
  newHourLateOv.value.splice(0, newHourLateOv.value.length);
  newHourEarlyDl.value.splice(0, newHourEarlyDl.value.length);
  newHourLateDl.value.splice(0, newHourLateDl.value.length);
};
defineExpose({
  setupPricingDuplicateDialog,
});
</script>

<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="padding: 0 20px 0px 20px; max-width: 1500px; width: 460px">
      <q-card-section class="q-pa-none q-py-lg text-left">
        <p class="q-mb-xl text-weight-bold">
          {{ t('do_you_want_to_duplicate_this_pricing_plan_for') }}
        </p>
        <q-form class="q-gutter-md" @submit.prevent.stop="onConfirm">
          <div class="row">
            <p class="q-ma-none text-weight-bold">{{ t('room_type') }}<span>*</span></p>
          </div>
          <q-select
            v-model="formData.roomTypeSn"
            dense
            filled
            class="q-my-none"
            :options="roomTypeList"
            option-label="name"
            option-value="sn"
            emit-value
            map-options
          />
          <div class="bg-white text-teal text-right">
            <q-btn
              v-close-popup
              class="q-mr-md"
              dense
              no-caps
              outline
              color="grey-8"
              style="padding: 8px 20px"
            >
              {{ t('cancel') }}
            </q-btn>
            <q-btn type="submit" dense no-caps color="negative" style="padding: 8px 20px">{{
              t('confirm')
            }}</q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
