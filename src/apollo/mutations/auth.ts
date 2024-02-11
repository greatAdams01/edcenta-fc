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