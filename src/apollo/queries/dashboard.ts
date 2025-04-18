import { gql } from '@apollo/client'

export const FETCH_SCHOOL_GRADES = gql`
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
     data {
      _id
      stage
      ages
      year
      createdAt
      updatedAt
    }
      totalPage
      totalRecord
    }
  }
`

export const FETCH_LEARNING = gql`
  query FetchLearning {
    fetchLearning {
      _id
      year
      createdAt
      subjects {
        _id
        name
        topics
        worksheet
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
      isVerified
      isActive
      lastLoggedIn
    }
  }
`
export const TOPIC_QUERY = gql`
  query Topic($topicId: ID!) {
    topic(id: $topicId) {
      _id
      name
      description
      slug
      levelId
    }
  }
`

export const QUESTION_QUERY = gql`
  query SchoolGrades($questionId: ID!) {
    question(id: $questionId) {
      _id
      title
      body {
        _id
        text
        img
      }
      isObjective
      options {
        _id
        option
        isCorrect
      }
      explanation
      worksheetId
      createdAt
    }
  }
`

export const ASSIGNMENTS = gql`
  query Assignments($filter: String, $studentId: String, $worksheetId: String) {
    assignments(
      filter: $filter
      studentId: $studentId
      worksheetId: $worksheetId
    ) {
      data {
        _id
        worksheetId {
          _id
          title
          subjectId {
            name
            _id
          }
        }
        answers {
          _id
        }
        createdAt
        attemptedAt
        score
        status
      }
      totalPage
      totalRecord
    }
  }
`
export const QUESTIONS = gql`
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
        title
        body {
          text
          img
        }
        isObjective
        options {
          _id
          option
          isCorrect
        }
        explanation
        worksheetId
      }
      totalRecord
      totalPage
    }
  }
`

export const STUDENTS = gql`
  query Data {
    students {
      data {
        _id
        name
        username
        age
        isActive
        email
        creatorId
        grade {
          year
          ages
          stage
        }
      }
    }
  }
`

export const SUBJECTS_LIST = gql`
  query Subjects($page: Int, $limit: Int) {
    subjects(page: $page, limit: $limit) {
      data {
        _id
        name
        slug
        tags
        description
        topics {
          data {
            _id
            name
            slug
          }
        }
        createdAt
      }
    }
  }
`

export const TOPICS = gql`
  query Topics(
    $page: Int
    $limit: Int
    $filter: String
    $levelId: String
    $subjectId: String
  ) {
    topics(
      page: $page
      limit: $limit
      filter: $filter
      levelId: $levelId
      subjectId: $subjectId
    ) {
      data {
        _id
        name
        subject
        type
      }
      totalPage
      totalRecord
    }
  }
`

export const SUBJECT = gql`
  query Subject($subjectId: ID!) {
    subject(id: $subjectId) {
      name
    }
  }
`

export const WORKSHEET_BY_ID = gql`
  query Worksheet($worksheetId2: ID!) {
    worksheet(id: $worksheetId2) {
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

export const GET_SUBSCRIPTION = gql`
  query GetSubscription {
    getSubscription {
      id
      plan {
        _id
        title
        pricePerCourse
        allowedCourseList {
          _id
          name
          description
          slug
          tags
          createdAt
          updatedAt
        }
        priceOfFreeTrial
        subTitle
        planPrice
        planCode
        type
      }
      startDate
      endDate
      cancellationDate
      transactionRef
      duration
      autoRenew
      status
      price
      paymentMethod
      user {
        _id
        firstName
        lastName
        email
        phone
        address
        city
        state
        otp
        dob
        sex
        isVerified
        ninverified
        isActive
        lastLoggedIn
        accountType
        createdAt
        updatedAt
        bName
        bankName
        bank
        acctNumber
        bankCode
        occupation
        customerID
      }
    }
  }
`

export const GET_PLANS = gql`
  query GetPlans {
    getPlans {
      _id
      title
      pricePerCourse
      allowedCourseList {
        _id
        name
      }
      priceOfFreeTrial
      subTitle
      planPrice
      planCode
      type
    }
  }
`
export const GET_PRICE = gql`
  query Query {
    getPricePerStudent
  }
`
export const FETCH_ASSIGNED = gql `
  query FetchAssigned($status: AssignmentStatus) {
  fetchAssigned(status: $status) {
    data {
      _id
      worksheetId {
        _id
        title
        body {
          _id
          text
        }
        levelId
        topicId
        difficulty
        createdAt
        updatedAt
      }
      status
      score
      createdAt
      attemptedAt
      updatedAt
    }
  }
}
`
