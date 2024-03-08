import { gql } from '@apollo/client';

export const USER = gql`
query Query {
  user {
    firstName
    lastName
    email
    phone
    address
    city
    state
    dob
    sex
    isVerified
    ninverified
    isActive
    accountType
    createdAt
    lastLoggedIn
    bName
    bankName
    bank
    acctNumber
    bankCode
    occupation
  }
}`

export const USER_FULLNAME = gql`
query Query {
  user {
    firstName
    lastName
  }
}`