import Route from '@ember/routing/route';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return hash({
      categories: A(),
      organizations: this.get('store').findAll('organization')
    })
  },

  setupController(controller, model) {
    this._super(...arguments);
    this.controllerFor('application').set('routeName', 'Categories')
    controller.set('categories', model.categories);
    controller.set('organizations', model.organizations)
    controller.set('selectedOrganization', controller.get('organizations.firstObject'))
    controller.set('columns', A([
      EmberObject.create({ key: "display_name", name: "Display Name", width: '15%' }),
      EmberObject.create({ key: "name", name: "Name", width: '15%' }),
      EmberObject.create({ key: "image_source", name: "Image Source", width: '40%' }),
      EmberObject.create({ key: "orgName", name: "Organization" }),
    ]))
  }
});
