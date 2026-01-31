import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { useQuiz } from "./quizcontext";

export default function Preview() {
  const { questions, timer } = useQuiz();
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }
    const interval = setInterval(() => setTimeLeft((t: number) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const submitQuiz = () => {
    alert("Time’s up! Quiz submitted.");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Time Left: {timeLeft}s</Text>
      <Text>Questions: {questions.length}</Text>
      <Button title="Submit Quiz" onPress={submitQuiz} />
    </View>
  );
}
