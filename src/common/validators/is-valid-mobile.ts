import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsValidMobile implements ValidatorConstraintInterface {
  validate(text: string) {
    const mobile = text.replace(/\+84/gi, '0');
    const fisrt = mobile.substring(0, 1);
    if (fisrt !== '0' || mobile.length !== 10) {
      return false;
    }

    const viettel = [
      '086',
      '096',
      '097',
      '098',
      '032',
      '033',
      '034',
      '035',
      '036',
      '037',
      '038',
      '039',
    ];
    const mobiphone = [
      '090',
      '093',
      '012',
      '089',
      '070',
      '076',
      '077',
      '078',
      '079',
    ];
    const vinaphone = ['091', '094', '083', '084', '085', '081', '082', '080'];
    const vietnammobile = ['092', '056', '058'];
    const gmobile = ['099', '059'];

    return [
      ...viettel,
      ...mobiphone,
      ...vinaphone,
      ...vietnammobile,
      ...gmobile,
    ].includes(mobile.substring(0, 3));
  }

  defaultMessage() {
    return 'Số điện thoại không hợp lệ';
  }
}
