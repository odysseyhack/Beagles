import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import BaseButton, { IButtonProps } from "./Button";

export const Button = (props: IButtonProps) => (
  <View style={styles.margin}>
    <BaseButton {...props} />
  </View>
);

const styles = StyleSheet.create({
  margin: {
    ...Platform.select({
      android: {
        margin: 10
      }
    })
  }
});
