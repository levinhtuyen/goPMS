<template>
  <pms-sections>
    <template #header>
      <div class="text-h6 text-weight-bold q-mb-md">{{ t('cash_handover') }}</div>
      <q-separator inset />
    </template>

    <div class="relative-position">
      <div class="row">
        <q-card flat>
          <q-card-section :horizontal="widthScreen > 768">
            <q-inner-loading
              :showing="isFetching"
              label="Please"
              label-class="text-teal"
              label-style="font-size:1.1em"
            >
              <div lass="full-width" full-height class="q-mt-md row justify-center">
                <q-spinner color="negative" :thickness="2" size="2em" />
              </div>
            </q-inner-loading>

            <q-card-section class="row col-6">
              <div class="col-12 col-md-12 bg-grey-2">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <div class="row justify-between">
                        <div class="q-md-2">
                          <div>1. {{ t('starting_balance') }}</div>
                        </div>
                        <div>{{ formatMoney(formValues.startingBalance) }} VND</div>
                      </div>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <div class="row justify-between">
                        <div class="q-md-2">
                          <div>2. {{ t('total_cash_receipts') }}</div>
                        </div>
                        <div>{{ formatMoney(formValues.totalCashReceipts) }} VND</div>
                      </div>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <div class="row justify-between">
                        <div class="q-md-2">
                          <div>3. {{ t('total_cash_payments') }}</div>
                        </div>
                        <div>{{ formatMoney(formValues.totalCashPayments) }} VND</div>
                      </div>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <div class="row justify-between text-bold">
                        <div class="q-md-2">
                          <div>4. {{ t('end_shift_balance') }} (1+2-3)</div>
                        </div>
                        <div>{{ formatMoney(formValues.endBalance) }} VND</div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-12 bg-grey-2">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <div class="row justify-between">
                        <div class="q-md-2">
                          <div>5. {{ t('cash_difference') }} (6-4)</div>
                        </div>
                        <div
                          :class="formData.cashInSafe - formValues.endBalance < 0 ? 'text-red' : ''"
                        >
                          {{ formatMoney(formData.cashInSafe - formValues.endBalance) }} VND
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-12 bg-deep-orange-1 q-py-md">
                <div class="row justify-between q-px-md">
                  <div class="q-md-2">
                    <div class="text-bold">6. {{ t('cash_in_safe') }}*</div>
                  </div>
                  <div>
                    <q-field
                      v-model.number="formData.cashInSafe"
                      outlined
                      dense
                      class="col"
                      suffix="VND"
                      debounce="500"
                      :rules="[
                        (val) => val >= 1 || t('the_value_is_from_1_to_100_000_000_000'),
                        (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
                      ]"
                      type="number"
                      @blur="inputActive.cashInSafe = false"
                      @focus="inputActive.cashInSafe = true"
                      @update:model-value="handleCashInSafeAmount"
                    >
                      <template #control="{ id, modelValue, emitValue }">
                        <input
                          :id="id"
                          class="q-field__input text-right"
                          style="width: 100px"
                          :value="inputActive.cashInSafe ? modelValue : formatMoney(modelValue)"
                          @change="(e) => changeMoney(e, modelValue, emitValue)"
                        />
                      </template>
                    </q-field>
                  </div>
                </div>

                <div class="row justify-between q-px-md">
                  <div class="q-md-2">
                    <div class="text-bold">7. {{ t('hand_to_next_shift') }}* (6-8)</div>
                  </div>
                  <div>
                    <q-field
                      v-model.number="formData.cashForTheNextShift"
                      outlined
                      dense
                      class="col"
                      suffix="VND"
                      debounce="500"
                      :rules="[
                        (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
                        (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
                      ]"
                      type="number"
                      @blur="inputActive.cashForTheNextShift = false"
                      @focus="inputActive.cashForTheNextShift = true"
                      @update:model-value="handleCashForTheNextShiftAmount"
                    >
                      <template #control="{ id, modelValue, emitValue }">
                        <input
                          :id="id"
                          class="q-field__input text-right"
                          style="width: 100px"
                          :value="
                            inputActive.cashForTheNextShift ? modelValue : formatMoney(modelValue)
                          "
                          @change="(e) => changeMoney(e, modelValue, emitValue)"
                        />
                      </template>
                    </q-field>
                  </div>
                </div>

                <div class="row justify-between q-px-md">
                  <div class="q-md-2">
                    <div class="text-bold">8. {{ t('cash_withdrawals') }} (6-7)</div>
                  </div>
                  <div>
                    <q-field
                      v-model.number="formData.cashWithdrawals"
                      outlined
                      dense
                      class="col"
                      suffix="VND"
                      debounce="500"
                      :rules="[
                        (val) => val >= 0 || t('the_value_is_from_1_to_100_000_000_000'),
                        (val) => val <= 100000000000 || t('the_value_is_from_1_to_100_000_000_000'),
                      ]"
                      type="number"
                      @blur="inputActive.cashWithdrawals = false"
                      @focus="inputActive.cashWithdrawals = true"
                      @update:model-value="handleCashWithdrawalsAmount"
                    >
                      <template #control="{ id, modelValue, emitValue }">
                        <input
                          :id="id"
                          class="q-field__input text-right"
                          style="width: 100px"
                          :value="
                            inputActive.cashWithdrawals ? modelValue : formatMoney(modelValue)
                          "
                          @change="(e) => changeMoney(e, modelValue, emitValue)"
                        />
                      </template>
                    </q-field>
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator vertical />

            <q-card-section
              class="row col-6 q-px-md"
              :style="widthScreen > 768 ? 'height: 100px' : ''"
            >
              <div class="col-12 col-md-4">
                <div class="text-weight-bold">{{ t('shift_started_at') }}:</div>
                <q-input v-model="formValues.startedAt" disable outlined dense class="bg-grey-5">
                  <template #prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formValues.startedAt" mask="YYYY-MM-DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-8" :class="widthScreen > 768 ? ' q-pl-sm' : ''">
                <div class="text-weight-bold">{{ t('cash_receiver') }}*</div>
                <q-input
                  v-model="formData.cashReceiver"
                  :placeholder="t('input_receiver')"
                  lazy-rules
                  dense
                  outlined
                  :error="!isValidCashReceiverRules && ui.isSubbmitPopup"
                >
                  <template #error>
                    <p v-if="!formData.cashReceiver && ui.isSubbmitPopup">
                      {{ t('this_field_is_required') }}
                    </p>
                    <p v-else-if="formData.cashReceiver.length > 20 && ui.isSubbmitPopup">
                      {{ t('the_length_is_from_1_to_20_characters') }}
                    </p>
                  </template></q-input
                >
              </div>

              <div class="col-12 col-md-12">
                <div class="text-weight-bold">{{ t('note') }}</div>
                <q-input
                  v-model="formData.note"
                  :placeholder="t('input_note')"
                  lazy-rules
                  dense
                  outlined
                  rows="4"
                  type="textarea"
                  class="custome-textarea"
                  :error="!isValidNoteRules"
                >
                  <template #error>
                    <p>
                      {{ t('the_length_is_from_1_to_200_characters') }}
                    </p>
                  </template></q-input
                >
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-12 row justify-end q-pa-md">
        <q-btn
          class="q-px-lg"
          :label="t('handover')"
          :loading="isSubmitting"
          type="submit"
          color="negative"
          no-caps
          @click="openHandoverModal"
        />
      </div>
    </div>

    <!-- POPUP CREATE PRODUCT -->
    <q-dialog v-model="ui.isOpenHandoverModal">
      <q-card class="q-pa-lg">
        <div align="center">
          <p class="text-bold">{{ t('please_enter_a_password_to_confirm_handover') }}</p>
        </div>

        <div class="q-py-sm">
          <q-input
            ref="passwordField"
            v-model="formData.password"
            outlined
            :type="ui.isPwd ? 'password' : 'text'"
            :placeholder="t('input_password')"
            dense
            :error="!isPasswordRules && ui.isSubmitHandover"
            autocomplete="new-password"
          >
            <template #append>
              <q-icon
                :name="ui.isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="ui.isPwd = !ui.isPwd"
              />
            </template>
            <template #error>
              <p v-if="!formData.password && ui.isSubmitHandover" class="text-left">
                {{ t('this_field_is_required') }}
              </p>
              <p
                v-else-if="
                  ui.isSubmitHandover &&
                  (formData.password.length < 8 || formData.password.length > 16)
                "
                class="text-left"
              >
                {{ t('the_length_is_from_8_to_16_characters') }}
              </p>
            </template>
          </q-input>
        </div>

        <div align="center" class="q-gutter-sm q-py-md">
          <q-btn
            v-close-popup
            :label="t('cancel')"
            dense
            outline
            no-caps
            color="grey-8"
            style="padding: 6px 20px"
          />
          <q-btn :label="t('confirm_handover')" color="negative" no-caps @click="onSubmit" />
        </div>
      </q-card>
    </q-dialog>
    <!-- END POPUP CREATE PRODUCT -->
  </pms-sections>
</template>

<script lang="ts">
import { onMounted, reactive, ref, watchEffect, computed } from 'vue';
import { useShiftHandoverQuery } from './apis/useShiftHandoverQuery';
import { useUpdateShiftHandoverMutation } from './apis/useUpdateShiftHandoverMutation';
import { useI18n } from '~/composable/useI18n';
import type { QInput, ValidationRule } from 'quasar';
import { useNotify } from '~/composable/useNotify';
import { formatMoney, changeMoney } from '~/composable/useFormat';
import { FORMAT_DATE_TIME_UI } from '~/constants';
import { newDateStamp } from '~/composable/useCreateDate';

export default {
  setup() {
    const { t } = useI18n();

    let { data, isFetching } = useShiftHandoverQuery();
    const { notifySaveSuccess } = useNotify();
    const { mutate, isLoading: isSubmitting } = useUpdateShiftHandoverMutation();

    interface IShiftHandoverVariables {
      startingBalance: number;
      totalCashReceipts: number;
      totalCashPayments: number;
      endBalance: number;
      startedAt: string;
    }

    interface IShiftHandoverMutationVariables {
      cashInSafe: number;
      cashForTheNextShift: number;
      cashWithdrawals: number;
      cashReceiver: string;
      note: string;
      password: string;
    }

    const formValues = ref<IShiftHandoverVariables>({
      startingBalance: 0,
      totalCashReceipts: 0,
      totalCashPayments: 0,
      endBalance: 0,
      startedAt: '',
    });

    const formData = ref<IShiftHandoverMutationVariables>({
      cashInSafe: 0,
      cashForTheNextShift: 0,
      cashWithdrawals: 0,
      cashReceiver: '',
      note: '',
      password: '',
    });

    const widthScreen = ref(0);
    onMounted(() => {
      widthScreen.value = window.innerWidth;
    });

    watchEffect(() => {
      if (data.value) {
        formValues.value = {
          startingBalance: data.value?.startingBalance,
          totalCashReceipts: data.value?.totalCashReceipts,
          totalCashPayments: data.value?.totalCashPayments,
          endBalance: data.value?.endBalance,
          startedAt: newDateStamp(data.value?.startedAt as any, FORMAT_DATE_TIME_UI),
        };
        formData.value = {
          cashInSafe: data.value?.endBalance,
          cashForTheNextShift: data.value?.endBalance,
          cashWithdrawals: 0,
          cashReceiver: '',
          note: '',
          password: '',
        };
      }
    });

    const isValidCashReceiverRules = computed(
      () => !!formData.value?.cashReceiver && formData.value?.cashReceiver.length <= 20,
    );
    const isValidNoteRules = computed(() => formData.value?.note.length <= 200);

    const handleCashInSafeAmount = () => {
      if (formData.value.cashInSafe <= 0) {
        formData.value.cashInSafe = Number(data.value?.endBalance);
      } else {
        formData.value.cashForTheNextShift = formData.value.cashInSafe;
        formData.value.cashWithdrawals = 0;
      }
    };

    const handleCashForTheNextShiftAmount = () => {
      if (formData.value.cashForTheNextShift > formData.value.cashInSafe) {
        formData.value.cashForTheNextShift = formData.value.cashInSafe;
      } else if (formData.value.cashForTheNextShift < 0) {
        formData.value.cashForTheNextShift = formData.value.cashInSafe;
      }
      formData.value.cashWithdrawals =
        formData.value.cashInSafe - formData.value.cashForTheNextShift;
    };

    const handleCashWithdrawalsAmount = () => {
      if (formData.value.cashWithdrawals > formData.value.cashInSafe) {
        formData.value.cashWithdrawals = formData.value.cashInSafe;
      } else if (formData.value.cashWithdrawals < 0) {
        formData.value.cashWithdrawals = 0;
      }
      formData.value.cashForTheNextShift =
        formData.value.cashInSafe - formData.value.cashWithdrawals;
    };

    const inputActive = reactive({
      cashInSafe: false,
      cashForTheNextShift: false,
      cashWithdrawals: false,
    });

    const passwordField = ref<QInput | null>(null);
    const isPasswordRules = computed(
      () =>
        !!formData.value.password &&
        formData.value.password.length >= 8 &&
        formData.value.password.length <= 16,
    );

    const ui = reactive({
      isOpenHandoverModal: false,
      isPwd: true,
      isSubmitHandover: false,
      isSubbmitPopup: false,
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

    const openHandoverModal = () => {
      ui.isSubbmitPopup = true;
      if (isValidCashReceiverRules.value && isValidNoteRules.value) {
        ui.isOpenHandoverModal = true;
      }
    };

    const onSubmit = () => {
      ui.isSubmitHandover = true;
      if (!isPasswordRules.value) {
        ui.isOpenHandoverModal = true;
        return false;
      } else {
        ui.isOpenHandoverModal = false;
        mutate(formData.value, {
          onSuccess: () => {
            notifySaveSuccess();
            ui.isSubmitHandover = false;
            ui.isSubbmitPopup = false;
          },
        });
      }
    };

    return {
      t,
      isFetching,
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
      isSubmitting,
      widthScreen,

      ui,
      openHandoverModal,
      passwordField,
      isPasswordRules,
      formatMoney,
      changeMoney,
      inputActive,
      formData,

      handleCashInSafeAmount,
      handleCashForTheNextShiftAmount,
      handleCashWithdrawalsAmount,

      isValidCashReceiverRules,
      isValidNoteRules,
    };
  },
};
</script>

<style lang="scss" scoped>
.custome-textarea::v-deep(textarea) {
  resize: none;
}

.q-field--error {
  margin-bottom: 1em;
}

@media screen and (max-width: 600px) {
  .q-card__section--vert {
    padding: 0.5em 0;
  }
}
</style>
