import React, { useState } from 'react';
import AWS from 'aws-sdk'


const S3_BUCKET = 'momentest';
const REGION = 'us-east-1';




AWS.config.update({
  accessKeyId: "",
  secretAccessKey: ""
})

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
})
export const Hello = () => {
  // const [file, setFile] = useState(null)
  // const [fileName, setFileName] = useState(null)

  // const fileToBase64 = (file, cb) => {
  //   const reader = new FileReader()
  //   reader.readAsDataURL(file)
  //   reader.onload = function () {
  //     cb(null, reader.result)
  //   }
  //   reader.onerror = function (error) {
  //     cb(error, null)
  //   }
  // }

  // const onUploadFileChange = ({ target }) => {
  //   if (target.files < 1 || !target.validity.valid) {
  //     return
  //   }
  //   console.log(target.files[0]);
  //   fileToBase64(target.files[0], (err, result) => {
  //     if (result) {
  //       setFile(result)
  //       setFileName(target.files[0])
  //     }
  //   })
  // }



  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState();


  const convert = () => {
    console.log(selectedFile.name);
    Meteor.call("convertToText", selectedFile.name, (err, res) => {
      if (err) {
        console.log(err);
        setText("not supported")
      } else {
        setText(res)
      }
    })
  }
  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  const uploadFile = (file) => {
    setText("")
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name
    };

    myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100))
      })
      .send((err) => {
        convert(setSelectedFile)
        if (err) console.log(err)
      })
  }



  return (
    <div >
      <div>File Upload Progress is {progress}%</div>
      <input type="file" onChange={handleFileInput} />
      <button onClick={() => uploadFile(selectedFile)}>Extract</button>
      {(text) ? <textarea  style={{ display: "block", margin: "20px auto", width: "800px", height: "250px" }}>
        {text}
      </textarea> : ""}
    </div>
  );
};
