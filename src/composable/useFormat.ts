export const formatMoney = (val?: number | string) => {
  if (!val || isNaN(Number(val))) {
    return '0';
  }
  return new Intl.NumberFormat('ja-JP', { style: 'decimal', currency: 'VND' }).format(Number(val));
};
export const changeMoney = (
  e: Event,
  modelValue: string | number,
  emitValue: (val: string) => void,
) => {
  const value = (e.target as HTMLInputElement).value;
  if (isNaN(Number(value))) {
    return;
  } else if (value === '') {
    emitValue('0');
  }
  emitValue(value);
};
export const formatIndexTable = (page: number, index: number) => {
  if (Number(page) > 1) {
    if (Number(index) + 1 < 10) {
      return Number(page) - 1 + '' + (Number(index) + 1);
    } else {
      return Number(page) + '0';
    }
  }
  return index + 1;
};
