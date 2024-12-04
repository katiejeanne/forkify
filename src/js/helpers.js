import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // Retrieve the data using API
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    // Convert data to readable format
    const data = await res.json();

    // If the data doesn't load pass an error
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    console.err(err);
    throw err;
  }
};
