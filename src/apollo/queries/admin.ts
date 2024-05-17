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
      data {
        _id
        name
        slug
        tags
        description
        createdAt
      }
      totalPage
      totalRecord
    }
  }
`

export const TOPICS = gql`
  query Topics(
    $page: Int
    $limit: Int
    $filter: String
  ) {
    topics(
      page: $page
      limit: $limit
      filter: $filter
    ) {
      data {
        _id
        name
        description
        slug
        levelId
      }
      totalPage
      totalRecord
    }
  }
`
export const WORKSHEETS = gql`
  query Worksheets(
    $page: Int
    $limit: Int
    $filter: String
  ) {
    worksheets(
      page: $page
      limit: $limit
      filter: $filter
    ) {
      data {
        _id
        title
        body {
          text
        }
        levelId
        topicId
        subjectId
        difficulty
      }
      totalRecord
      totalPage
    }
  }
`

export const SCHOOL_GRADES = gql`
  query SchoolGrades(
    $page: Int
    $limit: Int
    $filter: String
    $searchParams: String
  ) {
    schoolGrades(
      page: $page
      limit: $limit
      filter: $filter
      searchParams: $searchParams
    ) {
      _id
      stage
      ages
      year
    }
  }
`
