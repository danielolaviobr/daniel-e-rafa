import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";
import { FiCamera } from "react-icons/fi";
import axios from "axios";
import Link from "next/link";
import { GetStaticProps } from "next";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/random-photo`
  );
  return {
    props: { ...response.data },
  };
};

interface PhotoProps {
  photo_url: string;
}

const Photo: React.FC<PhotoProps> = ({
  photo_url = "https://firebasestorage.googleapis.com/v0/b/daniel-e-rafa.appspot.com/o/0fa6d0cc-b418-4a2d-85e5-efa0c4ae6213?alt=media&token=96d9c024-e912-485f-9628-8446a8b3e0bf",
}) => {
  const [photo, setPhoto] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPhoto(photo_url);
    setIsLoading(false);
  }, []);

  const updatePhoto = useCallback(async () => {
    setIsLoading(true);
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/random-photo`
    );

    setPhoto(response.data.photo_url);
    setIsLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Daniel ❤️ Rafa</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen p-8 overflow-hidden bg-blue-300">
        <div className="flex flex-col items-center justify-center h-screen p-8 overflow-hidden">
          <AnimatePresence>
            {!isLoading && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-h-full rounded shadow-md margin-4"
                src={photo}
                alt="Daniel e Rafa"
              />
            )}
          </AnimatePresence>
        </div>

        <Button
          type="button"
          className="m-8"
          onClick={updatePhoto}
          isLoading={isLoading}>
          <FiCamera className="mr-2" />
          Nova Foto
        </Button>
      </div>
    </>
  );
};

export default Photo;
