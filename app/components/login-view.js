import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  email: '',
  password: '',

  actions: {
    authenticate() {
      let { email, password } = this.getProperties('email', 'password');
      if(email && email.length && password && password.length) {
        this.get('session').authenticate('authenticator:oauth2', email, password)
        .then(() => {
          if (this.session.isAuthenticated) {
            // What to do with all this success?
          }
        }).catch((error) => {
          this.set('errorMessage', error.error || error);

        })
      }
    }
  }
});
