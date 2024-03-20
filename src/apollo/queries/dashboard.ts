import { gql } from '@apollo/client';

export const SchoolGrades = gql`
query SchoolGrades {
  schoolGrades {
    _id
    stage
    ages
    year
    subject {
      _id
      name
      worksheet {
        _id
        title
        levelId
        questions {
          _id
          title
        }
      }
      topics {
        _id
        name
        slug
        levelId
      }
    }
  }
}
`

export const STAGES = gql`
query SchoolGrades {
  schoolGrades {
    _id
    stage
    year
  }
}
`

export const USER = gql`
query User {
  user {
    _id
    firstName
    lastName
    email
    phone
    address
    city
    accountType
    updatedAt
    bName
    bankName
    acctNumber
    occupation
  }
}
`
