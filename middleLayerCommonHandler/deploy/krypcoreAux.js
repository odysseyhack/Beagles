function generateDate(sDate) {
    var dDate;
    if (sDate == null || sDate == "") {
        dDate = new Date();
    }
    else {
        dDate = new Date(sDate);
    }
    var y = dDate.getFullYear();
    var m = "0" + (dDate.getMonth() + 1);
    m = m.substring(m.length - 2);
    var d = "0" + (dDate.getDate() + 1);
    d = d.substring(d.length - 2);
    return {
        "cvalue": y + "-" + m + "-" + d + " 00:00:00",
        "format": "02-01-2006",
        "value": d + "-" + m + "-" + y
    };
}

function getRequestTypeUser(requestType) {
    switch (requestType) {
        case "AirportEntry":
            return "schipholaccesscontrol";
        case "BorderControl":
            return "nlborderpatrol";
        case "LoungeEntry":
            return "loungeuser1";
        case "Shopping":
            return "retailshop1";
        case "Parking":
            return "schipholparking";
        case "Booking":
            return "klmticketing";
    }
    return "opeuser"; // default
}

function fillReqBody(kcReqBody)
{
    kcReqBody.Program = "digitalmes";
    if (kcReqBody.Receiver == null) kcReqBody.Receiver = {};
    if (kcReqBody.Receiver.ID == null) kcReqBody.Receiver.ID = "opeuser";
    kcReqBody.Receiver.MSPID = "Org1MSP";
    kcReqBody.sm = 2;
    kcReqBody.sm_uid = "passengerone";
    kcReqBody.sm_pwd = "password";
    kcReqBody.ChainCodeId = "ledger";
    kcReqBody.ChannelId = "orgchannel";
}

module.exports = {
    generateDate: generateDate,
    getRequestTypeUser: getRequestTypeUser,
    fillReqBody: fillReqBody
};
