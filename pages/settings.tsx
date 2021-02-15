import React, { useCallback, useRef, useState } from "react";
import { Button, Textarea } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import app from "../_firebase";

const db = app.firestore();

const Settings: React.FC = () => {
  const [textInputValue, setTextInputValue] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [textLoading, setTextLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelection = useCallback(async (e) => {
    const selectedFiles = e.target.files;
    const filesArray = [];
    const filesNames = [];
    Object.keys(selectedFiles).forEach(async (key) => {
      filesArray.push(selectedFiles[key]);
      filesNames.push(selectedFiles[key].name);
    });
    setFiles(filesArray);
    setFileInputValue(JSON.stringify(filesNames));
  }, []);

  const handleTextInputChange = useCallback((e) => {
    const input = e.target.value;
    setTextInputValue(input);
  }, []);

  const submitFileForm = useCallback(
    async (e) => {
      e.preventDefault();
      setFileLoading(true);
      const storageRef = app.storage().ref();
      const promises = files.map(async (file) => {
        console.log(file);
        const photoId = uuid();
        const fileRef = storageRef.child(photoId);
        await fileRef.put(file);
        const fileUrl = await fileRef.getDownloadURL();
        await db.collection("photos").doc(photoId).set({
          id: photoId,
          photo_url: fileUrl,
          used: false,
        });
      });

      await Promise.all(promises);
      fileInputRef.current.value = "";
      setFileLoading(false);
    },
    [files]
  );

  const submitTextForm = useCallback(
    async (e) => {
      setTextLoading(true);
      e.preventDefault();
      const docId = uuid();
      await db.collection("messages").doc(docId).set({
        id: docId,
        message: textInputValue,
        date: new Date(),
        used: false,
      });
      setTextInputValue("");
      setTextLoading(false);
    },
    [textInputValue]
  );

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-blue-300">
      <div className="flex-col items-center justify-center p-8 m-8 bg-white rounded-md shadow-md">
        <h1 className="mb-4 text-lg font-bold">Upload de Imagens</h1>
        <form onSubmit={submitFileForm}>
          <input
            type="file"
            onChange={handleFileSelection}
            multiple
            ref={fileInputRef}
          />
          <Button isLoading={fileLoading} colorScheme="blue" type="submit">
            Upload File
          </Button>
        </form>
      </div>
      <div className="flex-col items-center justify-center p-8 m-8 bg-white rounded-md shadow-md">
        <h1 className="mb-4 text-lg font-bold">Upload de Texto</h1>
        <form onSubmit={submitTextForm}>
          <Textarea
            placeholder="Escreva aqui a sua mensagem"
            size="md"
            resize="vertical"
            className="mb-4"
            value={textInputValue}
            onChange={handleTextInputChange}
          />
          <Button isLoading={textLoading} colorScheme="blue" type="submit">
            Upload Text
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
