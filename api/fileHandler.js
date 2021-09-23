const { Router } = require("express");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
const multer = require("multer");
const fs = require("fs");

const router = Router();

const KEYFILEPATH = "./config/service_account.json";
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// init auth with the needed keyfile and scope
const auth = new GoogleAuth({
  keyFile: KEYFILEPATH || process.env.KEYFILEPATH,
  scopes: SCOPES,
});

// Multer and upload profile to Google drive

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images");
  },
  filename: function (req, file, callback) {
    var date = new Date();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    callback(
      null,
      req.body.folder +
        "_" +
        day +
        month +
        date.getFullYear() +
        "_" +
        file.originalname
    );
  },
});

const upload = multer({
  storage: Storage,
}).array("files");

router.post("/", (req, res) => {
  upload(req, res, function (err) {
    var n = [];
    var file_name, file_ext, file_path;

    // if upload one file
    for (let value of req.files) {
      // `files` is the name of the <input> field of type `file`
      n.push(
        new Object({
          file_name: value.filename,
          file_type: value.mimetype,
          file_path: value.path,
        })
      );
      console.log("Pushed file: ", n);
      // res.end("Multiple Upload Success");
    }
    if (err) {
      console.log("error:", err);
    }
    // console.log(req.body);
    console.log(req.files);
    console.log(req.body.folder);

    // Target folder in drive for the uploaded file
    const targetFolderId = "1gg6-zCgUmjfwngO1zwBKv7NuhOrp0Bvy";

    let resultFiles = [];
    function uploadFile() {
      const drive = google.drive({ version: "v3", auth });

      //upload file
      n.map((item, index) => {
        var fileMetaData = {
          name: item.file_name,
          parents: [targetFolderId],
        };
        var media = {
          mimeType: item.file_type,
          body: fs.createReadStream(item.file_path),
        };

        drive.files.create(
          {
            resource: fileMetaData,
            media: media,
            fields: "id, webContentLink, webViewLink, name",
          },
          (err, file) => {
            if (err) {
              // Handle error
              console.error(err);
            } else {
              fs.unlinkSync(item.file_path);
              drive.permissions.create({
                fileId: file.data.id,
                requestBody: {
                  role: "reader",
                  type: "anyone",
                },
              });
              // res.send(`Create success with file id:${file.data.id}`);
              resultFiles.push(file.data);
              console.log("resultFiles: ", resultFiles);
              if (resultFiles.length === n.length) {
                res.send(resultFiles);
              }
              // res.send(file);
              // console.log("file: ", file);
            }
          }
        );
        // if (index === n.length - 1) {
        //   res.end(resultFiles);
        // }
      });
      // if (resultFiles.length === n.length) {
      //   return res.send();
      // }
    }
    // call upload function
    uploadFile();
  });
});

// uploadFile(req, res, function (err) {
//   if (err) {
//     console.log("ERROR:", err);
//     return res.send("Error Upload PP:", err);
//   } else {
//     console.log(req.file.path);
//     const drive = google.drive({ version: "v3", auth });
//     const fileMetaData = {
//       name: req.file.filename,
//       parents: ["1gg6-zCgUmjfwngO1zwBKv7NuhOrp0Bvy"],
//     };
//     const media = {
//       mimeType: req.file.mimetype,
//       body: fs.createReadStream(req.file.path),
//     };
//     let response = drive.files.create(
//       {
//         resource: fileMetaData,
//         media: media,
//         fields: "id",
//       },
//       (err, file) => {
//         if (err) {
//           // handle error
//           console.log("Error create drive:", err);
//         } else {
//           fs.unlinkSync(req.file.path);
//           drive.permissions.create({
//             fileId: file.data.id,
//             requestBody: {
//               role: "reader",
//               type: "anyone",
//             },
//           });
//           res.send(
//             `Success, Link soon to be attached in HTML: https://drive.google.com/uc?export=view&id=${file.data.id}`
//           );
//         }
//       }
//     );
//   }
// });
// });

router.get("/", async (req, res, next) => {
  // init auth with the needed keyfile and scope
  // const _fileId = req.body.fileId || "1gg6-zCgUmjfwngO1zwBKv7NuhOrp0Bvy";
  try {
    //   const auth = new GoogleAuth({
    //     keyFile: KEYFILEPATH || process.env.KEYFILEPATH,
    //     scopes: SCOPES,
    //   });

    const drive = google.drive({ version: "v3", auth });
    // const fileId = _fileId;

    await drive.files.list(
      {
        spaces: "drive",
        fileId: "1gg6-zCgUmjfwngO1zwBKv7NuhOrp0Bvy",
        fields:
          "nextPageToken, files(id, name, size, parents, mimeType, modifiedTime, webContentLink, webViewLink)",
        // q: `'${fileId}' in parents`,
      },
      (err, response) => {
        if (err) throw err;
        const files = response.data.files;
        if (files.length) {
          files.map((file) => {
            // console.log("list file: ", file);
            // console.log("response API: ", files);
          });
          res.send(files);
          // console.log("Request Body: ", req.body._fileId);
          // console.log("_FileId: ", _fileId);
        } else {
          console.log("No Files found");
        }
      }
    );
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", (req, res) => {
  // const auth = new GoogleAuth({
  //   keyFile: KEYFILEPATH || process.env.KEYFILEPATH,
  //   scopes: SCOPES,
  // });

  const drive = google.drive({ version: "v3", auth });
  const _id = req.params.id;
  // const fileId = "1C_iW0bT6LZDT_4FGVx2ci55bdI1-K0L-"; // Desired file id to download from  google drive

  // Deleting the image from Drive
  drive.files
    .delete({
      fileId: _id,
      fields: "nextPageToken, files(id, name, parents, mimeType, modifiedTime)",
    })
    .then(
      async function (response) {
        res.status(200).send(`file id ${_id} has been deleted`);
        // res.status(204).send({ status: "success" });
        // console.log("delete response: ", response);
      },
      function (err) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Deletion Failed for some reason" }] });
      }
    );
});

module.exports = router;
