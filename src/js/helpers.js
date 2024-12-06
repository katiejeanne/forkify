import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const returnData = await res.json();

    if (!res.ok) throw new Error(`${returnData.message} (${res.status})`);
    return returnData;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/*
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

export const sendJSON = async function (url, data) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const returnData = await res.json();

    if (!res.ok) throw new Error(`${returnData.message} (${res.status})`);
    return returnData;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
*/
