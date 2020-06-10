import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({

  didRender (){
    $('.ui.accordion').accordion();
  },

  actions: {
    toggleMenu() {
      $('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    }
  }
});
