import { gql } from "@apollo/client";

export const USERS = gql`
query Users($page: Int, $limit: Int, $filter: String) {
  users(page: $page, limit: $limit, filter: $filter) {
    data {
      _id
    accountType
    acctNumber
    address
    bName
    bank
    bankCode
    bankName
    city
    createdAt
    dob
    email
    firstName
    isActive
    isVerified
    lastLoggedIn
    lastName
    ninverified
    occupation
    otp
    phone
    sex
    state
    updatedAt
    }
    totalPage
    totalRecord
  }
}
`