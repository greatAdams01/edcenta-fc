import { gql } from '@apollo/client'

export const SET_WITHDRAW_BANK = gql`
  mutation SetWithdrawBank(
    $bankName: String!
    $bankCode: String!
    $acctNumber: String!
  ) {
    setWithdrawBank(
      bankName: $bankName
      bankCode: $bankCode
      acctNumber: $acctNumber
    )
  }
`

export const WITHDRAW_TO_BANK = gql`
  mutation WithdrawToBank($amount: Int!) {
    withdrawToBank(amount: $amount)
  }
`

export const WITHDRAW_STUDENT_REWARD = gql`
  mutation WithdrawStudentReward($studentId: ID!, $rewardAmount: Int!) {
    withdrawStudentReward(studentId: $studentId, rewardAmount: $rewardAmount)
  }
` 