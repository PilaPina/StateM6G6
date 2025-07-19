"use client";

import { useState } from "react";
import styles from "./page.module.css";
import DatabaseStatus from "./database/page";
import Button from "./components/Button";

export default function Home() {
  const [showDatabase, setShowDatabase] = useState(false);

  return (
    <div className={styles.page}>
      <header>
        <div className={styles.header}>
          <h1 className={styles.title}>State Management</h1>
        </div>
      </header>
      <main className={styles.main}>
        <Button onClick={() => setShowDatabase((prev) => !prev)}>
          {showDatabase ? "Hide Words" : "Click me!"}
        </Button>
        <div>{showDatabase && <DatabaseStatus />}</div>
      </main>
    </div>
  );
}
