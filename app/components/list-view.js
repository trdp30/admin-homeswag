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
  
  // eslint-disable-next-line ember/no-function-prototype-extensions
  fetchRecords: function() {
    if(this.get('selectedOrganization')) {
      this.set('isLoading', true)
      return this.get('store').query(this.get('modelName'), { organization_id: this.get('selectedOrganization.id') })
      .then((response) => {
        this.get('model').clear()
        let values = response.map(data => data)
        this.get('model').pushObjects(_.sortBy(values, ['user', 'age']))
      }).then(() => {
        this.set('isLoading', false)
      }).catch((e) => this.get('toast').error(e))
    }
  }.observes('selectedOrganization', 'selectedOrganization.id'),
});
