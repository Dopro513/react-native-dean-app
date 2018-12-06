import * as firebase from 'firebase';

export const uploadAsByteArray = async (uid,pickerResultAsByteArray, progressCallback) => {
    
      try {
    
        var metadata = {
          contentType: 'image/jpeg',
        };
    
        // let name = new Date().getTime() + "-profile.jpg"
        let name = uid+".jpg"
        var storageRef = firebase.storage().ref();
        var ref = storageRef.child('profile/' + name)
        let uploadTask = ref.put(pickerResultAsByteArray, metadata)
    
        uploadTask.on('state_changed', function (snapshot) {
    
          progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)
    
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
    
        }, function (error) {
          console.log("in _uploadAsByteArray ", error)
        }, function () {
          var downloadURL = uploadTask.snapshot.downloadURL;
          console.log("_uploadAsByteArray ", uploadTask.snapshot.downloadURL)
    
          // save a reference to the image for listing purposes
          var ref = firebase.database().ref('profile').child(uid);
          ref.set({
            'URL': downloadURL,
            //'thumb': _imageData['thumb'],
            'name': name,
            //'coords': _imageData['coords'],
            'owner': firebase.auth().currentUser && firebase.auth().currentUser.uid,
            'when': new Date().getTime()
          })
        });
    
    
      } catch (ee) {
        console.log("when trying to load _uploadAsByteArray ", ee)
      }
    }
    