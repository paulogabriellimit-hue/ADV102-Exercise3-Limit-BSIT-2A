import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { questions } from "./questions";

export default function QuizApp() {
  const [screen, setScreen] = useState("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const startQuiz = () => {
    setScreen("quiz");
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
  };

  const selectAnswer = (qId: string, choice: string) => {
    const q = questions[currentIndex];
    if (q.type === "checkbox") {
      const current = answers[qId] || [];
      const updated = current.includes(choice)
        ? current.filter((a: string) => a !== choice)
        : [...current, choice];
      setAnswers({ ...answers, [qId]: updated });
    } else {
      setAnswers({ ...answers, [qId]: choice });
    }
  };

  const isSelected = (qId: string, choice: string) => {
    const q = questions[currentIndex];
    if (q.type === "checkbox") {
      return answers[qId]?.includes(choice) || false;
    }
    return answers[qId] === choice;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const finishQuiz = () => {
    let finalScore = 0;
    questions.forEach((q: any) => {
      const userAns = answers[q.id];
      if (q.type === "checkbox") {
        if (Array.isArray(userAns) && Array.isArray(q.answer)) {
          const sortedUserAns = [...userAns].sort((a: string, b: string) =>
            a.localeCompare(b),
          );
          const sortedAnswer = [...q.answer].sort((a: string, b: string) =>
            a.localeCompare(b),
          );
          if (JSON.stringify(sortedUserAns) === JSON.stringify(sortedAnswer)) {
            finalScore++;
          }
        }
      } else if (userAns === q.answer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    if (finalScore > highScore) setHighScore(finalScore);
    setScreen("results");
  };

  const getQuestionTypeLabel = (type: string): string => {
    if (type === "checkbox") return "✓ Multiple Select";
    if (type === "truefalse") return "⊤⊥ True/False";
    return "○ Multiple Choice";
  };

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (screen === "home") {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.gradient, { backgroundColor: "#667eea" }]}>
          <View style={styles.homeContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🎯</Text>
            </View>
            <Text style={styles.title}>Quiz App</Text>
            <Text style={styles.subtitle}>
              Challenge yourself with {questions.length} engaging questions
            </Text>

            {highScore > 0 && (
              <View style={styles.highScoreCard}>
                <Text style={styles.highScoreLabel}>Best Score</Text>
                <Text style={styles.highScoreValue}>
                  {highScore}/{questions.length}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (screen === "quiz") {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.gradient, { backgroundColor: "#667eea" }]}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.quizContainer}>
              {/* Progress Section */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>
                    Question {currentIndex + 1} of {questions.length}
                  </Text>
                  <Text style={styles.progressPercent}>
                    {Math.round(progress)}%
                  </Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[styles.progressBar, { width: `${progress}%` }]}
                  />
                </View>
              </View>

              {/* Question Card */}
              <View style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionType}>
                    {getQuestionTypeLabel(currentQ.type)}
                  </Text>
                </View>
                <Text style={styles.questionText}>{currentQ.question}</Text>

                <View style={styles.optionsContainer}>
                  {Object.entries(currentQ.choices).map(
                    ([key, value]: [string, any]) => {
                      const selected = isSelected(currentQ.id, key);
                      return (
                        <TouchableOpacity
                          key={key}
                          style={[
                            styles.optionButton,
                            selected && styles.optionButtonSelected,
                          ]}
                          onPress={() => selectAnswer(currentQ.id, key)}
                        >
                          <View style={styles.optionContent}>
                            <View
                              style={[
                                currentQ.type === "checkbox"
                                  ? styles.checkbox
                                  : styles.radio,
                                selected &&
                                  (currentQ.type === "checkbox"
                                    ? styles.checkboxSelected
                                    : styles.radioSelected),
                              ]}
                            >
                              {selected && (
                                <Text style={styles.checkmark}>
                                  {currentQ.type === "checkbox" ? "✓" : "●"}
                                </Text>
                              )}
                            </View>
                            <View style={styles.optionTextContainer}>
                              <Text style={styles.optionKey}>{key}.</Text>
                              <Text style={styles.optionText}>
                                {String(value)}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </View>
              </View>

              {/* Navigation Buttons */}
              <View style={styles.navigationContainer}>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    styles.prevButton,
                    currentIndex === 0 && styles.navButtonDisabled,
                  ]}
                  onPress={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <Text
                    style={[
                      styles.navButtonText,
                      currentIndex === 0 && styles.navButtonTextDisabled,
                    ]}
                  >
                    ← Previous
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={handleNext}
                >
                  <Text style={styles.nextButtonText}>
                    {currentIndex === questions.length - 1
                      ? "Finish"
                      : "Next →"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  // RESULTS SCREEN
  if (screen === "results") {
    const percentage = Math.round((score / questions.length) * 100);
    const isNewHigh = score === highScore && score > 0;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.gradient, { backgroundColor: "#667eea" }]}>
          <ScrollView contentContainerStyle={styles.resultsScrollContent}>
            <View style={styles.resultsContainer}>
              <View style={styles.trophyContainer}>
                <Text style={styles.trophy}>{isNewHigh ? "🏆" : "⭐"}</Text>
              </View>
              <Text style={styles.resultsTitle}>Quiz Complete!</Text>

              {isNewHigh && (
                <Text style={styles.newHighScore}>🎉 New High Score! 🎉</Text>
              )}

              <View style={styles.scoreCard}>
                <Text style={styles.scoreLabel}>Your Score</Text>
                <Text style={styles.scoreValue}>
                  {score}/{questions.length}
                </Text>
                <Text style={styles.scorePercent}>{percentage}%</Text>
              </View>

              <View style={styles.highScoreResultCard}>
                <Text style={styles.highScoreResultLabel}>Highest Score</Text>
                <Text style={styles.highScoreResultValue}>
                  {highScore}/{questions.length}
                </Text>
              </View>

              <Text style={styles.performanceMessage}>
                {percentage === 100 && "Perfect! You're a quiz master! 🌟"}
                {percentage >= 80 &&
                  percentage < 100 &&
                  "Excellent work! Keep it up! 👏"}
                {percentage >= 60 &&
                  percentage < 80 &&
                  "Good job! You're doing great! 👍"}
                {percentage >= 40 &&
                  percentage < 60 &&
                  "Not bad! Practice makes perfect! 💪"}
                {percentage < 40 &&
                  "Keep trying! You'll do better next time! 📚"}
              </Text>

              <TouchableOpacity style={styles.retryButton} onPress={startQuiz}>
                <Text style={styles.retryButtonText}>🔄 Try Again</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.9,
  },
  highScoreCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    minWidth: 200,
    alignItems: "center",
  },
  highScoreLabel: {
    fontSize: 14,
    color: "#764ba2",
    fontWeight: "600",
    marginBottom: 5,
  },
  highScoreValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#667eea",
  },
  startButton: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#667eea",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  quizContainer: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  progressPercent: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionHeader: {
    marginBottom: 15,
  },
  questionType: {
    fontSize: 12,
    color: "#667eea",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
  },
  optionButtonSelected: {
    borderColor: "#667eea",
    backgroundColor: "#f0f4ff",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioSelected: {
    borderColor: "#667eea",
    backgroundColor: "#667eea",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    borderColor: "#667eea",
    backgroundColor: "#667eea",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionTextContainer: {
    flex: 1,
    flexDirection: "row",
  },
  optionKey: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  prevButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  nextButton: {
    backgroundColor: "#fff",
  },
  navButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  navButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.3)",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#667eea",
  },
  resultsScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  resultsContainer: {
    alignItems: "center",
  },
  trophyContainer: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  trophy: {
    fontSize: 60,
  },
  resultsTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  newHighScore: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: 20,
    textAlign: "center",
  },
  scoreCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 25,
    marginBottom: 15,
    minWidth: 250,
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#764ba2",
    fontWeight: "600",
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: 5,
  },
  scorePercent: {
    fontSize: 20,
    fontWeight: "600",
    color: "#764ba2",
  },
  highScoreResultCard: {
    backgroundColor: "rgba(255, 215, 0, 0.9)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    minWidth: 200,
    alignItems: "center",
  },
  highScoreResultLabel: {
    fontSize: 12,
    color: "#996600",
    fontWeight: "600",
    marginBottom: 5,
  },
  highScoreResultValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#664400",
  },
  performanceMessage: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#667eea",
  },
});
