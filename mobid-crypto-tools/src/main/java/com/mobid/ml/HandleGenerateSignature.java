package com.mobid.ml;

import java.util.HashMap;

import org.json.simple.JSONObject;

class HandleGenerateSignature
{
	protected static void handleGenerateSignature(JSONObject body, HashMap<String, Object> responseBody) throws Exception
	{
		Object valueObj = body.get("value");
		if (valueObj == null || !(valueObj instanceof String)) throw new Exception("Missing or unexpected type for input value");
		Object signatureObj = body.get("signature");
		if (signatureObj == null || !(signatureObj instanceof String)) throw new Exception("Missing or unexpected type for input signature");

		boolean signatureOK = ValidateSignature.validateSignature(valueObj.toString(), signatureObj.toString());
		responseBody.put("signatureOK", signatureOK);
	}
}
