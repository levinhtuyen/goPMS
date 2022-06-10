import { onClickOutside } from '@vueuse/core';
import type { QInput } from 'quasar';
import { ref, nextTick } from 'vue';

export const useEditable = (args?: { onFinishEdit: () => void }) => {
  const isEditMode = ref(false);
  const inputElementRef = ref<QInput | null>(null);

  const startEdit = async () => {
    isEditMode.value = true;
    await nextTick();
    inputElementRef.value?.focus();
  };

  const finishEdit = () => {
    isEditMode.value = false;
    args?.onFinishEdit();
  };

  onClickOutside(inputElementRef, () => finishEdit());

  return { inputElementRef, isEditMode, startEdit, finishEdit };
};
