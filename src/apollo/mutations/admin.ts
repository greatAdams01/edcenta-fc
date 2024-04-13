import { gql } from "@apollo/client";

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID) {
    deleteUser(id: $deleteUserId) {
      _id
    }
  }
`