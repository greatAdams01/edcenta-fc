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
      data {
      _id
      ages
      stage
      year
    }
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
      _id
      name
      description
      slug
      tags
      createdAt
      updatedAt
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

// Assessment Queries
export const ASSESSMENTS = gql`
  query Assessments(
    $page: Int
    $limit: Int
    $filter: String
    $subjectId: String
    $topicId: String
    $difficulty: String
    $status: String
  ) {
    assessments(
      page: $page
      limit: $limit
      filter: $filter
      subjectId: $subjectId
      topicId: $topicId
      difficulty: $difficulty
      status: $status
    ) {
      data {
        _id
        title
        description
        subjectId {
          _id
          name
        }
        topicId {
          _id
          name
        }
        difficulty
        timeLimit
        totalQuestions
        passingScore
        status
        isActive
        createdAt
        updatedAt
      }
      totalPage
      totalRecord
    }
  }
`

export const ASSESSMENT_BY_ID = gql`
  query Assessment($assessmentId: ID!) {
    assessment(id: $assessmentId) {
      _id
      title
      description
      subjectId {
        _id
        name
      }
      topicId {
        _id
        name
      }
      difficulty
      timeLimit
      totalQuestions
      passingScore
      status
      isActive
      questions {
        _id
        title
        body {
          text
          img
        }
        type
        options {
          _id
          option
          isCorrect
        }
        explanation
        points
        difficulty
      }
      createdAt
      updatedAt
    }
  }
`

export const ASSESSMENT_ATTEMPTS = gql`
  query AssessmentAttempts(
    $page: Int
    $limit: Int
    $filter: String
    $studentId: String
    $assessmentId: String
    $status: String
  ) {
    assessmentAttempts(
      page: $page
      limit: $limit
      filter: $filter
      studentId: $studentId
      assessmentId: $assessmentId
      status: $status
    ) {
      data {
        _id
        assessmentId {
          _id
          title
          subjectId {
            name
          }
          topicId {
            name
          }
        }
        studentId {
          _id
          name
          email
        }
        status
        score
        totalScore
        percentage
        timeSpent
        startedAt
        completedAt
        answers {
          _id
          questionId
          answer
          isCorrect
          points
        }
        createdAt
        updatedAt
      }
      totalPage
      totalRecord
    }
  }
`

export const ASSESSMENT_RESULTS = gql`
  query AssessmentResults(
    $page: Int
    $limit: Int
    $filter: String
    $studentId: String
    $assessmentId: String
    $dateFrom: String
    $dateTo: String
  ) {
    assessmentResults(
      page: $page
      limit: $limit
      filter: $filter
      studentId: $studentId
      assessmentId: $assessmentId
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      data {
        _id
        assessmentId {
          _id
          title
          subjectId {
            name
          }
          topicId {
            name
          }
        }
        studentId {
          _id
          name
          email
        }
        score
        totalScore
        percentage
        grade
        timeSpent
        completedAt
        createdAt
      }
      totalPage
      totalRecord
    }
  }
`

export const STUDENT_PROGRESS = gql`
  query StudentProgress($studentId: ID!) {
    studentProgress(studentId: $studentId) {
      totalAssessments
      completedAssessments
      averageScore
      totalPoints
      subjectProgress {
        subjectId {
          _id
          name
        }
        totalAssessments
        completedAssessments
        averageScore
        bestScore
      }
      recentAttempts {
        _id
        assessmentId {
          title
          subjectId {
            name
          }
        }
        score
        percentage
        completedAt
      }
    }
  }
`
