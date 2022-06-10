import type { QInput, ValidationRule } from 'quasar';
import { ref } from 'vue';
import { useI18n } from '~/composable/useI18n';

export const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validatePhone = (phone: string) => {
  if (phone == null || phone.length == 0) {
    return true;
  } else if (phone.length >= 8 && phone.length <= 12) {
    return true;
  }
  return false;
};

export const validateAcceptNullOrLength1ToLength100 = (website: string) => {
  if (website == null || website.length == 0) {
    return true;
  } else if (website.length >= 1 && website.length <= 100) {
    return true;
  }
  return false;
};
const daysInMonth = function (m: number, y: number) {
  switch (m) {
    case 2:
      return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
};
export const isValidDate = function (str: string) {
  const result = str.split(' ');
  const formatDateUI = result[0]?.split('-');
  if (formatDateUI.length > 1) {
    return true;
  }
  if (!str || str.length !== 16) {
    return false;
  }
  const result1 = result[0]?.split('/');
  const day = Number(result1[2]);
  const month = Number(result1[1]);
  const year = Number(result1[0]);
  return month >= 0 && month < 12 && day > 0 && day <= daysInMonth(month, year);
};
export const isStartSmallerThanEnd = (checkIn: string, checkOut: string) => {
  if (checkIn && checkOut) {
    const start = checkIn.split(' ', 2);
    const end = checkOut.split(' ', 2);
    const startDate = start[0].slice(0, 2);
    const startTime = start[1].slice(0, 2);
    const endDate = end[0].slice(0, 2);
    const endTime = end[1].slice(0, 2);
    if (Number(startDate) === Number(endDate) && Number(startTime) >= Number(endTime)) {
      return false;
    }
  }
  return true;
};
export const isMinStartSmallerThanEnd = (checkIn: string, checkOut: string) => {
  if (checkIn && checkOut) {
    const start = checkIn.split(' ', 2);
    const end = checkOut.split(' ', 2);
    const [startTime, startMin] = start[1].split(':');
    const [endTime, endMin] = end[1].split(':');
    const [startDate, startMonth, startYear] = start[0].split('/');
    const [endDate, endMonth, endYear] = end[0].split('/');
    if (Number(startYear) < Number(endYear)) {
      return true;
    }
    if (Number(startMonth) < Number(endMonth)) {
      return true;
    }
    if (Number(startDate) < Number(endDate)) {
      return true;
    }
    if (Number(endTime) > Number(startTime)) {
      return true;
    } else if (Number(startTime) === Number(endTime) && Number(startMin) < Number(endMin)) {
      return true;
    }
  }
  return false;
};

// RULES FORM
export const useRule = () => {
  const { t } = useI18n();

  const websiteField = ref<QInput | null>(null);
  const websiteRules: ValidationRule<string>[] = [
    (value) =>
      validateAcceptNullOrLength1ToLength100(value) || t('the_length_is_from_1_to_100_characters'),
  ];

  ////////////////////////////////////////////////

  const isRequiredRules: ValidationRule<string>[] = [
    (value) => !!value || t('this_field_is_required'),
  ];

  const isNotRequiredRules: ValidationRule<string>[] = [
    (value) => value == null || value.length == 0 || '',
  ];

  const isEmailRules: ValidationRule<string>[] = [
    (value) => validateEmail(value) || t('invalid_email_format'),
  ];

  const isPhoneRules: ValidationRule<string>[] = [
    (value) => validatePhone(value) || t('the_length_is_from_8_to_12_characters'),
  ];

  const isLengthFrom1To50Rules: ValidationRule<string>[] = [
    (value) => value.length <= 50 || t('the_length_is_from_1_to_50_characters'),
  ];

  const isLengthFrom1To100Rules: ValidationRule<string>[] = [
    (value) => value.length <= 100 || t('the_length_is_from_1_to_100_characters'),
  ];

  const isLengthFrom0To200Rules: ValidationRule<string>[] = [
    (value) => !value || value.length <= 200 || t('the_length_is_from_0_to_200_characters'),
  ];

  const isLengthFrom0To50Rules: ValidationRule<string>[] = [
    (value) => value.length <= 50 || t('the_length_is_from_0_to_50_characters'),
  ];

  const isLengthFrom0To100Rules: ValidationRule<string>[] = [
    (value) => value.length <= 100 || t('the_length_is_from_0_to_100_characters'),
  ];

  const isLengthFrom1To20Rules: ValidationRule<string>[] = [
    (value) =>
      (value.length >= 1 && value.length <= 20) || t('the_length_is_from_1_to_20_characters'),
  ];

  const isLengthFrom1To200Rules: ValidationRule<string>[] = [
    (value) => value.length <= 200 || t('the_length_is_from_1_to_200_characters'),
  ];

  const isLengthFrom8To16Rules: ValidationRule<string>[] = [
    (value) =>
      (value.length >= 8 && value.length <= 16) || t('the_length_is_from_8_to_16_characters'),
  ];

  const isLengthFrom9To15Rules: ValidationRule<string>[] = [
    (value) =>
      (value.length >= 9 && value.length <= 15) || t('the_length_is_from_9_to_15_characters'),
  ];

  const isLengthFrom1To64Rules: ValidationRule<string>[] = [
    (value) => value.length <= 64 || t('the_length_is_from_1_to_64_characters'),
  ];

  const isLengthFrom1To10Rules: ValidationRule<string>[] = [
    (value) => value.length <= 10 || t('the_length_is_from_1_to_10_characters'),
  ];

  const isValueMoneyRules: ValidationRule<number>[] = [
    (value) => (value >= 0 && value <= 100000000000) || t('the_value_is_from_1_to_100_000_000_000'),
  ];

  return {
    websiteField,
    websiteRules,

    ///////////////////
    isRequiredRules,
    isNotRequiredRules,
    isEmailRules,
    isPhoneRules,
    isLengthFrom1To50Rules,
    isLengthFrom1To100Rules,
    isLengthFrom0To200Rules,
    isLengthFrom0To50Rules,
    isLengthFrom0To100Rules,
    isLengthFrom1To20Rules,
    isLengthFrom1To200Rules,
    isLengthFrom8To16Rules,
    isLengthFrom9To15Rules,
    isLengthFrom1To64Rules,
    isLengthFrom1To10Rules,
    isValueMoneyRules,
  };
};
