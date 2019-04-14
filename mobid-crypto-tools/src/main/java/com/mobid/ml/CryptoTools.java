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
					HandleGenerateSignature.handleGenerateSignature(body, responseBody);
				}
				else if ("/generatesignature".equals(event.getResource())) {
					HandleValidateSignature.handleValidateSignature(body, responseBody);
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
