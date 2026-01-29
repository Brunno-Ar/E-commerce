import { AddressType } from '../enums/address-type.enum';

export interface AddressDTO {
  id?: number;
  type: AddressType;
  recipient: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  referencePoint?: string;
  isDefault: boolean;
}