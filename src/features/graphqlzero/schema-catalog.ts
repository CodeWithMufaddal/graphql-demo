export const graphqlZeroEntities = [
  "users",
  "user",
  "todos",
  "todo",
  "posts",
  "post",
  "photos",
  "photo",
  "comments",
  "comment",
  "albums",
  "album",
] as const

export type GraphqlZeroEntity = (typeof graphqlZeroEntities)[number]

export const graphqlZeroQueryMap: Record<GraphqlZeroEntity, string> = {
  users: "users(options: PageQueryOptions): UsersPage",
  user: "user(id: ID!): User",
  todos: "todos(options: PageQueryOptions): TodosPage",
  todo: "todo(id: ID!): Todo",
  posts: "posts(options: PageQueryOptions): PostsPage",
  post: "post(id: ID!): Post",
  photos: "photos(options: PageQueryOptions): PhotosPage",
  photo: "photo(id: ID!): Photo",
  comments: "comments(options: PageQueryOptions): CommentsPage",
  comment: "comment(id: ID!): Comment",
  albums: "albums(options: PageQueryOptions): AlbumsPage",
  album: "album(id: ID!): Album",
}

export const mutationFamilies = [
  {
    name: "create",
    fields: [
      "createUser",
      "createTodo",
      "createPost",
      "createPhoto",
      "createComment",
      "createAlbum",
    ],
  },
  {
    name: "update",
    fields: [
      "updateUser",
      "updateTodo",
      "updatePost",
      "updatePhoto",
      "updateComment",
      "updateAlbum",
    ],
  },
  {
    name: "delete",
    fields: [
      "deleteUser",
      "deleteTodo",
      "deletePost",
      "deletePhoto",
      "deleteComment",
      "deleteAlbum",
    ],
  },
] as const

export const graphqlZeroSystemFields = {
  query: "_: Int",
  mutation: "_: Int",
}
