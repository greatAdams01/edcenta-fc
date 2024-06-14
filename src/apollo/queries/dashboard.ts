import { gql } from '@apollo/client'

export const SchoolGrades = gql`
  query SchoolGrades($page: Int, $limit: Int, $filter: String) {
    schoolGrades(page: $page, limit: $limit, filter: $filter) {
      data {
        _id
        ages
        year
        stage
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
      subject {
        _id
        name
      }
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
  query Assignments($page: Int, $limit: Int, $filter: String) {
    assignments(page: $page, limit: $limit, filter: $filter) {
      data {
        _id
        worksheetId {
          _id
          title
        }
        answers {
          _id
        }
        createdAt
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
        createdAt
        updatedAt
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
