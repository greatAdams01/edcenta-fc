import { gql } from '@apollo/client'

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID) {
    deleteUser(id: $deleteUserId) {
      _id
    }
  }
`

export const EDIT_USER = gql`
  mutation EditUserInfo(
    $firstName: String
    $lastName: String
    $email: String
    $phone: String
    $address: String
    $sex: String
    $dob: String
    $city: String
    $state: String
    $bankName: String
    $bank: String
    $acctNumber: String
    $bankCode: String
    $id: ID
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
      state: $state
      bankName: $bankName
      bank: $bank
      acctNumber: $acctNumber
      bankCode: $bankCode
      _id: $id
    ) {
      _id
    }
  }
`

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($deleteStudentId: ID!) {
    deleteStudent(id: $deleteStudentId) {
      _id
    }
  }
`
export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($updateStudentId: ID!, $input: StudentInput!) {
    updateStudent(id: $updateStudentId, input: $input) {
      _id
    }
  }
`

export const UPDATE_SUBJECT = gql`
  mutation UpdateSubject(
    $id: ID!
    $name: String
    $description: String
    $slug: String
    $tags: [String!]
  ) {
    updateSubject(
      id: $id
      name: $name
      description: $description
      slug: $slug
      tags: $tags
    ) {
      _id
      name
      description
      slug
      tags
    }
  }
`
export const UPDATE_TOPIC = gql`
  mutation UpdateTopic($id: ID!, $name: String!) {
    updateTopic(id: $id, name: $name) {
      _id
      name
    }
  }
`

export const UPDATE_WORKSHEET = gql`
  mutation UpdateWorksheet($id: ID!, $input: WorkSheetInput!) {
    updateWorksheet(id: $id, input: $input) {
      _id
      title
      body {
        text
        img
      }
      levelId
      topicId
      subjectId
      difficulty
    }
  }
`

export const DELETE_SUBJECT = gql`
  mutation DeleteSubject($id: ID!) {
    deleteSubject(id: $id)
  }
`
export const DELETE_TOPIC = gql`
  mutation DeleteTopic($id: ID!) {
    deleteTopic(id: $id)
  }
`

export const DELETE_WORKSHEET = gql`
  mutation DeleteWorksheet($id: ID!) {
    deleteWorksheet(id: $id) {
      _id
    }
  }
`

export const CREATE_SUBJECT = gql`
  mutation CreateSubject($name: String!, $description: String!) {
    createSubject(name: $name, description: $description) {
      _id
      name
      description
    }
  }
`
export const CREATE_TOPIC = gql`
  mutation CreateTopic(
    $name: String!
    $levelId: ID!
    $subjectId: ID!
    $type: TopicType!
    $description: String!
  ) {
    createTopic(
      name: $name
      levelId: $levelId
      subjectId: $subjectId
      type: $type
      description: $description
    ) {
      _id
      name
      description
      slug
      levelId
    }
  }
`

export const CREATE_WORKSHEET = gql`
  mutation CreateWorksheet(
    $title: String!
    $body: [BodyInput!]!
    $levelId: ID!
    $topicId: ID!
    $subjectId: String!
    $vidLink: String!
    $difficulty: Difficulty!
  ) {
    createWorksheet(
      input: {
        title: $title
        body: $body
        levelId: $levelId
        topicId: $topicId
        subjectId: $subjectId
        difficulty: $difficulty
        vidLink: $vidLink
      }
    ) {
      _id
      title
      body {
        _id
        text
        img
      }
      levelId
      topicId
      subjectId
      difficulty
    }
  }
`

export const CREATE_QUESTION = gql`
  mutation createQuestion(
    $title: String!
    $body: [BodyInput!]!
    $isObjective: Boolean!
    $worksheetId: ID!
    $explanation: String!
    $options: [QuestionOptionInput!]!
  ) {
    createQuestion(
      input: {
        title: $title
        body: $body
        isObjective: $isObjective
        worksheetId: $worksheetId
        explanation: $explanation
        options: $options
      }
    ) {
      _id
      title
      body {
        _id
        text
        img
      }
      createdAt
      explanation
      isObjective
    }
  }
`
export const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion( id: $id ) {
      _id
    }
}
`
export const EDIT_QUESTION = gql`
  mutation UpdateQuestion(
    $id: ID!
    $input: QuestionInput!
  ) {
    updateQuestion(
      id: $id
      input: $input
    ) {
      _id
    }
  }
`
export const DELETE_PLAN = gql`
  mutation DeletePlan($id: ID!) {
    deletePlan( id: $id ) {
      _id
    }
  }
`
export const CREATE_PLAN = gql`
mutation CreatePlan($title: String!, $pricePerCourse: Int!, $allowedCourseList: [String!]!, $subTitle: String!, $planPrice: Float!, $type: PlanType!, $pricePerStudent: Float!, $numberStudents: Float!) {
  createPlan(title: $title, pricePerCourse: $pricePerCourse, allowedCourseList: $allowedCourseList, subTitle: $subTitle, planPrice: $planPrice, type: $type, pricePerStudent: $pricePerStudent, numberStudents: $numberStudents) {
    _id
  }
}
`

export const UPDATE_PLAN = gql`
mutation UpdatePlan($updatePlanId: ID!, $title: String!, $pricePerCourse: Int!, $allowedCourseList: [String!]!,   $priceOfFreeTrial: Float!, $subTitle: String!, $planPrice: Float!, $type: PlanType!) {
  updatePlan(id: $updatePlanId, title: $title, pricePerCourse: $pricePerCourse, allowedCourseList: $allowedCourseList, priceOfFreeTrial: $priceOfFreeTrial, subTitle: $subTitle, planPrice: $planPrice, type: $type) {
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
}
`