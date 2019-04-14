import {
  GenerateSignatureInput,
  GenerateSignatureOutput,
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

export function forgetMe(mobIdTokenList: Array<string>): Promise<GenericProcessingOutput> {
  const request: ForgetMeInput = {
    mobIdTokenList: mobIdTokenList
  } as ForgetMeInput;
  logRequest(request);
  return apiUtils.api.forgetmePost(request).then(apiUtils.handleResponse);
}

export function generatesignaturePost(input: string): Promise<GenerateSignatureOutput> {
  var request: GenerateSignatureInput = {
    values: [input]
  } as GenerateSignatureInput;
  return apiUtils.api.generatesignaturePost(request).then(apiUtils.handleResponse);
}

export type authorizeInfoRequestType = {
  passport: mob.Passport;
  booking: mob.Booking;
  infoRequest: any;
  infoAttributes: Array<InfoAttribute>;
};

export function authorizeInfoRequest(
  params: authorizeInfoRequestType
): Promise<GenericProcessingOutput> {
  const { passport, booking, infoRequest, infoAttributes } = params;

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
  return apiUtils.api.authorizeinforequestPost(request).then(apiUtils.handleResponse);
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
  return apiUtils.api.authorizeinforequestPost(request).then(apiUtils.handleResponse);
}

export function getWalletstatus(
  mobIdToken: string,
  requestDate?: string
): Promise<WalletStatusOutput> {
  return apiUtils.api.getwalletstatusGet(mobIdToken, requestDate).then(apiUtils.handleResponse);
}

export function getTransactionReport(mobIdToken: string): Promise<TransactionReportOutput> {
  return apiUtils.api.gettransactionreportGet(mobIdToken).then(apiUtils.handleResponse);
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
  return apiUtils.api.registertraveldetailsPost(request).then(apiUtils.handleResponse);
}

function splitString(data: string) {
  if (data) {
    return data.split(",");
  } else {
    return undefined;
  }
}

export function registerPassport(passport: mob.Passport): Promise<PassportDetailsOutput> {
  const request: PassportDetailsInput = {
    issuingCountry: passport.issueCountry,
    gender: getGender(passport),
    age: utils.getAge(new Date(passport.dateOfBirth)),
    requestDate: utils.getDateString(new Date()),
    passportStatus: getStatus(passport),
    attributes: getPassportAttributes(passport)
  };
  logRequest(request);
  return apiUtils.api.registerpassportdetailsPost(request).then(apiUtils.handleResponse);
}

function getStatus(passport: mob.Passport): PassportDetailsInputNs.PassportStatusEnum {
  return utils.getStatus(
    new Date(passport.expiryDate)
  ) as PassportDetailsInputNs.PassportStatusEnum;
}

function getGender(passport: mob.Passport): PassportDetailsInputNs.GenderEnum {
  return (passport.gender !== null && passport.gender.toLowerCase().indexOf("f") > -1
    ? "F"
    : "M") as PassportDetailsInputNs.GenderEnum;
}

function getPassportAttributes(passport: mob.Passport): Array<InfoAttribute> {
  return [
    { name: "first_name", value: passport.firstName },
    { name: "last_name", value: passport.lastName },
    { name: "birth_date", value: utils.toIsoDateString(passport.dateOfBirth) },
    { name: "nationality", value: passport.issueCountry },
    { name: "passport_numb", value: passport.documentNumber },
    {
      name: "passport_expiry_date",
      value: utils.toIsoDateString(passport.expiryDate)
    }
  ] as Array<InfoAttribute>;
}
