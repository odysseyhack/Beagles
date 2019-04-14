package com.mobid.ml;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

public class CryptoTools implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent>
{
	public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent event, Context context)
	{
		LambdaLogger logger = context.getLogger();
		logger.log("CryptoTools.handleRequest");
		logger.log("Processing " + event.getResource());
		logger.log(event.getBody());

		APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
		HashMap<String, Object> responseBody = new HashMap<>();
		responseBody.put("errorMessage", null);

		try {

			if (event.getBody() != null) {

				JSONObject body = (JSONObject) (new JSONParser()).parse(event.getBody());

				if ("/validatesignature".equals(event.getResource())) {

					Object valueObj = body.get("value");
					if (valueObj == null || !(valueObj instanceof String)) throw new Exception("Missing or unexpected type for input value");
					Object signatureObj = body.get("signature");
					if (signatureObj == null || !(signatureObj instanceof String))
						throw new Exception("Missing or unexpected type for input signature");

					boolean signatureOK = ValidateSignature.validateSignature(valueObj.toString(), signatureObj.toString());
					responseBody.put("signatureOK", signatureOK);

				}
				else if ("/generatesignature".equals(event.getResource())) {
					Object valuesObj = body.get("values");

					if (valuesObj == null || !(valuesObj instanceof List)) throw new Exception(
							"Missing or unexpected type for input values [" + valuesObj == null ? "null" : valuesObj.getClass().toString() + "]");

					ArrayList<String> signatures = new ArrayList<>();

					@SuppressWarnings("unchecked")
					List<Object> values = (List<Object>) valuesObj;
					for (Object valueObj : values) {
						if (valueObj != null) {
							if (!(valueObj instanceof String)) throw new Exception("Unexpected type for one value inside the values.");
							signatures.add(GenerateSignature.generateSignature(valueObj.toString()));
						}
						else {
							signatures.add(null);
						}
					}
					responseBody.put("signatures", signatures);

				}
				else {
					responseBody.put("errorMessage", "Unknown resource " + event.getResource());
				}

			}
			else {
				responseBody.put("errorMessage", "Error: Input body is empty!");
			}
		}
		catch (Exception ex) {
			logger.log(ex.toString());
			responseBody.put("errorMessage", ex.toString());
		}

		logger.log("Finished processing " + event.getResource());
		String responseBodyStr = new JSONObject(responseBody).toJSONString();
		logger.log(responseBodyStr);
		response.setBody(responseBodyStr);
		return response;
	}
}
