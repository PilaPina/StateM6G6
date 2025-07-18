"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Button from "../components/Button";
import Modal from "../components/modal/Modal";

// Helper to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface WordDoc {
  id: string;
  word: string;
}

export default function DatabaseStatus() {
  const [status, setStatus] = useState<string>("Loading…");
  const [words, setWords] = useState<WordDoc[]>([]);
  const [displayWords, setDisplayWords] = useState<WordDoc[]>([]);
  const [editing, setEditing] = useState<WordDoc | null>(null);
  const [newWord, setNewWord] = useState<string>("");

  // helpers
  const refreshDisplayWords = (base: WordDoc[]) =>
    setDisplayWords(shuffle(base).slice(0, 4));

  const handleError = (err: unknown, context: string) => {
    console.error(`[${context}]`, err);
    setStatus(`${context} failed`);
  };

  // inital fetch to get words from the database
  useEffect(() => {
    fetch("/api/database")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setWords(d.words as WordDoc[]);
        refreshDisplayWords(d.words as WordDoc[]);
        setStatus(d.message ?? "Connected");
      })
      .catch((e) => handleError(e, "initial fetch"));
  }, []);

  // Create, Update, Delete operations
  async function addWord() {
    const w = newWord.trim();
    if (!w) return;
    try {
      const res = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: w }),
      });
      const doc = await res.json();
      if (doc.error) throw new Error(doc.error);
      const next = [...words, doc as WordDoc];
      setWords(next);
      refreshDisplayWords(next);
      setNewWord("");
    } catch (e) {
      handleError(e, "add");
    }
  }

  async function saveWord() {
    if (!editing) return;
    try {
      const res = await fetch("/api/database", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const doc = await res.json();
      if (doc.error) throw new Error(doc.error);
      const next = words.map((w) => (w.id === doc.id ? doc : w));
      setWords(next);
      refreshDisplayWords(next);
      setEditing(null);
    } catch (e) {
      handleError(e, "update");
    }
  }

  async function deleteWord(id: string) {
    try {
      const res = await fetch("/api/database", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const doc = await res.json();
      if (doc.error) throw new Error(doc.error);
      const next = words.filter((w) => w.id !== id);
      setWords(next);
      refreshDisplayWords(next);
    } catch (e) {
      handleError(e, "delete");
    }
  }

  return (
    <main className={styles.main}>
      <h2>Are we connected?</h2>
      <h3 className={styles.status}>{status}</h3>

      <ul className={styles.wordList}>
        {displayWords.map((w) => (
          <li key={w.id}>
            <span className={styles.wordText}>{w.word}</span>
            {words.length > 0 && (
              <div className={styles.itemActions}>
                <Button onClick={() => setEditing(w)}>Edit</Button>
                <Button onClick={() => deleteWord(w.id)}>Delete</Button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {words.length > 0 && (
        <div className={styles.inputActions}>
          <input
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Add a new word"
            type="text"
            className={styles.input}
          />
          <Button onClick={addWord}>Add</Button>
          <Button onClick={() => refreshDisplayWords(words)}>Shuffle</Button>
        </div>
      )}

      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
      >
        <h3>EDIT WORD</h3>
        <input
          value={editing?.word ?? ""}
          onChange={(e) =>
            setEditing((prev) =>
              prev ? { ...prev, word: e.target.value } : null
            )
          }
          className={styles.input}
          style={{ width: "100%", margin: "2em 0", padding: "2em" }}
        />
        <Button onClick={saveWord}>Save</Button>
      </Modal>
    </main>
  );
}
