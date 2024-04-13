import { gql } from "@apollo/client";

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID) {
    deleteUser(id: $deleteUserId) {
      _id
    }
  }
`

export const EDIT_USER = gql`
  mutation EditUserInfo($firstName: String, $lastName: String, $email: String, $phone: String, $address: String, $sex: String, $dob: String, $city: String, $state: String, $bankName: String, $bank: String, $acctNumber: String, $bankCode: String, $id: ID) {
  editUserInfo(firstName: $firstName, lastName: $lastName, email: $email, phone: $phone, address: $address, sex: $sex, dob: $dob, city: $city, state: $state, bankName: $bankName, bank: $bank, acctNumber: $acctNumber, bankCode: $bankCode, _id: $id) {
    _id
  }
}
`