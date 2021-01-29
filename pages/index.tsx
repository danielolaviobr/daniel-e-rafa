import React from "react";
import { Button, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
// import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { format } from "date-fns";
import axios from "axios";
import { GetServerSideProps } from "next";
import { Html } from "next/document";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/random-message`
  );
  return {
    props: { ...response.data },
  };
};

interface HomeProps {
  message: string;
  date: string;
}

export default function Home({
  message = "A interet ta meio ruim, mas eu te amo",
  date = format(new Date(), "dd/MM/yyyy"),
}: HomeProps) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <title>Daniel ❤️ Rafa</title>
        <meta name="description" content="Um historia de amor" />
      </Head>
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-blue-300">
        <div className="flex flex-col items-center justify-center px-12 py-8 m-4 bg-white rounded-lg shadow-md">
          <Heading fontSize="6xl" className="mb-4 font-bold">
            Daniel & Rafa
          </Heading>
          <div className="flex flex-col mb-8">
            <Text className="mb-4 text-xl">"{message}"</Text>
            <Text className="self-end text-sm">- Daniel Olavio Ferreira</Text>
            <Text className="self-end text-xs"> {date}</Text>
          </div>

          <Link href="/photo">
            <Button colorScheme="blue" width="200px" size="lg">
              Matar saudade
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
