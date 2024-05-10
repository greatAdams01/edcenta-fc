import { gql } from '@apollo/client'

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID) {
    deleteUser(id: $deleteUserId) {
      _id
    }
  }
`

export const EDIT_USER = gql`
  mutation EditUserInfo(
    $firstName: String
    $lastName: String
    $email: String
    $phone: String
    $address: String
    $sex: String
    $dob: String
    $city: String
    $state: String
    $bankName: String
    $bank: String
    $acctNumber: String
    $bankCode: String
    $id: ID
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
      state: $state
      bankName: $bankName
      bank: $bank
      acctNumber: $acctNumber
      bankCode: $bankCode
      _id: $id
    ) {
      _id
    }
  }
`

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($deleteStudentId: ID!) {
    deleteStudent(id: $deleteStudentId) {
      _id
    }
  }
`
export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($updateStudentId: ID!, $input: StudentInput!) {
    updateStudent(id: $updateStudentId, input: $input) {
      _id
    }
  }
`

export const UPDATE_SUBJECT = gql`
  mutation UpdateSubject(
    $id: ID!
    $name: String
    $description: String
    $slug: String
    $tags: [String!]
  ) {
    updateSubject(
      id: $id
      name: $name
      description: $description
      slug: $slug
      tags: $tags
    ) {
      _id
      name
      description
      slug
      tags
    }
  }
`
export const DELETE_SUBJECT = gql`
  mutation DeleteSubject($id: ID!) {
    deleteSubject(id: $id)
  }
`
export const DELETE_TOPIC = gql`
  mutation DeleteTopic($id: ID!) {
    deleteTopic(id: $id)
  }
`

export const CREATE_SUBJECT = gql`
  mutation CreateSubject(
    $name: String!
    $description: String!
    $schoolGrade: String!
  ) {
    createSubject(
      name: $name
      description: $description
      schoolGrade: $schoolGrade
    ) {
      _id
      name
      description
      schoolGrade
    }
  }
`
