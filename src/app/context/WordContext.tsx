"use client";
import { createContext, useContext, useReducer } from "react";

export interface WordDoc {
  id: string;
  word: string;
}

type State = {
  words: WordDoc[];
  editing: WordDoc | null;
};

type Action =
  | { type: "SET_WORDS"; payload: WordDoc[] }
  | { type: "ADD_WORD"; payload: WordDoc }
  | { type: "UPDATE_WORD"; payload: WordDoc }
  | { type: "DELETE_WORD"; payload: string }
  | { type: "SET_EDITING"; payload: WordDoc | null };

function wordReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_WORDS":
      return { ...state, words: action.payload };
    case "ADD_WORD":
      return { ...state, words: [...state.words, action.payload] };
    case "UPDATE_WORD":
      return {
        ...state,
        words: state.words.map((w) =>
          w.id === action.payload.id ? action.payload : w
        ),
      };
    case "DELETE_WORD":
      return {
        ...state,
        words: state.words.filter((w) => w.id !== action.payload),
      };
    case "SET_EDITING":
      return { ...state, editing: action.payload };
    default:
      return state;
  }
}

interface WordContextType extends State {
  dispatch: React.Dispatch<Action>;
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export function WordProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wordReducer, {
    words: [],
    editing: null,
  });

  return (
    <WordContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WordContext.Provider>
  );
}

export function useWordContext() {
  const ctx = useContext(WordContext);
  if (!ctx) throw new Error("useWordContext must be used within WordProvider");
  return ctx;
}