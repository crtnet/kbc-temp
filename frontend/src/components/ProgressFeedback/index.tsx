import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { ProgressFeedbackProps } from "./types";

export const ProgressFeedback: React.FC<ProgressFeedbackProps> = ({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}) => {
  const progressWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: (currentStep / totalSteps) * 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps]);

  const getStepStyle = (index: number) => {
    const step = steps[index];
    if (step.hasError) return styles.stepError;
    if (step.completed) return styles.stepCompleted;
    if (index + 1 === currentStep) return styles.stepCurrent;
    return styles.stepIncomplete;
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progress,
            {
              width: progressWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={index}
            style={styles.step}
            onPress={() => onStepClick?.(index + 1)}
            disabled={!onStepClick}
          >
            <View style={[styles.stepCircle, getStepStyle(index)]}>
              {step.completed ? (
                <MaterialIcons name="check" size={18} color="#FFF" />
              ) : (
                <Text style={styles.stepNumber}>{index + 1}</Text>
              )}
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            {step.hint && <Text style={styles.hint}>{step.hint}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
