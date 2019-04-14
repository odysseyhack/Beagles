import {
  AuthorizeInfoRequestInput,
  InfoAttribute,
  GenericProcessingOutput,
  PassportDetailsInput,
  PassportDetailsInputNs,
  PassportDetailsOutput,
  TransactionReportOutput,
  TravelDetailsInput,
  TravelDetailsInputNs,
  WalletStatusOutput,
  ForgetMeInput
} from "./api_ml";
import * as mob from "../types/mobTypes";
import * as apiUtils from "./apiUtils";
import * as utils from "../utils";

function logRequest(request: any): void {
  utils.logObject(request, "request:");
}

export function forgetMe(
  mobIdTokenList: Array<string>
): Promise<GenericProcessingOutput> {
  const request: ForgetMeInput = {
    mobIdTokenList: mobIdTokenList
  } as ForgetMeInput;

  logRequest(request);
  return apiUtils.api.forgetmePost(request).then(apiUtils.handleResponse);
}

export function authorizeInfoRequest(
  passport: mob.Passport,
  booking: mob.Booking,
  infoRequest: any,
  infoAttributes: Array<InfoAttribute>
): Promise<GenericProcessingOutput> {
  const request: AuthorizeInfoRequestInput = {
    mobIdToken: passport.mobIdToken || "",
    requestId: infoRequest.requestId,
    requesterId: infoRequest.requesterId,
    accessPointId: infoRequest.accessPointId,
    requestDate: infoRequest.requestDate,
    requestType: infoRequest.requestType,
    bookingId: booking.bookingId,
    attributes: infoAttributes,
    declineAuthorization: false
  };

  logRequest(request);
  return apiUtils.api
    .authorizeinforequestPost(request)
    .then(apiUtils.handleResponse);
}

export function declineInfoRequest(
  mobIdToken: string,
  infoRequest: any
): Promise<GenericProcessingOutput> {
  const request: AuthorizeInfoRequestInput = {
    mobIdToken: mobIdToken,
    requestId: infoRequest.requestId,
    declineAuthorization: true
  } as AuthorizeInfoRequestInput;

  logRequest(request);
  return apiUtils.api
    .authorizeinforequestPost(request)
    .then(apiUtils.handleResponse);
}

export function getWalletstatus(
  mobIdToken: string,
  requestDate?: string
): Promise<WalletStatusOutput> {
  return apiUtils.api
    .getwalletstatusGet(mobIdToken, requestDate)
    .then(apiUtils.handleResponse);
}

export function getTransactionReport(
  mobIdToken: string
): Promise<TransactionReportOutput> {
  return apiUtils.api
    .gettransactionreportGet(mobIdToken)
    .then(apiUtils.handleResponse);
}

export function registerTravelDetails(
  mobIdToken: string,
  booking: mob.Booking
): Promise<GenericProcessingOutput> {
  const request: TravelDetailsInput = {
    mobIdToken: mobIdToken,
    bookingId: booking.bookingId,
    airlineId: booking.airlineId,
    loungeAccess: splitString(booking.loungeAccess),
    shopNotifications: booking.shopNotifications === "true",
    travelType: "Domestic" as TravelDetailsInputNs.TravelTypeEnum,
    travelDate: booking.travelDate
  };

  logRequest(request);
  return apiUtils.api
    .registertraveldetailsPost(request)
    .then(apiUtils.handleResponse);
}

function splitString(data: string) {
  if (data) {
    return data.split(",");
  } else {
    return undefined;
  }
}

export function registerPassport(
  username: string,
  password: string,
  passport: mob.Passport
): Promise<PassportDetailsOutput> {
  const gender: PassportDetailsInputNs.GenderEnum = (passport.gender !== null &&
  passport.gender.toLowerCase().indexOf("f") > -1
    ? "F"
    : "M") as PassportDetailsInputNs.GenderEnum;

  const status: PassportDetailsInputNs.PassportStatusEnum = utils.getStatus(
    new Date(passport.expiryDate)
  ) as PassportDetailsInputNs.PassportStatusEnum;

  const nowDate: string = utils.getDateString(new Date());

  const request: PassportDetailsInput = {
    issuingCountry: passport.issueCountry,
    gender: gender,
    age: utils.getAge(new Date(passport.dateOfBirth)),
    requestDate: nowDate,
    passportStatus: status,
    attributes: [
      {
        name: "first_name" as InfoAttribute.NameEnum,
        value: passport.firstName
      },
      {
        name: "last_name" as InfoAttribute.NameEnum,
        value: passport.lastName
      },
      {
        name: "birth_date" as InfoAttribute.NameEnum,
        value: utils.toIsoDateString(passport.dateOfBirth)
      },
      {
        name: "nationality" as InfoAttribute.NameEnum,
        value: passport.issueCountry
      },
      {
        name: "passport_numb" as InfoAttribute.NameEnum,
        value: passport.documentNumber
      },
      {
        name: "passport_expiry_date" as InfoAttribute.NameEnum,
        value: utils.toIsoDateString(passport.expiryDate)
      }
      // {
      //   name: InfoAttribute.NameEnum.FrequentFlyerNum,
      //   value: passport.documentId
      // },
      // {
      //   name: InfoAttribute.NameEnum.FrequentFlyerProgram,
      //   value: passport.documentId
      // },
      // {
      //   name: InfoAttribute.NameEnum.Picture,
      //   value: passport.image,
      //   isEncodedBase64: true
      // }
    ]
  };

  logRequest(request);

  return apiUtils.api
    .registerpassportdetailsPost(request)
    .then(apiUtils.handleResponse);
}
