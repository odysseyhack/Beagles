package com.mobid.ml;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class CryptoToolsTest
{
	@Test
	public void validSignature() throws Exception
	{
		String signature = GenerateSignature.generateSignature("Something nice");
		boolean result = ValidateSignature.validateSignature("Something nice", signature);
		assertTrue(result);
	}
	
	@Test
	public void invalidSignature() throws Exception
	{
		String signature = GenerateSignature.generateSignature("Something nice");
		boolean result = ValidateSignature.validateSignature("Something not nice", signature);
		assertFalse(result);
	}
}
