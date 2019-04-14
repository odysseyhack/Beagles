package com.mobid.ml;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

class ValidateSignature
{
	// ONLY FOR DEMO, NOT SAFE STORING KEYS HARDCODED
	protected static final String pubKeyStr = "MIIBuDCCASwGByqGSM44BAEwggEfAoGBAP1/U4EddRIpUt9KnC7s5Of2EbdSPO9EAMMeP4C2USZpRV1AIlH7WT2NWPq/xfW6MPbLm1Vs14E7gB00b/JmYLdrmVClpJ+f6AR7ECLCT7up1/63xhv4O1fnxqimFQ8E+4P208UewwI1VBNaFpEy9nXzrith1yrv8iIDGZ3RSAHHAhUAl2BQjxUjC8yykrmCouuEC/BYHPUCgYEA9+GghdabPd7LvKtcNrhXuXmUr7v6OuqC+VdMCz0HgmdRWVeOutRZT+ZxBxCBgLRJFnEj6EwoFhO3zwkyjMim4TwWeotUfI0o4KOuHiuzpnWRbqN/C/ohNWLx+2J6ASQ7zKTxvqhRkImog9/hWuWfBpKLZl6Ae1UlZAFMO/7PSSoDgYUAAoGBAM6d67OdkDF2ZnWS5xG5Y906+H0dacU7khBviZK/yCtVdLgXFa4oNTsMv884ZQlS2Vri0EyEqSgYtbjc2cUhxP5j90/VPYsTaVLHu7aQY+WK30G6hzwqOoKHx94CUwYdaHFt636OV+bwl5rH6txzK1/ELqK1fa0dXdSGNlSgiwgC";
	protected static PublicKey pubKey = null;

	protected static boolean validateSignature(String value, String signature) throws Exception
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
