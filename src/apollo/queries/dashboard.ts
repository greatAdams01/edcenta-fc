import { gql } from '@apollo/client';

export const SchoolGrades = gql`
query SchoolGrades {
  schoolGrades {
    _id
    ages
    stage
    year
    subject {
      _id
      name
      topics {
        _id
      }
      worksheet {
        _id
      }
    }
  }
}

`