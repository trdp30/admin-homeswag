import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  setupController(controller, model) {
    this.controllerFor('application').set('routeName', 'Update Category')
    controller.set('model', model)
  }
});
