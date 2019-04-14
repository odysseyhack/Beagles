import "react-native";
import React from "react";
import renderer from "react-test-renderer";
import HomeAuthScreen from "../app/screens/HomeAuthScreen";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";

describe("HomeAuthScreen test", () => {
  jest.useFakeTimers();
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it("renders the home auth screen", async () => {
    const tree = renderer.create(<HomeAuthScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
