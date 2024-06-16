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
  query Topics($page: Int, $limit: Int, $filter: String) {
    topics(page: $page, limit: $limit, filter: $filter) {
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
  query Worksheets($page: Int, $limit: Int, $filter: String, $topicId: String) {
    worksheets(page: $page, limit: $limit, filter: $filter, topicId: $topicId) {
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

export const WORKSHEET_BY_ID = gql`
  query Worksheet($id: ID!) {
    worksheet(id: $id) {
      _id
      title
      body {
        text
        img
      }
      difficulty
      levelId
      subjectId
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


export const GET_QUESTIONS = gql`
  query Questions(
    $page: Int
    $limit: Int
    $filter: String
    $levelId: String
    $subjectId: String
    $worksheetId: ID
    ) {
    questions(
      page: $page
      limit: $limit
      filter: $filter
      levelId: $levelId
      subjectId: $subjectId
      worksheetId: $worksheetId
    ) {
      data {
        _id
        body {
          _id
          img
          text
          __typename
        }
        createdAt
        explanation
        isObjective
        title
        updatedAt
        worksheetId
        __typename
        options {
          _id
          isCorrect
          option
        }
      }
    }
  }
`
export const GET_QUESTION = gql`
  query Question(
    $id: ID!
    ) {
    question(
      id: $id
    ) {
        _id
        body {
          _id
          img
          text
          __typename
        }
        createdAt
        explanation
        isObjective
        title
        updatedAt
        worksheetId
        __typename
        options {
          _id
          isCorrect
          option
        }
    }
  }
`
export const GET_PLANS = gql`
  query GetPlans{
    getPlans{
      _id
      planCode
      planPrice
      priceOfFreeTrial
      pricePerCourse
      subTitle
      title
      type
      __typename
      allowedCourseList {
        _id
        createdAt
        description
        name
        slug
        tags
      }
    }
  }
`