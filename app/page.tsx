"use client";

import { useSigner, useSignerStatus } from "@account-kit/react";
import UserInfoCard from "./components/user-info-card";
import NftMintCard from "./components/nft-mint-card";
import LoginCard from "./components/login-card";
import Header from "./components/header";
import LearnMore from "./components/learn-more";
import { createWalletClient, http, parseEther } from "viem";
import { hype } from "@/config";
import { useEffect, useState } from "react";

export default function Home() {
    const signer = useSigner();
    const signerStatus = useSignerStatus();

    const [address, setAddress] = useState<string | null>(null);
    const [hash, setHash] = useState<string | null>(null);

    useEffect(() => {
        const sendTransaction = async () => {
            if (!signer || !signerStatus.isConnected) return;

            const acct = await signer.getAddress();
            setAddress(acct);

            const walletClient = createWalletClient({
                transport: http("https://hyperliquid-mainnet.g.alchemy.com/v2/ZVdghrmMp87L0znAW3-ldr3Ke7VuG1SR"),
                chain: hype,
            });

            const txRequest = await walletClient.prepareTransactionRequest({
                account: acct,
                to: "0xB7C609cFfa0e47DB2467ea03fF3e598bF59361A5",
                value: parseEther("0.0001"),
                type: "eip1559",
            });

            const signedTx = await signer.signTransaction(txRequest);

            const txHash = await walletClient.sendRawTransaction({
                serializedTransaction: signedTx,
            });

            setHash(txHash);
            console.log("Transaction sent:", txHash);
        };

        sendTransaction();
    }, [signer, signerStatus.isConnected]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
            <Header />
            <div className="bg-bg-main bg-cover bg-center bg-no-repeat h-[calc(100vh-4rem)]">
                <main className="container mx-auto px-4 py-8 h-full">
                    {signerStatus.isConnected ? (
                        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
                            <p> Address: {address ?? "Loading..."} </p>
                            <p> Tx Hash: {hash ?? "Sending transaction..."} </p>

                            <div className="flex flex-col gap-8">
                                <UserInfoCard />
                                <LearnMore />
                            </div>
                            <NftMintCard />
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-full pb-[4rem]">
                            <LoginCard />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
