import React from "react";
import {
  AccessibilityState,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import Colors from "../constants/Colors";

export interface IButtonProps {
  /**
   * Text to display inside the button
   */
  title: string;

  /**
   * Handler to be called when the user taps the button
   */
  onPress: (event?: any) => void;

  /**
   * Color of the text (iOS), or background color of the button (Android)
   */
  color?: string;

  /**
   * TV preferred focus (see documentation for the View component).
   */
  hasTVPreferredFocus?: boolean;

  /**
   * Text to display for blindness accessibility features
   */
  accessibilityLabel?: string;

  /**
   * If true, disable all interactions for this component.
   */
  disabled?: boolean;

  /**
   * Used to locate this view in end-to-end tests.
   */
  testID?: string;
}

export default class Button extends React.Component<IButtonProps> {
  render() {
    const {
      accessibilityLabel,
      color,
      onPress,
      title,
      disabled,
      testID
    } = this.props;
    const buttonStyles: any = [styles.button];
    const textStyles: any = [styles.text];
    if (color) {
      if (Platform.OS === "ios") {
        textStyles.push({ color });
      } else {
        buttonStyles.push({ backgroundColor: color });
      }
    }
    const accessibilityStates: AccessibilityState[] = [];
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
      accessibilityStates.push("disabled");
    }
    const formattedTitle: string =
      Platform.OS === "android" ? title.toUpperCase() : title;
    return (
      <TouchableOpacity
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityStates={accessibilityStates}
        testID={testID}
        disabled={disabled}
        onPress={onPress}
      >
        <View style={buttonStyles}>
          <Text style={textStyles}>{formattedTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles: any = StyleSheet.create({
  button: Platform.select({
    android: {
      backgroundColor: Colors.secondary,
      borderRadius: 50,
      elevation: 2
      // Material design blue from https://material.google.com/style/color.html#color-color-palette
    },
    ios: {}
  }),
  buttonDisabled: Platform.select({
    android: {
      backgroundColor: Colors.secondaryLight,
      elevation: 0
    },
    ios: {}
  }),
  text: {
    padding: 8,
    textAlign: "center",
    ...Platform.select({
      android: {
        color: "white",
        fontWeight: "500"
      },
      ios: {
        // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
        color: Colors.primaryDark,
        fontSize: 28
      }
    })
  },
  textDisabled: Platform.select({
    android: {
      color: Colors.secondaryDark
    },
    ios: {
      color: Colors.primaryLight
    }
  })
});
