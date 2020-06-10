import DS from 'ember-data';
import { computed } from '@ember/object';

const status = [
  { id: 1, name: 'Appointment Placed', color: 'green' },
  { id: 2, name: 'Appointment Confirmed', color: 'green' },
  { id: 3, name: 'Appointment Canceled', color: 'red' },
  { id: 4, name: 'In Progress', color: 'rgb(52, 117, 211)' },
  { id: 5, name: 'Appointment Complete', color: 'rgb(52, 117, 211)' },
  { id: 10, name: 'Archive', color: '#eeeeee' },
]
export default DS.Model.extend({
  created_at                : DS.attr('date'),
  updated_at                : DS.attr('date'),
  created_by                : DS.belongsTo('user'),
  updated_by                : DS.attr('number'),
  is_cancelled              : DS.attr('boolean'),
  is_package                : DS.attr('boolean'),
  order_total               : DS.attr('number'),
  cartItems                 : DS.attr(),
  user                      : DS.belongsTo('user'),
  payment_method            : DS.attr('number'),
  appointment               : DS.attr(),
  status                    : DS.attr('number'),
  total_paid                : DS.attr('number'),
  special_instruction       : DS.attr('string'),
  preferred_beautician      : DS.attr('string'),
  assigned_beautician       : DS.attr('string'),
  address                   : DS.belongsTo('address'),
  confirm_from              : DS.attr('date'),
  confirm_to                : DS.attr('date'),
  device                    : DS.attr(),

  formatedStatus: computed('status', function() {
    return status.findBy('id', this.get('status'))
  })
});
