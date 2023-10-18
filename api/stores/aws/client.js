const { S3Client } = require('@aws-sdk/client-s3')

const { AWS_S3_REGION } = require('##/config.js')

const s3Client = new S3Client({ region: AWS_S3_REGION })

module.exports = { s3Client }