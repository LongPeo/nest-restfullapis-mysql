import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsValidLatitude implements ValidatorConstraintInterface {
  validate(lat: number) {
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
      return true;
    }

    return false;
  }

  defaultMessage() {
    return 'Vĩ độ không hợp lệ';
  }
}
