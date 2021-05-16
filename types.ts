import { Db, MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export interface PostFrontMatter {
  title: string
  summary: string
  publishedOn: string
}

export interface Post {
  source: string
  frontMatter: PostFrontMatter
}

export interface UserSession {
  image: string
  email: string
  name: string
  id: string
}

export interface Request extends NextApiRequest {
  db: Db
  dbClient: MongoClient
  user: { email: string; id: string }
}
