import Route from '@ember/routing/route';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return hash({
      orders: A(),
      organizations: this.get('store').findAll('organization')
    })
  },

  setupController(controller, model) {
    this._super(...arguments);
    this.controllerFor('application').set('routeName', 'Appointments')
    controller.set('organizations', model.organizations)
    controller.set('orders', model.orders)
    controller.set('selectedOrganization', controller.get('organizations.firstObject'))
    controller.set('columns', A([
      EmberObject.create({ key: "id", name: "A. No", width: 80 }),
      EmberObject.create({ key: "user.name", name: "Customer Name", width: 200 }),
      EmberObject.create({ key: "cartItems", name: "Items", width: 260 }),
      EmberObject.create({ key: "created_at", name: "Appointment Placed on", width: 250 }),
      EmberObject.create({ key: "appointment.from", name: "Appointment Placed for", width: 250 }),
      EmberObject.create({ key: "confirm_from", name: "Appointment Confirm for", width: 250 }),
      EmberObject.create({ key: "total_paid", name: "Total Paid", width: 150 }),
      EmberObject.create({ key: "formatedStatus", name: "Status", width: 250 }),
      // EmberObject.create({ key: "address.formatedAddress", name: "Address", width: 300 }),
      EmberObject.create({ key: "device.osName", name: "Device", width: 100 }),
    ]))
  }
});
