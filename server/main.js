import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import config from './config';
import { log } from 'console';
const aws = require("aws-sdk");
const fs = require("fs");



Meteor.startup(() => {
  aws.config.update({
    accessKeyId: config.awsAccesskeyID,
    secretAccessKey: config.awsSecretAccessKey,
    region: config.awsRegion
  });

  const s3 = new aws.S3({
    accessKeyId: config.awsAccesskeyID,
    secretAccessKey: config.awsSecretAccessKey,
  })
  // If the Links collection is empty, add some data.
  const test = async () => {
    try {
      const test = await fs.readFile("./Eng test.pdf");
      console.log(test);

    } catch (err) {
      console.log(err);
    }
  }


  const textract = new aws.Textract();


  Meteor.methods({
    async convertToText(data) {
      // var theImg = data.img.split("base64,")[1]
      // console.log(theImg);
console.log(data);
      var res = await textract.detectDocumentText({
        Document: {
          S3Object: {
            "Bucket": "momentest",
            "Name": data
          }
        }
      }).promise()

      // var res = await textract.detectDocumentText({
      //   Document: {
      //     Bytes: theImg
      //   }
      // }).promise()
      var theRes = res.Blocks.filter(i => i.BlockType === "WORD").map(i => i.Text).join(" ");
      console.log(theRes);
      return theRes

    }
  })

});
