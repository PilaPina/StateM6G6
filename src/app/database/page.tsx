"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Button from "../components/Button";
import Modal from "../components/modal/Modal";
import { useWordContext, WordDoc } from "../context/WordContext";

// Helper to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function DatabaseStatus() {
  const { words, editing, dispatch } = useWordContext();
  const [status, setStatus] = useState<string>("Loading…");
  const [displayWords, setDisplayWords] = useState<WordDoc[]>([]);
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
        dispatch({ type: "SET_WORDS", payload: d.words as WordDoc[] });
        refreshDisplayWords(d.words as WordDoc[]);
        setStatus(d.message ?? "Connected");
      })
      .catch((e) => handleError(e, "initial fetch"));
  }, []);

  // Update displayWords when words change
  useEffect(() => {
    refreshDisplayWords(words);
  }, [words]);

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
      dispatch({ type: "ADD_WORD", payload: doc as WordDoc });
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
      dispatch({ type: "UPDATE_WORD", payload: doc as WordDoc });
      dispatch({ type: "SET_EDITING", payload: null });
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
      dispatch({ type: "DELETE_WORD", payload: id });
    } catch (e) {
      handleError(e, "delete");
    }
  }

  return (
    <main className={styles.main}>
      <h2>Are we connected?</h2>
      <h3 className={styles.status}>{status}</h3>

      <div className={styles.wordRow}>
        {[0, 2].map((start) => (
          <div className={styles.wordColumn} key={start}>
            {displayWords.slice(start, start + 2).map((w) => (
              <div className={styles.wordItem} key={w.id}>
                <span className={styles.wordText}>{w.word}</span>
                <div className={styles.itemActions}>
                  <Button
                    onClick={() => dispatch({ type: "SET_EDITING", payload: w })}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => deleteWord(w.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <div className={styles.shuffleButton}>
          <Button onClick={() => refreshDisplayWords(words)}>
            SHUFFLE SHUFFLE
          </Button>
        </div>
        <div className={styles.inputActions}>
          <input
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Add a new word"
            type="text"
            className={styles.input}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newWord.trim()) addWord();
            }}
            style={{
              borderRadius: 8,
              padding: "0.5em 1.2em",
              fontSize: "1rem",
            }}
          />
          <Button onClick={addWord} disabled={!newWord.trim()}>
            Add
          </Button>
        </div>
      </div>

      <Modal
        isOpen={!!editing}
        onClose={() => dispatch({ type: "SET_EDITING", payload: null })}
      >
        <h3>EDIT WORD</h3>
        <input
          value={editing?.word ?? ""}
          onChange={(e) =>
            dispatch({
              type: "SET_EDITING",
              payload: editing ? { ...editing, word: e.target.value } : null,
            })
          }
          className={styles.input}
          style={{ width: "100%", margin: "2em 0", padding: "2em" }}
        />
        <Button onClick={saveWord}>Save</Button>
      </Modal>
    </main>
  );
}
