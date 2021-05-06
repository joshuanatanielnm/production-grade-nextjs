import { Heading, Pane, Spinner, majorScale } from 'evergreen-ui'
import React, { FC } from 'react'

import Container from '../../components/container'
import Head from 'next/head'
import HomeNav from '../../components/homeNav'
import { Post } from '../../types'
import fs from 'fs'
import hydrate from 'next-mdx-remote/hydrate'
import matter from 'gray-matter'
import path from 'path'
import { posts } from '../../content'
import renderToString from 'next-mdx-remote/render-to-string'
import { useRouter } from 'next/router'

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const content = hydrate(source)
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    )
  }
  return (
    <Pane>
      <Head>
        <title>{`Known Blog | ${frontMatter.title}`}</title>
        <meta name="description" content={frontMatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontMatter.title}
          </Heading>
          <Pane>{content}</Pane>
        </Container>
      </main>
    </Pane>
  )
}

BlogPost.defaultProps = {
  source: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
}


export function getStaticPaths(){
  const postsPath = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsPath)

  const slugs = filenames.map(name => {
    const filePath = path.join(postsPath, name)
    const file = fs.readFileSync(filePath, 'utf-8')
    const {data} = matter(file)

    return data
  })

  return {
    paths: slugs.map(s => ({params: {slug: s.slug}})),
    fallback: true
  }
}

export async function getStaticProps({params}) {
  let post
  try {
    const filesPath = path.join(process.cwd(), 'posts', `${params.slug}.mdx`)
    post = fs.readFileSync(filesPath, 'utf-8')
    console.log('should match here', params.slug)
  } catch  {
    const cmsPosts = posts.published.map(p => {
      return matter(p)
    })

    const match = cmsPosts.find(p => p.data.slug === params.slug)
    post = match.content
  }

  const { data } = matter(post)
  const mdxSource = await renderToString(post, {scope: data})


  return {
    props: {
      source: mdxSource,
      frontMatter: data
    }
  }
}

/**
 * Need to get the paths here
 * then the the correct post for the matching path
 * Posts can come from the fs or our CMS
 */
export default BlogPost
