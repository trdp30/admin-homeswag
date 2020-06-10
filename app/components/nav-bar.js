import Component from '@ember/component';
import $ from 'jquery';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  actions: {
    toggleMenu() {
      $('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    },
    logout() {
      this.get('session').invalidate()
    }
  }
});
