import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';
import ENV from './../config/environment';
import RSVP from 'rsvp';
import fetch from 'fetch';

export default OAuth2PasswordGrantAuthenticator.extend({
  serverTokenEndpoint: ENV.APP.API_ROOT+`/api/v1/oauth`,

  makeRequest(url, data, headers={}) {
    headers['Content-Type'] = 'application/json';
    const body = JSON.stringify({
      email: data.username,
      verification_code: data.password,
    })

    const options = {
      body,
      headers,
      method: 'POST'
    };

    return new RSVP.Promise((resolve, reject) => {
      fetch(url, options).then((response) => {
        response.text().then((text) => {
          try {
            let json = JSON.parse(text);
            if (!response.ok) {
              response.responseJSON = json;
              reject(json);
            } else {
              resolve(json);
            }
          } catch (SyntaxError) {
            response.responseText = text;
            reject(response);
          }
        });
      }).catch(reject);
    });
  },
});
