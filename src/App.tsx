import './App.css'
import { usePostsQuery } from './features/posts/hooks/usePostsQuery'

function App() {
  const { data, loading, error } = usePostsQuery({ page: 1, limit: 8 })
  const posts = data?.posts.data ?? []

  if (loading) {
    return (
      <main className="page">
        <h1>Loading posts...</h1>
        <p>Please wait while we fetch data from GraphQL Zero.</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page">
        <h1>Something went wrong</h1>
        <p>{error.message}</p>
      </main>
    )
  }

  if (posts.length === 0) {
    return (
      <main className="page">
        <h1>No posts found</h1>
        <p>GraphQL request succeeded but no records were returned.</p>
      </main>
    )
  }

  return (
    <main className="page">
      <h1>GraphQL Zero: Posts</h1>
      <p>Production-style query module with Apollo Client.</p>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <small>
              By {post.user?.name ?? 'Unknown author'} (@
              {post.user?.username ?? 'unknown'})
            </small>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
