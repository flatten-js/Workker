const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { s3Client } = require('./client.js')

async function upload(Bucket, Key, Body) {
  const params = { Bucket, Key, Body }
  return await s3Client.send(new PutObjectCommand(params))
}

async function get(Bucket, Key) {
  const params = { Bucket, Key }
  const object = await s3Client.send(new GetObjectCommand(params))
  return await object.Body?.transformToString()
}

module.exports = { upload, get }