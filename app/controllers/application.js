import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  session: service(),
  showNav: computed('currentPath', function() {
    return !(this.currentPath.includes('login') || this.currentPath.includes('logout'))
  })
});
