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
          body {
            _id
            text
            img
          }
          isObjective
          options {
            _id
            _id
            option
            isCorrect
          }
          explanation
          worksheetId
        }
      }
      topics {
        _id
        name
        slug
        levelId
        worksheet {
          _id
          title
        }
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
      worksheet {
      _id
      title
      createdAt
      questions {
        _id
        title
      }
    }
    }
  }
`;

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