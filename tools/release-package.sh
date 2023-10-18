#!/bin/sh

BUCKET=$1

TMP_ROOT=../data/tmp

aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
  
TMP_BUCKET_POLICY="$TMP_ROOT/$BUCKET.json"
cat ./bucket-policy.json | sed "s/{bucket}/$BUCKET/g" > $TMP_BUCKET_POLICY
aws s3api put-bucket-policy --bucket $BUCKET --policy "file://$TMP_BUCKET_POLICY"

docker-compose exec mysql mysql -u root waylap -e "update packages set disabled = 0 where bucket = '$BUCKET'"

rm -f $TMP_BUCKET_POLICY