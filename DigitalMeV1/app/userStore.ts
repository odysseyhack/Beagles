import { AsyncStorage } from "react-native";
import { dto } from "./types/apiTypes";

const userkey: string = "user";

export async function hasUserAsync(): Promise<boolean> {
  return (await AsyncStorage.getItem(userkey)) !== null;
}

export async function getUserAsync(): Promise<dto.SignInResponse | null> {
  const user: string | null = await AsyncStorage.getItem(userkey);
  if (user) {
    return JSON.parse(user) as dto.SignInResponse;
  } else {
    return null;
  }
}

export function clearUserAsync(): Promise<void> {
  //   return AsyncStorage.clear();
  return AsyncStorage.removeItem(userkey);
}

export async function setUser(user: dto.SignInResponse): Promise<void> {
  const userString: string = JSON.stringify(user);
  return AsyncStorage.setItem(userkey, userString);
}
