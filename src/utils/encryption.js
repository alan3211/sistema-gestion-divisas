import CryptoJS from 'crypto-js';

const SECRET_KEY= '9PKTpSAI3TvO2twltbNYwt66rALhg1Yi';

// Función para cifrar los datos
export const encryptData = (value) => {
   const nonce = CryptoJS.lib.WordArray.random(12); // 96 bits
   const key = CryptoJS.enc.Hex.parse(SECRET_KEY);
   const ciphertext = CryptoJS.AES.encrypt(value, key, {
      iv: nonce,
      mode: CryptoJS.mode.GCM,
   });
   const encryptedData = nonce.concat(ciphertext.ciphertext);
   const encryptedDataString = encryptedData.toString(CryptoJS.enc.Base64);
   return encryptedDataString;
};

// Función para descifrar los datos
export const decryptData = (encryptedData) => {
   const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
   const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
   return JSON.parse(decryptedValue);
};