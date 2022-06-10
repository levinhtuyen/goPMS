<template>
  <q-form ref="createBookingSource" class="q-gutter-md" @submit.prevent.stop="onSubmit">
    <q-card-section class="row">
      <div class="col-12 col-md-6 q-pa-sm">
        <p class="q-ma-none text-weight-bold">{{ t('booking_source_name') }}<span>*</span></p>
        <q-input
          v-model="formValues.name"
          filled
          dense
          lazy-rules
          :placeholder="t('input_booking_source_name')"
          :rules="[...isRequiredRules, ...isLengthFrom1To50Rules]"
        />
      </div>
      <div class="col-12 col-md-6 q-pa-sm">
        <p class="q-ma-none text-weight-bold">{{ t('booking_source_code') }}<span>*</span></p>
        <q-input
          v-model="formValues.code"
          filled
          dense
          lazy-rules
          :placeholder="t('input_booking_source_code')"
          :rules="[...isRequiredRules, ...isLengthFrom1To20Rules]"
        />
      </div>
      <div class="col-12 col-md-12 q-pa-sm">
        <p class="q-ma-none text-weight-bold">
          {{ t('description') }}
        </p>
        <q-input
          v-model="formValues.description"
          filled
          dense
          :placeholder="t('input_description')"
          lazy-rules
          :rules="isLengthFrom1To50Rules"
          :error="descriptionErr"
        >
          <template #error>
            <p>
              {{ t('the_length_is_from_0_to_50_characters') }}
            </p>
          </template>
        </q-input>
      </div>
      <div class="row col-md-12 justify-end q-pa-md">
        <q-btn
          v-close-popup
          :label="t('cancel')"
          dense
          outline
          no-caps
          class="q-mr-md"
          color="grey-8"
          style="padding: 8px 20px"
        />
        <q-btn :label="t('save')" color="negative" no-caps type="submit">
          <template #loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </div>
    </q-card-section>
  </q-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from '~/composable/useI18n';
import { useCreateBookingSourceMutation } from '../api/useCreateBookingSourceMutation';
import { useQuasar } from 'quasar';
import { useNotify } from '~/composable/useNotify';
import { useRule } from '~/composable/useValidate';

const { notifyCreateSuccess } = useNotify();
const { t } = useI18n();
const $q = useQuasar();
interface Emits {
  (e: 'close'): void;
}
const createBookingSource = ref<HTMLFormElement>();
const emits = defineEmits<Emits>();
const mutation = useCreateBookingSourceMutation();
const formValues = ref({
  code: '',
  name: '',
  description: '',
});

const { isRequiredRules, isLengthFrom1To50Rules, isLengthFrom1To20Rules } = useRule();

const descriptionErr = computed(() => formValues.value?.description?.length > 50);

const onSubmit = () => {
  createBookingSource.value?.validate().then((success: boolean) => {
    if (!success) {
      return false;
    } else {
      mutation.mutate(formValues.value, {
        onSuccess: (response: any) => {
          if (response?.code === 1) {
            notifyCreateSuccess();
            setTimeout(() => {
              emits('close');
            }, 600);
          } else if (response?.code === 2) {
            const err = response?.error;
            err.forEach(
              (val: {
                message: string | undefined;
                [key: string]: string | object | undefined;
              }) => {
                $q.notify({
                  message: val.message,
                  position: 'top',
                  type: 'negative',
                  actions: [{ color: 'white' }],
                });
              },
            );
          }
        },
      });
    }
  });
};
</script>
<style lang="sass" scoped>
.custom-size-dialog
  width: 876px
.q-dialog__inner--minimized div
  max-width: 876px
</style>
