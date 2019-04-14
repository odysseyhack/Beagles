package com.mobid.ml;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

class GenerateSignature
{
	// ONLY FOR DEMO, NOT SAFE STORING KEYS HARDCODED
	private static final String privKeyStr = "MIIBSwIBADCCASwGByqGSM44BAEwggEfAoGBAP1/U4EddRIpUt9KnC7s5Of2EbdSPO9EAMMeP4C2USZpRV1AIlH7WT2NWPq/xfW6MPbLm1Vs14E7gB00b/JmYLdrmVClpJ+f6AR7ECLCT7up1/63xhv4O1fnxqimFQ8E+4P208UewwI1VBNaFpEy9nXzrith1yrv8iIDGZ3RSAHHAhUAl2BQjxUjC8yykrmCouuEC/BYHPUCgYEA9+GghdabPd7LvKtcNrhXuXmUr7v6OuqC+VdMCz0HgmdRWVeOutRZT+ZxBxCBgLRJFnEj6EwoFhO3zwkyjMim4TwWeotUfI0o4KOuHiuzpnWRbqN/C/ohNWLx+2J6ASQ7zKTxvqhRkImog9/hWuWfBpKLZl6Ae1UlZAFMO/7PSSoEFgIUI5zKk/6uEH/2Ea+02kKa8noZQAc=";
	private static PrivateKey privKey = null;

	protected static String generateSignature(String value) throws Exception
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
}
