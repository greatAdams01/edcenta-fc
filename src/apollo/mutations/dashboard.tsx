import { gql } from '@apollo/client';

export const MUTATE_USER = gql`
mutation EditUserInfo($firstName: String, $lastName: String, $email: String, $phone: String, $address: String, $sex: String, $dob: String, $city: String,  $bName: String, $bankName: String, $bank: String, $acctNumber: String, $bankCode: String) {
  editUserInfo(firstName: $firstName, lastName: $lastName, email: $email, phone: $phone, address: $address, sex: $sex, dob: $dob, city: $city, bName: $bName, bankName: $bankName, bank: $bank, acctNumber: $acctNumber, bankCode: $bankCode) {
    _id
  }
}
`