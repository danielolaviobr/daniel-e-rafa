import { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";
import app from "../_firebase";

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

  res.json({ ...selectedPhoto });
  return;
};
