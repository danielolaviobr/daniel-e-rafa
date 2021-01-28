import { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";
import app from "../_firebase";

interface Message {
  id: string;
  message: string;
  date: string;
  used: boolean;
}

const db = app.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const unusedMessages = await db
    .collection("messages")
    .where("used", "==", false)
    .get();

  const messages = [];

  if (!unusedMessages.empty) {
    unusedMessages.forEach((message) => messages.push(message.data()));
  } else {
    await db
      .collection("messages")
      .get()
      .then((snapshot) => {
        snapshot.forEach((message) => {
          message.ref.update({
            used: false,
          });
          messages.push(message.data());
        });
      });
  }

  const randomIndex = Math.floor(Math.random() * messages.length);
  const selectedMessage = messages[randomIndex];

  selectedMessage.date = format(
    new Date(selectedMessage.date.seconds * 1000),
    "dd/MM/yyyy"
  );

  if (selectedMessage.used === false) {
    await db
      .collection("messages")
      .doc(selectedMessage.id)
      .update({ used: true });
  }

  res.json({ ...selectedMessage });
  return;
};
