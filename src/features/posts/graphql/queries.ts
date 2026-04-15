import type { TypedDocumentNode } from "@apollo/client/core";
import { gql } from "@apollo/client/core";
import { POST_CARD_FIELDS_FRAGMENT } from "./fragments";

export type PostCard = {
  id: string;
  title: string;
  body: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
  } | null;
};

export type GetPostsQueryData = {
  posts: {
    data: PostCard[];
  };
};

export type GetPostsQueryVariables = {
  options?: {
    paginate?: {
      page?: number;
      limit?: number;
    };
  };
};

export const GET_POSTS_QUERY: TypedDocumentNode<
  GetPostsQueryData,
  GetPostsQueryVariables
> = gql`
  query GetPosts($options: PageQueryOptions) {
    posts(options: $options) {
      data {
        ...PostCardFields
      }
    }
  }
  ${POST_CARD_FIELDS_FRAGMENT}
`;