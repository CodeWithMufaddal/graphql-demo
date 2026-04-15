import { gql } from "@apollo/client/core"

export const USER_DIRECTORY_FIELDS_FRAGMENT = gql`
  fragment UserDirectoryFields on User {
    id
    name
    username
    email
    phone
    website
    company {
      name
      catchPhrase
      bs
    }
    address {
      city
      street
      suite
      zipcode
      geo {
        lat
        lng
      }
    }
  }
`
