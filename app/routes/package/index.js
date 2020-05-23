import Route from '@ember/routing/route';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return hash({
      packages: A(),
      organizations: this.get('store').findAll('organization')
    })
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('packages', model.packages);
    this.controllerFor('application').set('routeName', 'Packages')
    controller.set('organizations', model.organizations)
    controller.set('selectedOrganization', controller.get('organizations.firstObject'))
    controller.set('columns', A([
      EmberObject.create({ key: "name", name: "Name", width: '25%' }),
      EmberObject.create({ key: "items", name: "Items", width: '30%' }),
      EmberObject.create({ key: "description", name: "Description", width: '30%' }),
      EmberObject.create({ key: "price", name: "Price", width: '10%' }),
      EmberObject.create({ key: "orgName", name: "Organization" }),
    ]))
  }
});
