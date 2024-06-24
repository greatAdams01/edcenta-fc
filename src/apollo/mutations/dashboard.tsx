import { gql } from '@apollo/client'

export const MUTATE_USER = gql`
  mutation EditUserInfo(
    $firstName: String
    $lastName: String
    $email: String
    $phone: String
    $address: String
    $sex: String
    $dob: String
    $city: String
    $bName: String
    $bankName: String
    $bank: String
    $acctNumber: String
    $bankCode: String
  ) {
    editUserInfo(
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      address: $address
      sex: $sex
      dob: $dob
      city: $city
      bName: $bName
      bankName: $bankName
      bank: $bank
      acctNumber: $acctNumber
      bankCode: $bankCode
    ) {
      _id
    }
  }
`

export const CHANGE_PASSWORD = gql`
  mutation UpdatePassword($newPassword: String!, $oldPassword: String!) {
    updatePassword(newPassword: $newPassword, oldPassword: $oldPassword)
  }
`

export const CREATE_STUDENT = gql`
  mutation CreateStudent($input: StudentInput!) {
    createStudent(input: $input) {
      _id
    }
  }
`

export const ASSIGN_WORKSHEET = gql`
  mutation AssingStudentsWorksheet($studentIds: [ID!]!, $worksheetId: ID!) {
    assingStudentsWorksheet(studentIds: $studentIds, worksheetId: $worksheetId)
  }
`
export const UPDATE_ASSIGNMENT = gql`
  mutation updateAssignment($id: ID!, $input: AssignmentInput!) {
    updateAssignment(id: $id, input: $input) {
      _id
      worksheetId {
        _id
        title
      }
      answers {
        _id
        questionId
        answer
        isCorrect
      }
      createdAt
      score
      status
      attemptedAt
      updatedAt
    }
  }
`
