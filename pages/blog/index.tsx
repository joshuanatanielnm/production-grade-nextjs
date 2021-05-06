import { Pane, majorScale } from 'evergreen-ui'

import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import PostPreview from '../../components/postPreview'
import React from 'react'
import fs from 'fs'
import matter from 'gray-matter'
import orderby from 'lodash.orderby'
import path from 'path'
import { posts as postsFromCMS } from '../../content'

const Blog = ({ posts }) => {
  return (
    <Pane>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          {posts.map((post) => (
            <Pane key={post.title} marginY={majorScale(5)}>
              <PostPreview post={post} />
            </Pane>
          ))}
        </Container>
      </main>
    </Pane>
  )
}

Blog.defaultProps = {
  posts: [],
}

export function getStaticProps(){
  const cmsPosts = postsFromCMS.published.map(post => {
    const {data} = matter(post)
    return data
  })

  const postsPath = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsPath)

  const filepost = filenames.map(name => {
    const fullpath = path.join(process.cwd(), 'posts', name)
    const file = fs.readFileSync(fullpath, 'utf-8')
    const {data} = matter(file)

    return data
  })

  const posts = [...cmsPosts, ...filepost]
  return {
    props: {posts}
  }
}

export default Blog

/**
 * Need to get the posts from the
 * fs and our CMS
 */
