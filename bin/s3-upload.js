'use strict';

const fs = require('fs');
const fileType = require('file-type');

let filename = process.argv[2] || '';

const mimeType = (data) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream'
  }, fileType(data));
};

const awsUpload = (file) => {
  const options = {
    ACL: "public-read-write",
    Body: file.data,
    Bucket: 'tarawdibucket',
    ContentType: file.mime,
    Key: `test/test.${file.ext}`
  };
  return Promise.resolve(options);
};

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) =>{
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};

readFile(filename)
.then((data) => {
  let file = mimeType(data); //build up a file object because S3 expects it,
  //and some more stuff
  file.data = data;
  return file;
}).then(awsUpload) //upload to aws
.then(console.log)
.catch(console.error);
