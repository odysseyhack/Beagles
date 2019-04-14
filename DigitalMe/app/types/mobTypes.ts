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
  documentNumberSignature: string;
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
  let attribute: InfoAttribute = {
    name: item,
    value: undefined
  } as InfoAttribute;
  attribute = setPassportAttribute(attribute, passport);
  if (attribute.value === undefined) {
    attribute = setBookingAttribute(attribute, booking);
  }
  return attribute;
}

function setPassportAttribute(attr: InfoAttribute, passport: Passport): InfoAttribute {
  switch (attr) {
    case requestAttributes.FirstName:
      attr.value = passport.firstName;
      break;
    case requestAttributes.LastName:
      attr.value = passport.lastName;
      break;
    case requestAttributes.BirthDate:
      attr.value = utils.toIsoDateString(passport.dateOfBirth);
      break;
    case requestAttributes.Nationality:
      attr.value = passport.issueCountry;
      break;
    case requestAttributes.PassportNumb:
      attr.value = passport.documentNumber;
      attr.signature = passport.documentNumberSignature;
      break;
    case requestAttributes.PassportExpiryDate:
      attr.value = utils.toIsoDateString(passport.expiryDate);
      break;
    case requestAttributes.Picture:
      attr.value = passport.faceImage;
      attr.isEncodedBase64 = true;
      break;
  }
  return attr;
}

function setBookingAttribute(attr: InfoAttribute, booking: Booking): InfoAttribute {
  switch (attr.name) {
    case requestAttributes.BookingId:
      attr.value = booking.bookingId;
      break;
    case requestAttributes.AirlineId:
      attr.value = booking.airlineId;
      break;
    case requestAttributes.LoungeAccess:
      attr.value = booking.loungeAccess;
      break;
    case requestAttributes.ShopNotifications:
      attr.value = booking.shopNotifications;
      break;
    case requestAttributes.TravelType:
      attr.value = booking.travelType;
      break;
    case requestAttributes.TravelDate:
      attr.value = utils.toIsoDateString(booking.travelDate);
      break;
  }
  return attr;
}
