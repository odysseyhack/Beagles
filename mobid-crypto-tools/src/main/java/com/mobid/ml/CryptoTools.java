package com.mobid.ml;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Base64;
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
	// ONLY FOR DEMO, NOT SAFE STORING KEYS HARDCODED
	private static final String privKeyStr = "MIIBSwIBADCCASwGByqGSM44BAEwggEfAoGBAP1/U4EddRIpUt9KnC7s5Of2EbdSPO9EAMMeP4C2USZpRV1AIlH7WT2NWPq/xfW6MPbLm1Vs14E7gB00b/JmYLdrmVClpJ+f6AR7ECLCT7up1/63xhv4O1fnxqimFQ8E+4P208UewwI1VBNaFpEy9nXzrith1yrv8iIDGZ3RSAHHAhUAl2BQjxUjC8yykrmCouuEC/BYHPUCgYEA9+GghdabPd7LvKtcNrhXuXmUr7v6OuqC+VdMCz0HgmdRWVeOutRZT+ZxBxCBgLRJFnEj6EwoFhO3zwkyjMim4TwWeotUfI0o4KOuHiuzpnWRbqN/C/ohNWLx+2J6ASQ7zKTxvqhRkImog9/hWuWfBpKLZl6Ae1UlZAFMO/7PSSoEFgIUI5zKk/6uEH/2Ea+02kKa8noZQAc=";
	private static final String pubKeyStr = "MIIBuDCCASwGByqGSM44BAEwggEfAoGBAP1/U4EddRIpUt9KnC7s5Of2EbdSPO9EAMMeP4C2USZpRV1AIlH7WT2NWPq/xfW6MPbLm1Vs14E7gB00b/JmYLdrmVClpJ+f6AR7ECLCT7up1/63xhv4O1fnxqimFQ8E+4P208UewwI1VBNaFpEy9nXzrith1yrv8iIDGZ3RSAHHAhUAl2BQjxUjC8yykrmCouuEC/BYHPUCgYEA9+GghdabPd7LvKtcNrhXuXmUr7v6OuqC+VdMCz0HgmdRWVeOutRZT+ZxBxCBgLRJFnEj6EwoFhO3zwkyjMim4TwWeotUfI0o4KOuHiuzpnWRbqN/C/ohNWLx+2J6ASQ7zKTxvqhRkImog9/hWuWfBpKLZl6Ae1UlZAFMO/7PSSoDgYUAAoGBAM6d67OdkDF2ZnWS5xG5Y906+H0dacU7khBviZK/yCtVdLgXFa4oNTsMv884ZQlS2Vri0EyEqSgYtbjc2cUhxP5j90/VPYsTaVLHu7aQY+WK30G6hzwqOoKHx94CUwYdaHFt636OV+bwl5rH6txzK1/ELqK1fa0dXdSGNlSgiwgC";
	private static PrivateKey privKey = null;
	private static PublicKey pubKey = null;

	public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent event, Context context)
	{
		LambdaLogger logger = context.getLogger();
		logger.log("CryptoTools.handleRequest");
		logger.log("Processing " + event.getResource());
		logger.log(event.getBody());

		APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
		HashMap<String, Object> responseBody = new HashMap<>();
		responseBody.put("errorMessage", "");

		try {

			if (event.getBody() != null) {

				JSONObject body = (JSONObject) (new JSONParser()).parse(event.getBody());

				if ("/validatesignature".equals(event.getResource())) {

					Object valueObj = body.get("value");
					if (valueObj == null || !(valueObj instanceof String)) throw new Exception("Missing or unexpected type for input value");
					Object signatureObj = body.get("signature");
					if (signatureObj == null || !(signatureObj instanceof String))
						throw new Exception("Missing or unexpected type for input signature");

					boolean signatureOK = validateSignature(valueObj.toString(), signatureObj.toString());
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
							signatures.add(generateSignature(valueObj.toString()));
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

	private String generateSignature(String value) throws Exception
	{
		if (privKey == null) {
			byte[] privKeyData = Base64.getDecoder().decode(privKeyStr);
			PKCS8EncodedKeySpec privKeySpec = new PKCS8EncodedKeySpec(privKeyData);
			KeyFactory keyFactory = KeyFactory.getInstance("DSA", "SUN");
			privKey = keyFactory.generatePrivate(privKeySpec);
		}

		Signature dsa = Signature.getInstance("SHA1withDSA", "SUN");
		dsa.initSign(privKey);
		dsa.update(value.getBytes(StandardCharsets.UTF_8));
		return Base64.getEncoder().encodeToString(dsa.sign());
	}

	private boolean validateSignature(String value, String signature) throws Exception
	{
		if (pubKey == null) {
			byte[] pubKeyData = Base64.getDecoder().decode(pubKeyStr);
			X509EncodedKeySpec pubKeySpec = new X509EncodedKeySpec(pubKeyData);
			KeyFactory keyFactory = KeyFactory.getInstance("DSA", "SUN");
			pubKey = keyFactory.generatePublic(pubKeySpec);
		}

		byte[] signatureData = Base64.getDecoder().decode(signature);

		Signature dsa = Signature.getInstance("SHA1withDSA", "SUN");
		dsa.initVerify(pubKey);
		dsa.update(value.getBytes(StandardCharsets.UTF_8));
		return dsa.verify(signatureData);
	}
}
