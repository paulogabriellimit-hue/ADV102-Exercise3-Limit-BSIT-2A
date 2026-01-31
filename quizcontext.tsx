import React, { createContext, useContext, useMemo, useState } from "react";

type QuizContextType = {
  questions: string[];
  setQuestions: (q: string[]) => void;
  timer: number;
  setTimer: (t: number) => void;
};

const QuizContext = createContext<QuizContextType | null>(null);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [timer, setTimer] = useState(60);

  const value = useMemo(
    () => ({ questions, setQuestions, timer, setTimer }),
    [questions, setQuestions, timer, setTimer],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => useContext(QuizContext)!;
