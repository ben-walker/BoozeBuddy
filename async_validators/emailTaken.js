import validate from 'validate.js';
import url from 'url';

const emailTaken = (value) => {
  let URL = 'https://dr-robotnik.herokuapp.com/api/emailTaken';
  const queryData = { email: value };
  URL += url.format({ query: queryData });

  return new Promise(async (resolve, reject) => {
    const rawResponse = await fetch(URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!rawResponse.ok) return reject();
    const response = await rawResponse.json();
    return response.taken ? resolve('is taken') : resolve();
  });
};

validate.validators.emailTaken = emailTaken;
