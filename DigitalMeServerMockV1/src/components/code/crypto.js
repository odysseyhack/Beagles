// //https://riptutorial.com/javascript/example/17845/generating-rsa-key-pair-and-converting-to-pem-format

// function arrayBufferToBase64(arrayBuffer) {
//   var byteArray = new Uint8Array(arrayBuffer);
//   var byteString = "";
//   for (var i = 0; i < byteArray.byteLength; i++) {
//     byteString += String.fromCharCode(byteArray[i]);
//   }
//   var b64 = window.btoa(byteString);
//   return b64;
// }

// function addNewLines(str) {
//   var finalString = "";
//   while (str.length > 0) {
//     finalString += str.substring(0, 64) + "\n";
//     str = str.substring(64);
//   }
//   return finalString;
// }

// function toPem(key, isPrivate) {
//   var b64 = addNewLines(arrayBufferToBase64(key));
//   var pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----"";
//   return pem;
// }

/*
Convert  an ArrayBuffer into a string
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

/*
Export the given key and write it into the "exported-key" space.
*/
async function exportPrivateCryptoKey(key) {
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;

  const exportKeyOutput = document.querySelector(".exported-key");
  exportKeyOutput.textContent = pemExported;
}

/*
  Export the given key and write it into the "exported-key" space.
  */
export async function exportPublicCryptoKey(key) {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;

  // const exportKeyOutput = document.querySelector(".exported-key");
  console.log(pemExported);
  return pemExported;
}

/*
  Generate an encrypt/decrypt key pair,
  then set up an event listener on the "Export" button.
  */
export async function generateKeyPair() {
  return window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      // Consider using a 4096-bit key for systems that require long-term security
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );
}

//https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt
export async function decryptMessage(privateKey, ciphertext) {
  const arrayBuffer = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP"
    },
    privateKey,
    ciphertext
  );
  return ab2str(arrayBuffer);
}

function encodeMessage(data) {
  let enc = new TextEncoder();
  return enc.encode(data);
}

export async function encryptMessage(publicKey, data) {
  let encoded = encodeMessage(JSON.stringify(data));
  debugger;
  const arrayBuffer = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    publicKey,
    encoded
  );
  debugger;
  return ab2str(arrayBuffer);
}

// async function encryptMessage(key) {
//     let encoded = getMessageEncoding();
//     ciphertext = await window.crypto.subtle.encrypt(
//       {
//         name: "RSA-OAEP"
//       },
//       key,
//       encoded
//     );

//     let buffer = new Uint8Array(ciphertext, 0, 5);
//     const ciphertextValue = document.querySelector(".rsa-oaep .ciphertext-value");
//     ciphertextValue.classList.add('fade-in');
//     ciphertextValue.addEventListener('animationend', () => {
//       ciphertextValue.classList.remove('fade-in');
//     });
//     ciphertextValue.textContent = `${buffer}...[${ciphertext.byteLength} bytes total]`;
//   }
