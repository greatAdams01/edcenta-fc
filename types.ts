interface DefaultAttributes {
  _doc?: any
  _id?: any
  deletedAt?: string
  createdAt?: string
  updatedAt?: string
}
export enum FileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}
export enum TopicType {
  NATIONAL = 'NATIONAL',
  PRIVATE = 'PRIVATE',
  ASSESSMENT = 'ASSESSMENT ',
}
export enum AccountType {
  STUDENT = 'STUDENT',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  TUTOR = 'TUTOR',
  PARENT = 'PARENT',
  MODERATOR = 'MODERATOR',
  SUPERADMIN = 'SUPERADMIN',
}

export enum ITransactionType {
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
}

export enum ICurrency {
  NGN = 'NGN',
  USD = 'USD',
}

export enum IStatus {
  Used = 'Used',
  Cancelled = 'Cancelled',
  Active = 'Active',
  Pending = 'Pending',
}

export enum IPaymentStatus {
  Pending = 'Pending',
  Failed = 'Failed',
  success = 'success',
  Refunded = 'Refunded',
  Declined = 'Declined',
}

export interface IUser extends DefaultAttributes {
  firstName: string
  lastName: string
  email: string
  phone?: number
  facebookId?: string
  googleId?: string
  address?: string
  password?: string
  city?: string
  state?: string
  otp: number
  isVerified: Boolean
  ninverified: Boolean
  dob: string
  sex: string

  lastLoggedIn: string
  accountType: AccountType
  isActive: Boolean

  bName?: string
  bankName?: string
  bank?: string
  acctNumber?: string
  bankCode?: number
  occupation?: string
}

export interface ISchool extends DefaultAttributes {
  name: string
  address: string
  students: string[]
  tutors: string[]
  isVerified: boolean
  isActive: boolean
  userId: string
}

export interface ISchoolReg {
  name: string
  address: string
  userId: string
}

// export interface ITutorReg {
//   name: stringlevel
//   address: string
//   userId: string
// }

export interface ITutor extends DefaultAttributes {
  user: string
  school: string
  classes: string[]
}

export interface IClass extends DefaultAttributes {
  className: string
  subject: string
  classCode: string
  address: string
  students: string[]
  tutor: string[]
  isVerified: boolean
  isActive: boolean
}

export interface IClassReg {
  className: string
  subject: string
  classCode: string
}

export interface IRegisterArgs {
  firstName: string
  lastName: string
  email: string
  facebookId?: string
  googleId?: string
  phone: string
  address: string
  password: string
  city: string
  state: string
  accountType: string
  bName?: string
  bankName?: string
  bank?: string
  acctNumber?: string

  occupation?: string
}

export interface IAuthData {
  _id: string
  token: string
  accountType: string
}
export type AuthRequest = Request & {
  user: IAuthData
  admin: IAdmin & { id: string }
  destination?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    url: string
  }
}

export interface IContext {
  req?: AuthRequest
  res?: Response
  _id?: string
  email?: string
  accountType?: AccountType
}

type IRole = 'super-admin' | 'admin' | 'operator'
export interface IAdmin extends DefaultAttributes {
  role: IRole
  email: string
  address: string
  lastName: string
  phone: number
  password: string
  otp: number
  city: string
  state: string
  isActive: boolean
  firstName: string
  phoneNumber: string
  accountType?: string
  lastLoggedIn?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface ITransaction extends DefaultAttributes {
  userId: string
  name: string
  email: string
  phone: number
  amount: number
  type: ITransactionType
  currency: ICurrency
  status: IPaymentStatus
  tx_ref: string
  txId: string
  profit: number
  paymentMethod: string
}

export interface IWallet extends DefaultAttributes {
  balance: number
  userId: string
}

export interface IWalletTransaction extends DefaultAttributes {
  amount: number
  userId: string
  isInflow: boolean
  paymentMethod: string
  currency: ICurrency
  status: IPaymentStatus
}

export interface ISubject extends DefaultAttributes {
  save(): unknown
  name: string
  description: string
  slug: string
  tags: string[]
  schoolGrade: string
}

export interface ITopic extends DefaultAttributes {
  name: string
  description: string
  slug: string
  levelId: string
}

export interface IBody {
  __typename: string
  text: string
  img: string
}
export interface IWorksheet extends DefaultAttributes {
  title: string
  body: IBody[]
  difficulty: string
  vidLink: string | TrustedHTML
}

export interface IWorksheet2 extends DefaultAttributes {
  vidLink: string | TrustedHTML
  title: string
  body: IBody[]
  difficulty: string
  levelId?: string
  subjectId?: string
}

export interface ISubtopic extends DefaultAttributes {
  name: string
  desc: string
  topicId: string
}

export interface IQuestionOption {
  option: string
  isCorrect: boolean
}

export interface IQuestion extends DefaultAttributes {
  _id: string
  title: string
  body: IBody[]
  isObjective: boolean
  options: IQuestionOption[]
  explanation: string
  worksheetId: string
}

export interface IFile {
  file: string
  type: FileType
}

enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface ISheet {
  text: string
  img: string
}

export interface IWorkSheet extends DefaultAttributes {
  title: string
  body: ISheet[]
  subjectId: string
  topicId: string
  levelId: string
  difficulty: Difficulty
  questions: string[] | string[]
}

export interface IQuestion extends DefaultAttributes {
  title: string
  body: IBody[]
  isObjective: boolean
  options: IQuestionOption[]
  worksheetId: string
  explanation: string
}

export interface IQuestionOption {
  option: string
  isCorrect: boolean
}

export enum AssessmentStatus {
  ASSIGNED = 'ASSIGNED',
  PENDING = 'PENDING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

export interface IStudent extends DefaultAttributes {
  name: string
  age: number
  grade: ISchoolGrade
  username: string
  password: string
  email: string
  creatorId?: string
  schoolId: string
  assessment: string[]
  lastLoggedIn: string
  isActive: boolean
}

export interface ICourse {
  _id: string
  name?: string
}

export interface IPlan {
  _id: string
  title: string
  pricePerCourse: number
  allowedCourseList: ICourse[]
  priceOfFreeTrial: number
  subTitle: string
  planPrice: number
  planCode: string
  type: string
  __typename: string
}

export interface IAnswer {
  questionId: string
  answer: string // question option ID
  isCorrect: boolean
}

export interface IAssessment extends DefaultAttributes {
  student: string
  worksheetId: string
  answers: IAnswer[]
  score: number
  status: AssessmentStatus
  attemptedAt: string
}

export interface ISchoolGrade extends DefaultAttributes {
  stage: number
  ages: string
  year: string
}
