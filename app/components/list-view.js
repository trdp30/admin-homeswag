import Component from '@ember/component';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import _ from 'lodash';

export default Component.extend({
  model: A(),
  isLoading: false,
  store: service(),
  toast: service(),

  init() {
    this._super(...arguments);
    this.fetchRecords()
  },

  search: function() {
    this.set('page', 1),
    this.get('model').clear()
  }.on('selectedOrganization'),

  // eslint-disable-next-line ember/no-function-prototype-extensions
  fetchRecords: function() {
    if(this.get('selectedOrganization')) {
      this.set('isLoading', true)
      return this.get('store').query(this.get('modelName'), { organization_id: this.get('selectedOrganization.id') })
      .then((response) => {
        this.get('model').clear()
        let values = response.map(data => data)
        this.get('model').pushObjects(values)
      }).then(() => {
        this.set('isLoading', false)
      }).catch((e) => {
        if(e.errors && e.errors.length) {
          e.errors.forEach(error => {
            this.get('toast').error(error.title, error.details)
          });
        } else {
          return this.get('toast').error(e);
        }
      })
    }
  }.observes('selectedOrganization', 'selectedOrganization.id'),
});
