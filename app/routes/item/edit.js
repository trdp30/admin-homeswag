import Route from '@ember/routing/route';
// import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

// export default Route.extend(AuthenticatedRouteMixin, {
export default Route.extend({
  setupController(controller, model) {
    this.controllerFor('application').set('routeName', 'Update Item')
    controller.set('model', model)
  }
});
