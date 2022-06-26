import "./dzicrypto-1.0.2.js";

const exec = (res) => {
  const lastError = DziCryptoApi.getLastError();
  const code = lastError.getCode();
  if (code === 0) {
    return res;
  } else {
    lastError.reset();
    throw new Error(`DziCryptoApi error ${code} with message '${lastError.getMessage()}'`);
  }
};

const toBase64 = (u8a) => btoa(String.fromCharCode.apply(null, u8a));

const fromBase64 = (str) => {
  return new Uint8Array(
    atob(str)
      .split("")
      .map(function (c) {
        return c.charCodeAt(0);
      })
  );
};

const strToBytes = (str) => new TextEncoder().encode(str);
const bytesToStr = (u8a) => new TextDecoder().decode(u8a);

const strToBase64 = (str) => toBase64(strToBytes(str));
const base64ToStr = (b64) => bytesToStr(fromBase64(b64));

const encrypt = (data, pass) => {
  const data64 = strToBase64(JSON.stringify(data));
  const pass64 = strToBase64(pass);
  const encrypted64 = exec(DziCryptoApi.encryptMessage(data64, pass64, 23));
  return encrypted64;
};

const decrypt = (encrypted64, pass) => {
  const pass64 = strToBase64(pass);
  const decrypted64 = exec(DziCryptoApi.decryptMessage(encrypted64, pass64));
  const decrypted = base64ToStr(decrypted64);
  return JSON.parse(decrypted);
};

export { encrypt, decrypt };
