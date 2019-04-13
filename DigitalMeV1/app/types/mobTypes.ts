import { InfoAttribute, AuthorizeInfoRequestInput } from "../api/api_ml";
import { requestTypes, requestAttributes } from "../api/requestItems";
import * as utils from "../utils";

export type User = {
  name: string;
  username: string;
  password: string;
  pin: number;
  image: string;
};

export type Booking = {
  bookingId: string;
  airlineId: string;
  loungeAccess: string;
  shopNotifications: string;
  travelType: string;
  travelDate: string;
};

export type Passport = {
  documentNumber: string;
  issueDate: string;
  issueCountry: string;
  expiryDate: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;

  documentImage: string;
  faceImage: string;

  // data from ML
  mobValidUntil?: string;
  mobIdToken?: string;
};

export type MobState = {
  user: User | null;
  passport: Passport | null;
  booking: Booking | null;
  apiCallsInProgress: number;
};

export function attributesToInfo(
  item: string,
  passport: Passport,
  booking: Booking
): InfoAttribute {
  let infoAttribute: InfoAttribute = {
    name: item,
    value: "unknown"
  } as InfoAttribute;

  switch (item) {
    case requestAttributes.FirstName:
      infoAttribute.value = passport.firstName;
      break;
    case requestAttributes.LastName:
      infoAttribute.value = passport.lastName;
      break;
    case requestAttributes.BirthDate:
      infoAttribute.value = utils.toIsoDateString(passport.dateOfBirth);
      break;
    case requestAttributes.Nationality:
      infoAttribute.value = passport.issueCountry;
      break;
    case requestAttributes.PassportNumb:
      infoAttribute.value = passport.documentNumber;
      break;
    case requestAttributes.PassportExpiryDate:
      infoAttribute.value = utils.toIsoDateString(passport.expiryDate);
      break;
    case requestAttributes.Picture:
      infoAttribute.value = passport.faceImage;
      infoAttribute.isEncodedBase64 = true;
      break;
    case requestAttributes.BookingId:
      infoAttribute.value = booking.bookingId;
      break;
    case requestAttributes.AirlineId:
      infoAttribute.value = booking.airlineId;
      break;
    case requestAttributes.LoungeAccess:
      infoAttribute.value = booking.loungeAccess;
      break;
    case requestAttributes.ShopNotifications:
      infoAttribute.value = booking.shopNotifications;
      break;
    case requestAttributes.TravelType:
      infoAttribute.value = booking.travelType;
      break;
    case requestAttributes.TravelDate:
      infoAttribute.value = utils.toIsoDateString(booking.travelDate);
      break;
  }
  return infoAttribute;
}
