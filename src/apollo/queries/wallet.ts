import { gql } from '@apollo/client'

export const GET_WALLET_BALANCE = gql`
  query GetWalletBalance {
    walletBalance
  }
`

export const GET_WALLET_TRANSACTIONS = gql`
  query WalletTransactions(
    $page: Int
    $limit: Int
    $filter: String
    $searchParams: Boolean
  ) {
    walletTxs(
      page: $page
      limit: $limit
      filter: $filter
      searchParams: $searchParams
    ) {
      amount
      userId
      isInflow
      paymentMethod
      currency
      status
    }
  }
`

export const GET_WALLET_TRANSACTION = gql`
  query WalletTransaction($id: ID!) {
    walletTx(id: $id) {
      amount
      userId
      isInflow
      paymentMethod
      currency
      status
    }
  }
`

export const GET_BANKS = gql`
  query GetBanks {
    getBanks {
      name
      slug
      code
      longcode
      gateway
      pay_with_bank
      active
      is_deleted
      country
      currency
      type
      id
      createdAt
      updatedAt
    }
  }
`

export const VERIFY_BANK_ACCOUNT = gql`
  query VerifyBankAccount($account_number: String!, $code: String!) {
    verifyBankAccount(account_number: $account_number, code: $code) {
      account_number
      account_name
    }
  }
` 