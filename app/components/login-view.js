import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import ENV from './../config/environment';
import fetch from 'fetch';
import RSVP from 'rsvp';
import _ from "lodash";

const url = ENV.APP.API_ROOT + '/api/v1/admin/login';

export default Component.extend({
  session: service(),
  router: service(),
  email: '',
  otp: '',
  isEmailEmpty: true,
  isOtpEmpty: true,
  isOtpResend: false,
  showAuthenticateButton: false,
  toast: service(),

  isEmptyEmail: observer('email', function() {
    if(this.get('email') && this.get('email.length')){
      this.set('isEmailEmpty', false);
    } else {
      this.set('isEmailEmpty', true);
    }
  }),

  isEmptyOtp: observer('otp', function() {
    if(this.get('otp') && this.get('otp.length')){
      this.set('isOtpEmpty', false);
    } else {
      this.set('isOtpEmpty', true);
    }
  }),


  isEmailValid(email) {
    var regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regex.test(_.trim(email));
  },

  actions: {
    resetField(property) {
      this.set(property, '')
    },

    setErrorField(property, message) {
      this.set(property, message)
    },

    authenticate() {
      this.set('isOtpDisabled', true)
      this.send('resetField', 'errorEmail')
      let { email, otp } = this.getProperties('email', 'otp');
      if(!email && !email.length) {
        return this.send('setErrorField', 'errorEmail', "This field is required");
      }
      if(!otp && !otp.length) {
        return this.send('setErrorField', 'errorOTP', "This field is required");
      }
      if(email && email.length && otp && otp.length) {
        this.set('isDisabled', true)
        this.get('session').authenticate('authenticator:oauth2', email, otp)
        .then(() => {
          if (this.get('session.isAuthenticated')) {
            this.get('router').replaceWith('dashboard')
            this.send('clearTimer');
            // What to do with all this success?
          }
        }).catch((error) => {
          this.set('isDisabled', false)
          this.set('isOtpDisabled', false)
          this.set('errorMessage', error.message || error);
          this.get('toast').error(error.message || error)
        })
      }
    },

    getOtp() {
      this.set('isOtpDisabled', true)
      this.set('otp', null)
      this.set('errorEmail', null)
      if(!this.get('email') && !this.get('email').length) {
        return this.send('setErrorField', 'errorEmail', "This field is required");
      }
      if(this.isEmailValid(this.get('email'))) {
        this.set('isDisabled', true)
        this.set('isEmailDisabled', true)
        const options = {
          body : JSON.stringify({ email: this.get('email')}),
          method: 'POST'
        };
        return new RSVP.Promise((resolve, reject) => {
          fetch(url, options).then((response) => {
            response.text().then((text) => {
              try {
                let json = JSON.parse(text);
                if (!response.ok) {
                  response.responseJSON = json;
                  this.set('isDisabled', false)
                  this.set('isEmailDisabled', false)
                  this.set('isOtpDisabled', false)
                  reject(json);
                } else {
                  this.set('isDisabled', false)
                  this.set('showAuthenticateButton', true)
                  this.set('isOtpDisabled', false)
                  resolve(json);
                  let timeInterval = setTimeout(() => {
                    this.set('isOtpResend', true);
                  }, 10000)
                  this.set('timeInterval', timeInterval)
                }
              } catch (SyntaxError) {
                response.responseText = text;
                reject(response);
              }
            });
          }).catch(reject);
        }).catch((e) => this.send('catchError', e))
      } else {
        this.set('isEmailDisabled', false)
        return this.send('setErrorField', 'errorEmail', "Invalid email address");
      }
    },

    catchError(error) {
      this.set('isDisabled', false)
      this.get('toast').error(error.message)
    },

    clearTimer() {
      clearTimeout(this.get('timeInterval'));
    },

    toggleView(property) {
      this.toggleProperty(property)
      this.set('isEmailDisabled', false)
    }
  }
});
