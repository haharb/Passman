import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import Locker from "../components/Locker";
import { NextPage } from "next/types";

export interface LockerItem {
  service: string;
  login: string;
  password: string;
}

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  const [step, setStep] = useState<"login" | "register" | "locker">("login");
  const [locker, setLocker] = useState<LockerItem[]>([]);
  const [lockerKey, setLockerKey] = useState("");

  useEffect(() => {
    const lockerKey = window.sessionStorage.getItem("lockerKey");
    const locker = window.sessionStorage.getItem("locker");

    if (locker) {
      try {
        const parsedLocker = JSON.parse(locker);
        setLocker(parsedLocker);
      } catch (error) {
        console.error("Error parsing locker JSON:", error);
      }
    }

    if (lockerKey) {
      setLockerKey(lockerKey);
      setStep("locker");
    }
  }, []);

  return (
    <div className={`${styles.container} ${inter.className}`}>
      <Head>
        <title>Password Manager</title>
        <meta name="description" content="Secure password manager" />
        <link rel="icon" href="/favicon.ico" />
        </Head>
      <main className={styles.main}>
        {step === "register" && (
          <RegisterForm setStep={setStep} setLockerKey={setLockerKey} />
        )}
        {step === "login" && (
          <LoginForm
            setLocker={setLocker}
            setStep={setStep}
            setLockerKey={setLockerKey}
          />
        )}
        {step === "locker" && (
          <Locker locker={locker} lockerKey={lockerKey} setStep={setStep} />
        )}
      </main>
    </div>
  );
};

export default Home;

