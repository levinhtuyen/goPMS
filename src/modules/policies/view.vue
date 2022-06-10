<template>
  <pms-sections>
    <template #header>
      <div class="row q-pb-md">
        <div class="text-h5 text-bold">{{ t('policy') }}</div>
      </div>
    </template>
    <q-inner-loading v-if="isLoading" showing color="red" />
    <div v-else class="">
      <q-form ref="updatePolicyFormRef">
        <div class="row">
          <div class="col-12 col-md-6 q-pr-sm">
            <q-card class="q-mb-sm">
              <q-card-section class="bg-negative q-pa-sm">
                <div class="text-subtitle1 text-white text-bold">{{ t('general_setting') }}</div>
              </q-card-section>
              <q-separator />
              <q-card-actions vertical>
                <div class="row items-baseline justify-between">
                  <p class="text-weight-bold">{{ t('hour_round_up') }}</p>
                  <div class="row items-baseline justify-between" style="width: 9em">
                    <p>
                      <q-input
                        v-model="formValues.roundUpHour"
                        lazy-rules
                        dense
                        outlined
                        mask="##"
                        style="width: 3.5em"
                      />
                    </p>
                    <p>{{ t('minutes') }}</p>
                  </div>
                </div>
                <p v-if="!formValues.roundUpHour" class="row justify-end text-red">
                  {{ t('this_field_is_required') }}
                </p>
                <p
                  v-else-if="formValues.roundUpHour < 1 || formValues.roundUpHour > 59"
                  class="row justify-end text-red"
                >
                  {{ t('the_value_is_from_1_to_59') }}
                </p>

                <div class="row items-baseline justify-between">
                  <p class="text-weight-bold">{{ t('select_currency') }}</p>
                  <div class="row" style="width: 9em">
                    <q-select
                      v-model="formValues.countrySn"
                      outlined
                      dense
                      style="width: 100%"
                      :options="currencyOptions"
                      emit-value
                      map-options
                      option-label="label"
                      option-value="value"
                    />
                  </div>
                </div>
              </q-card-actions>
            </q-card>
          </div>
          <div class="col-12 col-md-6 q-pl-sm">
            <q-card class="q-mb-sm">
              <q-card-section class="bg-negative q-pa-sm">
                <div class="text-subtitle1 text-white text-bold">{{ t('overnight') }}</div>
              </q-card-section>

              <q-card-actions vertical>
                <div class="row">
                  <div class="col-12 col-md-6 q-pa-sm">
                    <p class="text-bold">{{ t('overnight_start_time') }}</p>
                    <q-input
                      ref="startOvernightField"
                      v-model="formValues.startOvernight"
                      lazy-rules
                      :rules="startOvernightRules"
                      mask="time"
                      dense
                      outlined
                      @focus="onOpenOvernightStartTimePopUp"
                    >
                      <template #append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qOvernightStartTimeRef"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-time v-model="formValues.startOvernight" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6 q-pa-sm">
                    <p class="text-bold">{{ t('overnight_end_time') }}</p>
                    <q-input
                      ref="endOvernightField"
                      v-model="formValues.endOvernight"
                      lazy-rules
                      :rules="endOvernightRules"
                      mask="time"
                      dense
                      outlined
                      @focus="onOpenOvernightEndTimePopUp"
                    >
                      <template #append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qOvernightEndTimeRef"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-time v-model="formValues.endOvernight" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-actions>
            </q-card>

            <q-card class="q-mb-md">
              <q-card-section class="bg-negative q-pa-sm">
                <div class="text-subtitle1 text-white text-bold">{{ t('daily') }}</div>
              </q-card-section>

              <q-card-actions vertical>
                <div class="row">
                  <div class="col-12 col-md-6 q-pa-sm">
                    <p class="text-bold">{{ t('daily_start_time') }}</p>
                    <q-input
                      ref="startDailyField"
                      v-model="formValues.startDaily"
                      lazy-rules
                      :rules="startDailyRules"
                      mask="time"
                      dense
                      outlined
                      @focus="onOpenDailyStartTimePopUp"
                    >
                      <template #append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDailyStartTimeRef"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-time v-model="formValues.startDaily" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6 q-pa-sm">
                    <p class="text-bold">{{ t('daily_end_time') }}</p>
                    <q-input
                      ref="endDailyField"
                      v-model="formValues.endDaily"
                      lazy-rules
                      :rules="endDailyRules"
                      mask="time"
                      dense
                      outlined
                      @focus="onOpenDailyEndTimePopUp"
                    >
                      <template #append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDailyEndTimeRef"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-time v-model="formValues.endDaily" mask="HH:mm" format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-form>

      <div class="flex justify-end">
        <q-btn
          no-caps
          class="q-px-lg"
          color="negative"
          :label="t('save')"
          :loading="isSubmitting"
          :class="hasPermission('edit-policy') == false ? 'hidden' : ''"
          type="submit"
          @click="onSubmit"
        />
      </div>
    </div>
  </pms-sections>
</template>

<script lang="ts">
import { ref, watchEffect } from 'vue';
import { usePoliciesQuery } from './api/usePoliciesQuery';
import { useUpdatePoliciesMutation } from './api/useUpdatePoliciesMutation';
import { useI18n } from '~/composable/useI18n';
import type { QInput, ValidationRule } from 'quasar';
import { useNotify } from '~/composable/useNotify';
import pmsSections from '~/components/globals/pms-sections.vue';
import { useAuth } from '~/composable/useAuth';

export default {
  components: { pmsSections },
  setup() {
    const { t } = useI18n();
    const { hasPermission } = useAuth();
    const { mutate, isLoading: isSubmitting } = useUpdatePoliciesMutation();

    interface IPoliciesMutationVariables {
      countrySn: number;
      currency: string;
      endDaily: string;
      endOvernight: string;
      hotelSn: number;
      roundUpHour: number;
      policySn: number;
      startDaily: string;
      startOvernight: string;
    }

    const formValues = ref<IPoliciesMutationVariables>({
      countrySn: 0,
      currency: '',
      endDaily: '',
      endOvernight: '',
      hotelSn: 0,
      roundUpHour: 0,
      policySn: 0,
      startDaily: '',
      startOvernight: '',
    });

    let { data, isLoading } = usePoliciesQuery();
    const { notifySaveSuccess } = useNotify();
    const updatePolicyFormRef = ref<HTMLFormElement>();

    const qOvernightStartTimeRef = ref<any>(null);
    const onOpenOvernightStartTimePopUp = () => {
      qOvernightStartTimeRef?.value.show();
    };

    const qOvernightEndTimeRef = ref<any>(null);
    const onOpenOvernightEndTimePopUp = () => {
      qOvernightEndTimeRef?.value.show();
    };

    const qDailyStartTimeRef = ref<any>(null);
    const onOpenDailyStartTimePopUp = () => {
      qDailyStartTimeRef?.value.show();
    };

    const qDailyEndTimeRef = ref<any>(null);
    const onOpenDailyEndTimePopUp = () => {
      qDailyEndTimeRef?.value.show();
    };

    watchEffect(() => {
      if (data.value) {
        formValues.value = {
          countrySn: data.value?.countrySn,
          currency: data.value?.currency,
          endDaily: data.value?.endDaily,
          endOvernight: data.value?.endOvernight,
          hotelSn: data.value?.hotelSn,
          roundUpHour: data.value?.roundUpHour,
          policySn: data.value?.sn,
          startDaily: data.value?.startDaily,
          startOvernight: data.value?.startOvernight,
        };
      }
    });

    const startDailyField = ref<QInput | null>(null);
    const startDailyRules: ValidationRule<string>[] = [
      (value) => !!value || t('this_field_is_required'),
    ];

    const endDailyField = ref<QInput | null>(null);
    const endDailyRules: ValidationRule<string>[] = [
      (value) => !!value || t('this_field_is_required'),
    ];

    const startOvernightField = ref<QInput | null>(null);
    const startOvernightRules: ValidationRule<string>[] = [
      (value) => !!value || t('this_field_is_required'),
    ];

    const endOvernightField = ref<QInput | null>(null);
    const endOvernightRules: ValidationRule<string>[] = [
      (value) => !!value || t('this_field_is_required'),
    ];

    const onSubmit = () => {
      updatePolicyFormRef.value?.validate().then((success: boolean) => {
        if (
          success &&
          Number(formValues.value.roundUpHour) > 1 &&
          Number(formValues.value.roundUpHour) < 59
        ) {
          mutate(formValues.value, {
            onSuccess: () => {
              notifySaveSuccess();
            },
          });
        } else {
          return false;
        }
      });
    };

    return {
      group: ref(null),
      t,
      isLoading,
      currencyOptions: [{ label: 'VND', value: 1 }],
      formValues,

      startDailyField,
      startDailyRules,
      endDailyField,
      endDailyRules,
      startOvernightField,
      startOvernightRules,
      endOvernightField,
      endOvernightRules,

      onSubmit,
      updatePolicyFormRef,
      isSubmitting,
      hasPermission,

      qOvernightStartTimeRef,
      onOpenOvernightStartTimePopUp,
      qOvernightEndTimeRef,
      onOpenOvernightEndTimePopUp,
      qDailyStartTimeRef,
      onOpenDailyStartTimePopUp,
      qDailyEndTimeRef,
      onOpenDailyEndTimePopUp,
    };
  },
};
</script>
