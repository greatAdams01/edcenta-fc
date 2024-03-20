import { gql } from '@apollo/client';

export const SIGNUP = gql`
    mutation Register($input: SignInput!){
  register(input: $input) {
    _id   
  }
}`

  export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        _id
        token
        accountType
      }
  }`

export const REQUEST_RESET_PASSWORD = gql`
    mutation ResetPasswordRequest($email: String!) {
    resetPasswordRequest(email: $email)
}
`

export const RESET = gql`
mutation ResetPassword($otp: Float!, $password: String!) {
  resetPassword(otp: $otp, password: $password)
}
`

