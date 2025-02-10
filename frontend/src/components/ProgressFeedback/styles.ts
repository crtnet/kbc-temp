import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginBottom: 20,
  },
  progress: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  step: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepNumber: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepTitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
  stepCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepCurrent: {
    backgroundColor: "#2196F3",
  },
  stepIncomplete: {
    backgroundColor: "#E0E0E0",
  },
  stepError: {
    backgroundColor: "#F44336",
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
