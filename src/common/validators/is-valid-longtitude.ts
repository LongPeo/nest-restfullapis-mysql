import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsValidLongitude implements ValidatorConstraintInterface {
  validate(lon: number) {
    if (!isNaN(lon) && lon >= -180 && lon <= 180) {
      return true;
    }

    return false;
  }

  defaultMessage() {
    return 'Kinh độ không hợp lệ';
  }
}
