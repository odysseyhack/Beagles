package com.mobid.ml;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONObject;

class HandleValidateSignature
{
	protected static void handleValidateSignature(JSONObject body, HashMap<String, Object> responseBody) throws Exception
	{
		Object valuesObj = body.get("values");

		if (valuesObj == null || !(valuesObj instanceof List))
			throw new Exception("Missing or unexpected type for input values [" + valuesObj == null ? "null" : valuesObj.getClass().toString() + "]");

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
}
