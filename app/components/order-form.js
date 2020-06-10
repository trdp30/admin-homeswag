import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import RSVP from 'rsvp';

export default Component.extend({
  store: service(),
  toast: service(),

  createRecord() {
    return this.get('store').createRecord('item')
  },

  categories: computed(function() {
    return this.get('store').findAll('category')
  }),

  // willDestroyElement() {
  //   if(this.get('type') == "create") {
  //     this.get('model').destroyRecord()
  //   } else if(this.get('type') == "update"){
  //     this.get('model').rollbackAttributes()
  //   }
  // },

  actions: {
    addAll() {
      RSVP.all(items.map((item) => {
        let category = this.get('categories').findBy('name', item.category.name)
        return this.get('store').createRecord('item', {
          category: category,
          description: "",
          image_source: "",
          name: item.name,
          organization: this.get('organizations.firstObject'),
          price: item.price,
          mrp: item.mrp
        }).save()
        .then((res) => {
          console.log('created', item.name)
        })
        .catch((e) => console.log('failed', item.name, e))
      }))
    },

    save(model) {
      if(!model.get('name')) {
        return this.get('toast').error('Name cannot be blank');
      }
      if(!model.get('category.id')) {
        return this.get('toast').error('Category cannot be blank');
      }
      if(model.get('category.hasSubCategory') && !model.get('sub_category')) {
        return this.get('toast').error('Sub Category cannot be blank');
      }
      if(!model.get('price')) {
        return this.get('toast').error('Price cannot be blank');
      }
      if(!model.get('image_source')) {
        return this.get('toast').error('Image Source cannot be blank');
      }
      model.save()
      .then(() => {
        this.get('toast').success(`Item "${model.get('name')}" created`)
        return this.set('model', this.createRecord());
      }).catch((e) => {
        if(e.errors && e.errors.length) {
          e.errors.forEach(error => {
            this.get('toast').error(error.title, error.details)
          });
        } else {
          return this.get('toast').error(e);
        }
      })
    },

    update(model) {
      if(!model.get('organization.id')) {
        return this.get('toast').error('Organization cannot be blank');
      }
      if(!model.get('name')) {
        return this.get('toast').error('Name cannot be blank');
      }
      if(!model.get('category.id')) {
        return this.get('toast').error('Category cannot be blank');
      }
      if(model.get('category.hasSubCategory') && !model.get('sub_category')) {
        return this.get('toast').error('Sub Category cannot be blank');
      }
      if(!model.get('price')) {
        return this.get('toast').error('Price cannot be blank');
      }
      if(!model.get('image_source')) {
        return this.get('toast').error('Image Source cannot be blank');
      }
      model.save()
      .then(() => {
        this.get('toast').success(`Item "${model.get('name')}" updated`)
        return window.history.back()
      }).catch((e) => {
        if(e.errors && e.errors.length) {
          e.errors.forEach(error => {
            this.get('toast').error(error.title, error.details)
          });
        } else {
          return this.get('toast').error(e);
        }
      })
    },

    delete(model) {
      model.destroyRecord()
      .then(() => {
        this.get('toast').success(`Item "${model.name}" deleted`)
        return window.history.back()
      }).catch((e) => {
        if(e.errors && e.errors.length) {
          e.errors.forEach(error => {
            this.get('toast').error(error.title, error.details)
          });
        } else {
          return this.get('toast').error(e);
        }
      })
    },

    back() {
      window.history.back()
    },

    uploadComplete(file) {
      this.set('model.image_source', file.get('file_source'))
      this.set('model.file', file)
    },

    upload(items) {
      return RSVP.all(items.map((item) => {
        return this.get('store').createRecord('item', {
          name: item.name,
          display_name: item.display_name,
          image_source: item.image_source
        }).save()
      })).then((res) => console.log(res))
    }
  }
});
