import Component from '@ember/component';
import { inject as service } from '@ember/service';
import EmberObject, { computed, get } from '@ember/object';

export default Component.extend({
  store: service(),
  toast: service(),

  createRecord() {
    return this.get('store').createRecord('package')
  },

  categories: computed(function() {
    return this.get('store').findAll('category')
  }),

  willDestroyElement() {
    if(this.get('type') == "create") {
      this.get('model').destroyRecord()
    } else if(this.get('type') == "update"){
      this.get('model').rollbackAttributes()
    }
  },

  actions: {
    save(model) {
      if(!model.get('organization.id')) {
        return this.get('toast').error('Organization cannot be blank');
      }
      if(!model.get('name')) {
        return this.get('toast').error('Name cannot be blank');
      }
      if(!model.get('items.length')) {
        return this.get('toast').error('Items cannot be empty');
      }
      if(!model.get('price')) {
        return this.get('toast').error('Price cannot be blank');
      }
      if(!model.get('poster_image_source')) {
        return this.get('toast').error('Poster Image cannot be blank');
      }
      model.save()
      .then(() => {
        this.get('toast').success(`Package "${model.get('name')}" created`)
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
      if(!model.get('items.length')) {
        return this.get('toast').error('Items cannot be empty');
      }
      if(!model.get('price')) {
        return this.get('toast').error('Price cannot be blank');
      }
      if(!model.get('poster_image_source')) {
        return this.get('toast').error('Poster Image cannot be blank');
      }
      model.save()
      .then(() => {
        this.get('toast').success(`Package "${model.get('name')}" updated`)
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
        this.get('toast').success(`Package "${model.name}" deleted`)
        return window.history.back()
      }).catch((e) => {
        // console.log(e)
        if(e.errors && e.errors.length) {
          e.errors.forEach(error => {
            this.get('toast').error(error.title, error.details)
          });
        } else {
          return this.get('toast').error(e);
        }
      })
    },

    removePackageItem(item) {
      if(this.get('model.items.length')) {
        let itemObject = this.get('model.items').findBy('id', get(item, 'id'))
        this.get('model.items').removeObject(itemObject)
      }
    },

    back() {
      window.history.back()
    },

    addItem(option) {
      let items = this.get('model.items')
      const item = EmberObject.create({
        id: option.get('id'),
        name: option.get('name'),
        description: option.get('description'),
        image_source: option.get('image_source')
      })
      if(items && !items.findBy('id', option.get('id'))) {
        this.get('model.items').pushObject(item)
      } else if(_.isNil(items)) {
        this.set('model.items', [item])
      } else {
        this.get('toast').error('Item already added')
      }
    },

    backgroundUploadComplete(file) {
      this.set('model.background_image_source', file.get('file_source'))
      this.set('model.background_file', file)
    },

    itemUploadComplete(item, file) {
      item.set('image_source', file.get('file_source'))
      item.set('file', file)
    },

    posterUploadComplete(file) {
      this.set('model.poster_image_source', file.get('file_source'))
      this.set('model.poster_file', file)
    }
  }
});
