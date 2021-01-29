import { NextApiRequest, NextApiResponse } from "next";
import sizeOf from "image-size";
var url = require("url");
var https = require("https");
import app from "../../_firebase";

const db = app.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const unusedMessages = await db
    .collection("photos")
    .where("used", "==", false)
    .get();

  const photos = [];

  if (!unusedMessages.empty) {
    unusedMessages.forEach((photo) => photos.push(photo.data()));
  } else {
    await db
      .collection("photos")
      .get()
      .then((snapshot) => {
        snapshot.forEach((photo) => {
          photo.ref.update({
            used: false,
          });
          photos.push(photo.data());
        });
      });
  }

  const randomIndex = Math.floor(Math.random() * photos.length);
  const selectedPhoto = photos[randomIndex];

  if (selectedPhoto.used === false) {
    await db.collection("photos").doc(selectedPhoto.id).update({ used: true });
  }

  var imgUrl = selectedPhoto.photo_url;
  var options = url.parse(imgUrl);

  https.get(options, function (response) {
    var chunks = [];
    response
      .on("data", function (chunk) {
        chunks.push(chunk);
      })
      .on("end", function () {
        var buffer = Buffer.concat(chunks);
        console.log(sizeOf(buffer));
      });
  });

  res.json({ ...selectedPhoto });
  return;
};
