import DS from 'ember-data';
import { computed } from '@ember/object';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { inject as service } from '@ember/service';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  session: service(),
  host: "https://homswag.herokuapp.com",
  namespace: "api/v1",

  headers: computed('session.data.authenticated.access_token', function() {
    let headers = {};
    if (this.get("session.isAuthenticated")) {
      headers['Authorization'] = `Bearer ${this.get("session.data.authenticated.access_token")}`;
    }
    return headers;
  }),

  handleResponse: function (status,headers,payload,requestData){
    if(payload){
      if(status >= 400){
        let e = {errors: []};
        if(Array.isArray(payload)) {
          payload.forEach(function(elem){
            e.errors.push({
              detail: elem.message,
              name : elem.name,
            });
          });
        } else {
          e.errors.push({
            details: payload.message,
            status: payload.status,
            name  : payload.name
          });
        }
        payload = e;
      }
    }
    return this._super(status,headers,payload,requestData);
  }

});
