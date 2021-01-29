import React, { useCallback, useEffect, useState } from "react";
import { Button, Heading } from "@chakra-ui/react";
import { FiCamera } from "react-icons/fi";
import axios from "axios";
import { GetServerSideProps } from "next";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { Html } from "next/document";
import Image from "next/image";

export const getServerSideProps: GetServerSideProps = async (context) => {
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

const stockPhoto = process.env.NEXT_PUBLIC_STOCK_IMAGE;

const Photo: React.FC<PhotoProps> = ({ photo_url = stockPhoto }) => {
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
        <Heading>Daniel ❤️ Rafa</Heading>
        <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
          <AnimatePresence>
            {!isLoading && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-h-full m-4 rounded shadow-md"
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
