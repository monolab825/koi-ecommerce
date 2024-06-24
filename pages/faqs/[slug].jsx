import React from "react";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";

const GoogleAnalytics = dynamic(
  () => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
  { ssr: false }
);

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(`${process.env.BASE_URL}/api/faqs/${slug}`);
    const faq = await res.json();

    if (!faq || res.status !== 200) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        faq,
      },
    };
  } catch (error) {
    console.error("Error fetching FAQ:", error.message);
    return {
      notFound: true,
    };
  }
}

function FaqDetail({ faq }) {
  if (!faq) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>{faq.question} - FAQs - Jual Ikan Koi</title>
        <meta name="description" content={faq.answer} />
      </Head>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20 mb-16 lg:mb-20">
        <div className="bg-white shadow-md rounded-lg p-4 mt-8">
          <h1 className="text-3xl font-bold mb-4">{faq.question}</h1>
          <p className="text-gray-600">{faq.answer}</p>
          <Link href="/faqs">
            <span className="text-blue-500 hover:text-blue-600 block mt-4">
              Kembali ke Daftar FAQs
            </span>
          </Link>
        </div>
      </main>

      <GoogleAnalytics gaId="G-BKXLWYCWM3" />
    </>
  );
}

export default FaqDetail;
