import { gql } from '@apollo/client'

export const MUTATE_USER = gql`
  mutation EditUserInfo(
    $firstName: String
    $lastName: String
    $email: String
    $phone: String
    $address: String
    $sex: String
    $dob: String
    $city: String
    $bName: String
    $bankName: String
    $bank: String
    $acctNumber: String
    $bankCode: String
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
      bName: $bName
      bankName: $bankName
      bank: $bank
      acctNumber: $acctNumber
      bankCode: $bankCode
    ) {
      _id
    }
  }
`

export const CHANGE_PASSWORD = gql`
  mutation UpdatePassword($newPassword: String!, $oldPassword: String!) {
    updatePassword(newPassword: $newPassword, oldPassword: $oldPassword)
  }
`

export const CREATE_STUDENT = gql`
  mutation CreateStudent($input: StudentInput!) {
    createStudent(input: $input) {
      _id
    }
  }
`

export const ASSIGN_WORKSHEET = gql`
  mutation AssingStudentsWorksheet($studentIds: [ID!]!, $worksheetId: ID!) {
    assingStudentsWorksheet(studentIds: $studentIds, worksheetId: $worksheetId)
  }
`
export const UPDATE_ASSIGNMENT = gql`
  mutation updateAssignment($id: ID!, $input: AssignmentInput!) {
    updateAssignment(id: $id, input: $input) {
      _id
      worksheetId {
        _id
        title
      }
      answers {
        _id
        questionId
        answer
        isCorrect
      }
      createdAt
      score
      status
      attemptedAt
      updatedAt
    }
  }
`

export const UPDATE_ASSIGNMENT_SCORE = gql`
  mutation UpdateAssignmentScore(
    $updateAssignmentScoreId: ID!
    $score: String!
  ) {
    updateAssignmentScore(id: $updateAssignmentScoreId, score: $score)
  }
`

export const SUBSCRIBE_TO_PLAN = gql`
  mutation SubscribeToPlan($planCode: String!) {
    subscribeToPlan(planCode: $planCode) {
      authorization_url
      access_code
      reference
    }
  }
`
export const CUSTOM_PLAN = gql`
  mutation SubscribeToCustomPlan(
    $allowedCourseList: [String!]!
    $numberOfStudents: Int!
  ) {
    subscribeToCustomPlan(
      allowedCourseList: $allowedCourseList
      numberOfStudents: $numberOfStudents
    ) {
      authorization_url
      access_code
      reference
    }
  }
`

// Assessment Mutations
export const START_ASSESSMENT = gql`
  mutation StartAssessment($assessmentId: ID!) {
    startAssessment(assessmentId: $assessmentId) {
      _id
      assessmentId {
        _id
        title
        description
        timeLimit
        totalQuestions
      }
      studentId {
        _id
        name
      }
      status
      startedAt
      timeRemaining
    }
  }
`

export const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer($attemptId: ID!, $questionId: ID!, $answer: String!) {
    submitAnswer(attemptId: $attemptId, questionId: $questionId, answer: $answer) {
      _id
      questionId
      answer
      isCorrect
      points
      submittedAt
    }
  }
`

export const COMPLETE_ASSESSMENT = gql`
  mutation CompleteAssessment($attemptId: ID!) {
    completeAssessment(attemptId: $attemptId) {
      _id
      status
      score
      totalScore
      percentage
      grade
      timeSpent
      completedAt
      answers {
        _id
        questionId
        answer
        isCorrect
        points
      }
    }
  }
`

export const ASSIGN_ASSESSMENT = gql`
  mutation AssignAssessment($studentIds: [ID!]!, $assessmentId: ID!, $dueDate: String) {
    assignAssessment(studentIds: $studentIds, assessmentId: $assessmentId, dueDate: $dueDate) {
      _id
      assessmentId {
        _id
        title
      }
      studentId {
        _id
        name
      }
      dueDate
      status
      assignedAt
    }
  }
`

export const UPDATE_ASSESSMENT_ATTEMPT = gql`
  mutation UpdateAssessmentAttempt($id: ID!, $input: AssessmentAttemptInput!) {
    updateAssessmentAttempt(id: $id, input: $input) {
      _id
      status
      score
      totalScore
      percentage
      grade
      timeSpent
      completedAt
      updatedAt
    }
  }
`
