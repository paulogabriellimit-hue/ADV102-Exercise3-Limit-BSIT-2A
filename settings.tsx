import React, { useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";

export default function Settings() {
  const [questions, setQuestions] = useState<string[]>([
    "What is HTML stand for?",
    "Which of the following are JavaScript frameworks?",
    "Is CSS used for styling web pages?",
    "What is the primary purpose of Git?",
    "Which of these are popular databases?",
    "Which keyword defines a function in Python?",
    "What does OOP stand for?",
    "Which loop is guaranteed to execute at least once?",
    "Which symbol is used for equality comparison in most languages?",
    "What does IDE stand for?",
    "Which data structures use FIFO and LIFO?",
    "Which keyword is used to create a class in Python?",
    "Which operator is used for logical AND?",
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [timer, setTimer] = useState(60);

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion("");
    }
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Quiz Items</Text>
      <FlatList
        data={questions}
        renderItem={({ item, index }) => (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>{item}</Text>
            <Button title="Delete" onPress={() => deleteQuestion(index)} />
          </View>
        )}
      />
      <TextInput
        placeholder="Add new question"
        value={newQuestion}
        onChangeText={setNewQuestion}
      />
      <Button title="Add Question" onPress={addQuestion} />

      <Text style={{ marginTop: 20 }}>Quiz Timer (seconds)</Text>
      <TextInput
        keyboardType="numeric"
        value={String(timer)}
        onChangeText={(val) => setTimer(Number(val))}
      />
    </View>
  );
}
