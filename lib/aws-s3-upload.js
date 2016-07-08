'use strict';

const crypto = require('crypto');
const fileType = require('file-type');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const randomHexString = (length) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (error, buffer) => {
      if (error) {
        reject(error);
      }
      resolve(buffer.toString('hex'));
    });
  });
};

const prepareFile = (data) => {
  return Object.assign({
    data,
    ext: 'bin',
    mime: 'application/octet-stream'
  }, fileType(data));
};

const awsUpload = (file) => {
  return randomHexString(16)
    .then((filename) => {
      let dir = new Date().toISOString().split('T')[0];
      return {
        ACL: "public-read",
        Body: file.data,
        Bucket: 'tarawdibucket',
        ContentType: file.mime,
        Key: `${dir}/${filename}.${file.ext}`
      };
    }).
    then((options) => {
      return new Promise((resolve, reject) => {
        s3.upload(options, (error, data) => {
          if (error) {
            reject(error);
          }
          resolve(data);
        });
      });
    });
};


module.exports = {
awsUpload,
prepareFile};
