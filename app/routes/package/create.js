import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.get('store').createRecord('package')
  },

  setupController(controller, model) {
    this._super(...arguments);
    this.controllerFor('application').set('routeName', 'Create Package')
    controller.set('model', model);
  },
});
