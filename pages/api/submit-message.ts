import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import app from "../../_firebase";

const db = app.firestore();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { message } = req.body;
  const docId = uuid();
  await db.collection("messages").doc(docId).set({
    id: docId,
    message: message,
    date: new Date(),
    used: false,
  });
  res.status(200);
  return;
};
