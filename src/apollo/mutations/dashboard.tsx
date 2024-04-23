import { gql } from '@apollo/client';

export const MUTATE_USER = gql`
mutation EditUserInfo($firstName: String, $lastName: String, $email: String, $phone: String, $address: String, $sex: String, $dob: String, $city: String,  $bName: String, $bankName: String, $bank: String, $acctNumber: String, $bankCode: String) {
  editUserInfo(firstName: $firstName, lastName: $lastName, email: $email, phone: $phone, address: $address, sex: $sex, dob: $dob, city: $city, bName: $bName, bankName: $bankName, bank: $bank, acctNumber: $acctNumber, bankCode: $bankCode) {
    _id
  }
}
`

export const CHANGE_PASSWORD = gql`
mutation UpdatePassword($newPassword: String!, $oldPassword: String!) {
  updatePassword(newPassword: $newPassword, oldPassword: $oldPassword)
}`

export const CREATE_STUDENT = gql`
mutation CreateStudent($input: StudentInput!) {
  createStudent(input: $input) {
    _id
  }
}`

export const ASSIGN_WORKSHEET = gql`
mutation AssignWorksheets($studentIds: [ID!]!, $worksheetIds: [ID!]!) {
  assingStudentsWorksheet(studentIds: $studentIds, worksheetIds: $worksheetIds) 
}
`