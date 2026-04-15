import { gql } from "@apollo/client/core";

export const POST_CARD_FIELDS_FRAGMENT = gql`
  fragment PostCardFields on Post {
    id
    title
    body
    user {
      id
      name
      username
      email
    }
    comments {
      data {
        id
        name
        email
        body
      }
    }
  }
`;
