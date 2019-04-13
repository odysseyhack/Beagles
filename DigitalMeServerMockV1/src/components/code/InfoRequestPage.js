import React from "react";
import uuidv4 from "uuid";
import * as crypto from "./crypto";
import QRCode from "qrcode.react";
import FormInput from "../common/FormInput";
import Spinner from "../common/Spinner";
import PropTypes from "prop-types";
import { requestTypes, requestAttributes } from "../../api/requestItems";
import {
  registerinforequestPost,
  isinforequestauthorizedGet
} from "../../api/api";
import "./InfoRequest.css"; 
import imgbooking from "../../images/booking.png";

class InfoRequestPage extends React.Component {
  _timeOut = null;
  _privateKey = null;
  _pollTime = 2000;

  constructor(props) {
    super(props);
    this.handleChange = this.handleInputChange.bind(this);

    let rndAccessPointId =
      "APID" + zeroPad(1 + Math.round(Math.random() * 9999999), 6);
    let rndBookingId =
      "BI" + zeroPad(1 + Math.round(Math.random() * 9999999), 6);
    let travelDate = new Date().toISOString().slice(0, 10);

    const type = props.match.params.type || requestTypes.Booking;
    const attributes = this.getRequestedAttributes(type);

    let bookingDetails =
      type === requestTypes.Booking
        ? {
            bookingId: rndBookingId,
            airlineId: "KLM",
            loungeAccess: "LoungeA,LoungeB",
            shopNotifications: false,
            travelType: "Domestic",
            travelDate: travelDate
          }
        : {};

    this.state = {
      isPolling: false,
      pollingResult: null,
      loading: false,
      qrIsVisible: false,
      statusText: "",
      infoRequest: {
        requestType: type,
        requesterId: uuidv4(),
        accessPointId: rndAccessPointId,
        requestDate: new Date().toISOString().slice(0, 10),
        requestedAttributes: attributes
      },
      bookingDetails: bookingDetails,
      key: null
    };

    function zeroPad(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join("0") + num;
    }
  }

  async componentDidMount() {
    const secure = !(location.search.indexOf("plain") > 0);
    if (secure) {
      const keys = await crypto.generateKeyPair();
      this._privateKey = keys.privateKey;

      //
      const test = [{ name: "firstName", value: "Harm" }];
      debugger;
      const encryped = await crypto.encryptMessage(keys.publicKey, test);
      const attributes = [{ name: "encryped", value: encryped }];
      debugger;
      var decrypted = await this.decryptAttributes(attributes);
      debugger;
      //

      const keyExport = await crypto.exportPublicCryptoKey(keys.publicKey);
      debugger;
      this.setState({ key: keyExport });
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeOut);
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true, statusText: "" });

    try {
      const newinfoRequest = { ...this.state.infoRequest };
      const result = await registerinforequestPost(newinfoRequest);

      if (result.registrationOK !== undefined && result.registrationOK) {
        console.log("Request registered");
        newinfoRequest.requestId = result.requestId;
        this.setState({
          infoRequest: newinfoRequest,
          qrIsVisible: true,
          loading: false
        });
        this._timeOut = setTimeout(() => {
          this.pollAuthorized(result.requestId);
        }, this._pollTime);
        return;
      } else {
        this.setState({
          loading: false,
          statusText:
            "Failed to register. reason: " +
            (result.errorMessage || result.message)
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        statusText: "error: " + error.errorMessage
      });
    }
  };

  decryptAttributes = async attributes => {
    try {
      debugger;
      if (
        this._privateKey === null ||
        attributes[0] === undefined ||
        attributes[0].name !== "encrypted"
      ) {
        return attributes;
      }
      const ciphertext = attributes[0].value;
      var decryptedString = await crypto.decryptMessage(
        this._privateKey,
        ciphertext
      );
      debugger;
      return JSON.parse(decryptedString);
    } catch (err) {
      console.log(err);
    }
  };

  pollAuthorized(requestId) {
    this.setState({ isPolling: true }, async () => {
      const result = await isinforequestauthorizedGet(requestId);
      if (result.isCompleted) {
        const attributes = await this.decryptAttributes(
          result.attributes || []
        );
        this.setState({
          isPolling: false,
          statusText: "",
          pollingResult: {
            isAuthorized: result.isAuthorized,
            authorizedAttributes: attributes || []
          }
        });
      } else if (result.errorMessage !== null) {
        this.setState({
          statusText: result.errorMessage,
          isPolling: false,
          qrIsVisible: false
        });
        clearTimeout(this._timeOut);
      } else {
        this.setState({ isPolling: false });
        this._timeOut = setTimeout(() => {
          this.pollAuthorized(requestId);
        }, this._pollTime);
      }
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.updateInfoRequestProperty(target.name, value);
  }

  updateInfoRequestProperty(propertyName, value) {
    const newinfoRequest = Object.assign({}, this.state.infoRequest);
    newinfoRequest[propertyName] = value;
    this.setState({ infoRequest: newinfoRequest });
  }

  handleBookingInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const newBooking = { ...this.state.bookingDetails, [target.name]: value };
    this.setState({ bookingDetails: newBooking });
  };

  getRequestedAttributes(requestType) {
    let value = [];
    switch (requestType) {
      case requestTypes.AirportEntry:
        value = [
          requestAttributes.AirlineId,
          requestAttributes.TravelType,
          requestAttributes.TravelDate,
          requestAttributes.Nationality,
          requestAttributes.PassportNumb,
          requestAttributes.PassportExpiryDate
        ];
        break;
      case requestTypes.BorderControl:
        value = [
          requestAttributes.Picture,
          requestAttributes.FirstName,
          requestAttributes.LastName,
          requestAttributes.BirthDate,
          requestAttributes.Nationality,
          requestAttributes.PassportNumb,
          requestAttributes.PassportExpiryDate,
          requestAttributes.AirlineId,
          requestAttributes.TravelDate,
          requestAttributes.TravelType
        ];
        break;
      case requestTypes.LoungeEntry:
        value = [
          requestAttributes.PassportNumb,
          requestAttributes.LoungeAccess,
          requestAttributes.AirlineId
        ];
        break;
      case requestTypes.Shopping:
        value = [
          requestAttributes.TravelDate,
          requestAttributes.TravelType
          //requestAttributes.CreditCardNum,
          //requestAttributes.CreditCardExpiryDate
        ];
        break;
      case requestTypes.Parking:
        value = [
          requestAttributes.BookingId,
          requestAttributes.TravelDate
          //requestAttributes.CreditCardNum,
          //requestAttributes.CreditCardExpiryDate
        ];
        break;
      case requestTypes.Booking:
        value = [
          requestAttributes.FirstName,
          requestAttributes.LastName,
          requestAttributes.Nationality,
          requestAttributes.PassportNumb,
          requestAttributes.PassportExpiryDate
        ];
        break;
    }
    return value;
  }

  getQRData() {
    const qrData = {
      key: this.state.key,
      infoRequest: this.state.infoRequest,
      bookingDetails: this.state.bookingDetails
    };
    return JSON.stringify(qrData, null, " ");
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    } else if (this.state.pollingResult != null) {
      return this.renderFinished();
    } else if (this.state.qrIsVisible) {
      return this.renderQrCode();
    } else {
      return this.renderForm();
    }
  }

  renderFinished() {
    if (this.state.pollingResult.isAuthorized) {
      return (
        <>
          <div className="card text-white bg-success mb-3">
            <div className="card-body text-center">
              <h1 className="display-4 card-title">Request authorized!</h1>
            </div>
          </div>
          <p>
            {this.state.infoRequest.requestType} is granted access to these
            values:
          </p>
          <dl className="row">
            {this.state.pollingResult.authorizedAttributes.map(
              (item, index) => (
                <>
                  <dt key={index} className="col-sm-3">
                    {item.name}
                  </dt>
                  <dd key={index} className="col-sm-9">
                    {item.isEncodedBase64 ? (
                      <img
                        style={{ maxHeight: 400 }}
                        src={`data:image/png;base64,${item.value}`}
                      />
                    ) : (
                      item.value
                    )}
                  </dd>
                </>
              )
            )}
          </dl>
        </>
      );
    } else {
      return (
        <div className="card text-white bg-danger mb-3">
          <div className="card-body text-center">
            <h1 className="display-4 card-title">Request declined!</h1>
          </div>
        </div>
      );
    }
  }

  renderQrCode() {
    return (
      <>
        {this.state.isPolling ? <div className="pollingIndicator" /> : <></>}
        <h1>{this.state.infoRequest.requestType}</h1>        
        <div>
          <QRCode
            value={this.getQRData()}
            size={500}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
            renderAs={"svg"}
          />
          <div>&nbsp;</div>
          <div className="card card-body bg-light">
            <pre>
              <code>{this.getQRData()}</code>
            </pre>
          </div>
          <h3>{this.state.statusText}</h3>
        </div>
      </>
    );
  }

  /*<img src={imgbooking} />*/
  renderForm() {
    return (
      <>
        <h1>{this.state.infoRequest.requestType}</h1>
        
        <form onSubmit={this.handleSubmit}>
          <FormInput
            name="requesterId"
            value={this.state.infoRequest.requesterId}
            onChange={this.handleChange}
          />
          <FormInput
            name="accessPointId"
            value={this.state.infoRequest.accessPointId}
            onChange={this.handleChange}
          />
          <FormInput
            name="requestDate"
            value={this.state.infoRequest.requestDate}
            onChange={this.handleChange}
          />
          {this.state.infoRequest.requestType === requestTypes.Booking && (
            <>
              <FormInput
                name="BookingId"
                value={this.state.bookingDetails.bookingId}
                onChange={this.handleBookingInputChange}
              />
              <FormInput
                name="airlineId"
                value={this.state.bookingDetails.airlineId}
                onChange={this.handleBookingInputChange}
              />
              <FormInput
                name="loungeAccess"
                value={this.state.bookingDetails.loungeAccess}
                onChange={this.handleBookingInputChange}
              />
              <FormInput
                name="shopNotifications"
                value={this.state.bookingDetails.shopNotifications}
                onChange={this.handleBookingInputChange}
              />
              <FormInput
                name="travelType"
                value={this.state.bookingDetails.travelType}
                onChange={this.handleBookingInputChange}
              />
              <FormInput
                name="travelDate"
                value={this.state.bookingDetails.travelDate}
                onChange={this.handleBookingInputChange}
              />
            </>
          )}
          <div className="form-group">
            <input type="submit" value="Submit" className="btn btn-primary" />
          </div>
        </form>
        <h3>{this.state.statusText}</h3>
      </>
    );
  }
}

InfoRequestPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default InfoRequestPage;
