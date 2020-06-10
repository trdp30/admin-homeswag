/* eslint-disable ember/closure-actions */
import FileField from 'ember-uploader/components/file-field';
import { inject as service } from '@ember/service';
import { v4 as uuidv4 } from 'uuid';
import $ from 'jquery';

export default FileField.extend({
  supportedExtensions: 'doc docx odt pdf rtf txt ps',
  firebaseApp: service(),
  store: service(),
  toast: service(),

  filesDidChange: async function(files) {
    let that = this
    var file = files[0]
    let firebase = this.get('firebaseApp')
    var storageRef = await firebase.storage("gs://homswag.appspot.com").then((res) => res.ref())
    this.sendAction('toggleView','isUploading')

    var metadata = {
      contentType: 'image/jpeg'
    };

    var uploadTask = storageRef.child('images/' + uuidv4() + file.name).put(file, metadata);

    uploadTask.on('state_changed', (snapshot) => that.progressStatus(snapshot), (error) => that.catchError(error),
     () => uploadTask.snapshot.ref.getDownloadURL().then((url) => that.save(uploadTask.snapshot.ref, url)))

    this.set('file', files[0]);
    // Rest selected file
    this.$().val(null);
  },

  catchError(error) {
    switch (error.code) {
      case 'storage/unauthorized': {
        return this.get('toast').error(error.code);
      }
      case 'storage/canceled': {
        return this.get('toast').error(error.code);
      }
      case 'storage/unknown': {
        return this.get('toast').error(error.code);
      }
    }
    this.sendAction('reset')
  },

  progressStatus(snapshot) {
    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    this.set('progress', Math.round(progress))
    switch (snapshot.state) {
      case 'paused':
        return this.set('status', snapshot.state)
      case 'running':
        return this.set('status', snapshot.state)
    }
  },

  save(data, url) {
    this.get('store').createRecord('file-upload', {
      bucket: data.bucket,
      fullPath: data.fullPath,
      name: data.name,
      file_source: url,
      organization: this.get('organization')
    }).save()
    .then((res) => {
      this.get('toast').success('Image uploaded successfully')
      this.get('store').findRecord('file', res.get('id')).then((file) => {
        this.sendAction('reset')
        this.sendAction('uploadComplete', file)
      })
    })
    .catch((e) => {
      this.sendAction('reset')
      this.get('toast').error('Something went wrong', e)
    })
  },

  willDestroyElement() {
    this._super(...arguments);
    if(this.get('target')){
       $(this.get('target')).off('click');
    }
  },
});

