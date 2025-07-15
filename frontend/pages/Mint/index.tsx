import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Spline from '@splinetool/react-spline';

import { Header } from "@/components/Header";

import { Layout } from "antd";
import "../../App.css"; // Create a separate CSS file for styling if needed.

const { Footer } = Layout;

export function Mint() {
  const queryClient = useQueryClient();
  const { account } = useWallet();
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [account, queryClient]);

  return (
    <>
      <Header />
      <div style={{ overflow: "hidden" }} className="overflow-hidden">
        <div className="absolute text-center w-full flex flex-col justify-center">
          <h1 className="text-4xl text-center text-white mt-14 font-mono font-semibold ">Welcome to the Scholarship Platform</h1>
          <p className="text-center mt-5 text-white text-lg font-mono">Create and apply for scholarships</p>
        </div>
        <div className='h-[85vh] w-full -z-10'>
          <Spline
            className="h-[100vh] w-full zoom-in-100"
            scene="https://prod.spline.design/dIPlgDtwDugutoe3/scene.splinecode"
          />
        </div>
        <Footer className="footer relative bottom-0">APTScholar©2025 | All Rights Reserved</Footer>
      </div>
    </>
  );
}
