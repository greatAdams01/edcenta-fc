import { gql } from '@apollo/client'

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

export const STUDENTS = gql`
  query Students($page: Int, $limit: Int, $filter: String) {
    students(page: $page, limit: $limit, filter: $filter) {
      data {
        _id
        age
        createdAt
        creatorId
        email
        lastLoggedIn
        name
        username
        isActive
        grade {
          _id
          year
          stage
        }
      }
      totalPage
      totalRecord
    }
  }
`

export const SUBJECTS = gql`
  query Subjects($page: Int, $limit: Int, $filter: String) {
    subjects(page: $page, limit: $limit, filter: $filter) {
      _id
      name
      description
      slug
      tags
      schoolGrade
    }
  }
`

export const GET_SUBJECT_TOPICS = gql`
  query GetSubjectTopics($subjectId: ID!) {
    getSubjectTopics(subjectId: $subjectId) {
      _id
      name
      description
      slug
      levelId
      worksheet {
        _id
        title
        body
        difficulty
      }
      type
    }
  }
`
