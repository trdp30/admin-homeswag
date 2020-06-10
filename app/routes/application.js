import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {
  session: service(),
  beforeModel() {
    if(!this.get('session.isAuthenticated')) {
      this.router.replaceWith('login')
    }
  },

  setupController(controller) {
    this._super(...arguments);
    controller.set('routeName', null)
  }
});
