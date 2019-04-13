import React from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

export interface IInputProps {
  label: string;
  value: string;
  secureTextEntry: boolean;
  onChangeText: (event?: any) => void;
}

export class Input extends React.Component<IInputProps> {
  render() {
    // const { label } = this.props;
    const { label, value, secureTextEntry, onChangeText } = this.props;
    return (
      <View>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          onChangeText={onChangeText}
        />
      </View>
    );
  }
}

const styles: any = StyleSheet.create({
  label: {
    marginTop: 10,
    marginBottom: -5,
    marginLeft: 10,
    fontSize: 12,
    color: Colors.grayLight
  },
  input: {
    height: 40,
    margin: 10,
    marginTop: 0,
    color: "#000",
    borderRadius: 0,
    fontSize: 18,
    fontWeight: "400",
    borderColor: Colors.grayLight,
    borderWidth: 0,
    borderBottomWidth: 1
  }
  // input: {
  //   width: 350,
  //   height: 55,
  //   backgroundColor: "#42A5F5",
  //   margin: 10,
  //   padding: 8,
  //   color: "white",
  //   borderRadius: 0,
  //   fontSize: 18,
  //   fontWeight: "500"
  // },
});
