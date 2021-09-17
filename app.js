const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const { notFoundHandler, errorHandler } = require("./middleware");
const boardHandler = require("./api/boardHandler");
const listHandler = require("./api/listHandler");
const cardHandler = require("./api/cardHandler");
const timelineHandler = require("./api/timelineHandler");
const userHandler = require("./api/userHandler");
const activityHandler = require("./api/activityHandler");
const companyHandler = require("./api/companyHandler");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const OAuth2Data = require("./config/credentials.json");
const stream = require("stream");
const { GoogleAuth } = require("google-auth-library");

const KEYFILEPATH = "./config/service_account.json";
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// init auth with the needed keyfile and scope
const auth = new GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// const multer = Multer({
//   storage: Multer.MemoryStorage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // no larger than 5mb
//   },
// });

// const CLIENT_ID = OAuth2Data.web.client_id;
// const CLIENT_SECRET = OAuth2Data.web.client_secret;
// const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];
// const REFRESH_TOKEN = OAuth2Data.web.refresh_token;

// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URL
// );

// const diskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "/uploads"));
//   },
//   // konfigurasi penamaan file yang unik
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   limits: {
//     fileSize: 10000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
//       cb(new Error("Please upload an image."));
//     }
//     cb(undefined, true);
//   },
// });
const app = express();

console.log(`database ${process.env.MONGO_URL}`);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const upload = multer({ dest: "./images" }).single("demo_image");

app.post("/image", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send("Something went wrong!");
    }
    res.send(req.file);
  });
});

// Multer and upload profile to Google drive

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var uploadProfilePicture = multer({
  storage: Storage,
}).single("file"); // field name and max count

app.post("/upload", (req, res) => {
  // init auth with the needed keyfile and scope
  const auth = new GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });

  uploadProfilePicture(req, res, function (err) {
    if (err) {
      console.log("ERROR:", err);
      return res.send("Error Upload PP:", err);
    } else {
      console.log(req.file.path);
      const drive = google.drive({ version: "v3", auth });
      const fileMetaData = {
        name: req.file.filename,
        parents: ["1OVS1K9P2ruB9HpNJWIwVgu6bKI-CfOgp"],
      };
      const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      };
      let response = drive.files.create(
        {
          resource: fileMetaData,
          media: media,
          fields: "id",
        },
        (err, file) => {
          if (err) {
            // handle error
            console.log("Error create drive:", err);
          } else {
            fs.unlinkSync(req.file.path);
            drive.permissions.create({
              fileId: file.data.id,
              requestBody: {
                role: "reader",
                type: "anyone",
              },
            });
            res.send(
              `Success, Link soon to be attached in HTML: https://drive.google.com/uc?export=view&id=${file.data.id}`
            );
            // res.render("Upload Success", { name: name, pic: pic });
            // console.log("Response data:", file);
          }
        }
      );
    }
  });
});

app.get(
  "/profilePicture",
  (req, res) => {
    // init auth with the needed keyfile and scope
    const auth = new GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });

    const drive = google.drive({ version: "v3", auth });

    // file id for testing only
    const file_id = "140h6_62xcwU0VcRS2naqg1xteItKxxfU";
    const getImage = drive.files.get({
      fileId: file_id,
      fields: "webViewLink, webContentLink",
    });
    getImage.then((res) => {
      console.log("Get Response: ", res);
    });
  },
  (err, file) => {
    if (err) {
      // handle error
      console.log("Error get image from drive:", err);
    } else {
      res.send(`Access Image from link: ${file.data}`);
    }
  }
);

app.use(morgan("tiny"));
app.use(helmet());

app.use(express.json());
app.use("/api/user/", userHandler);
app.use("/api/boards/", boardHandler);
app.use("/api/lists/", listHandler);
app.use("/api/cards/", cardHandler);
app.use("/api/timelines/", timelineHandler);
app.use("/api/activities/", activityHandler);
app.use("/api/company/", companyHandler);
// app.post("/upload", upload.single("upload"), (req, res) => {
//   res.send(res.data);
// });
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
}

app.use(notFoundHandler);

// GOOGLE UPLOAD FEATURE

async function createAndUploadFile(auth) {
  // init drive service, it will now handle all authorization
  const driveService = google.drive({ version: "v3", auth });

  // metadata for the new file on google drive
  // parents pointing to folder "test Upload file" in google drive
  let fileMetadata = {
    name: "icon.png",
    parents: ["1OVS1K9P2ruB9HpNJWIwVgu6bKI-CfOgp"],
  };

  // media definition of the file
  let media = {
    mimeType: "image/jpeg",
    body: fs.createReadStream("ERD.png"),
  };

  // create the request
  let response = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });

  //handle the response
  switch (response.status) {
    case 200:
      let file = response.result;
      console.log("Created File Id: ", response.data.id);
      break;
    default:
      console.error("Error creating the file, " + response.errors);
      break;
  }
}
// createAndUploadFile(auth);

// app.post("/upload", multer.single("my file"), (req, res, next) => {
//   const serviceAccount = require("./config/service_account.json");
//   let fileObject = req.file;
//   let bufferStream = new stream.PassThrough();
//   bufferStream.end(fileObject.buffer);
//   const jWTClient = new google.auth.JWT(
//     serviceAccount.client_email,
//     null,
//     serviceAccount.private_key,
//     ["https://www.googleapis.com/auth/drive.file"]
//   );
//   google
//     .drive({ version: "v3" })
//     .files.create({
//       auth: jWTClient,
//       media: {
//         mimeType: req.file.mimetype,
//         body: bufferStream,
//       },
//       resource: {
//         name: req.file.filename,
//         // if you want to store the file in the root, remove this parents
//         // parents: ['Drive folder id in which the file needs to be uploaded.']
//       },
//       fields: "id",
//     })
//     .then(function (resp) {
//       console.log(resp, "resp");
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
//   res.send("File uploaded");
// });

module.exports = app;
