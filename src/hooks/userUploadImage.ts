import React, {useEffect, useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {Alert} from 'react-native';
import rnfs from 'react-native-fs';
import {showError} from '../utils/utils';
import DocumentPicker from 'react-native-document-picker';

// import {fileUrl} from '../constants/constants';
// import DocumentPicker from 'react-native-document-picker';

export default function useUploadImage(outerImage?: string) {
  const [image, setImage] = useState(outerImage);
  const [baseImage, setBaseImage] = useState(outerImage);

  useEffect(() => {
    outerImage && setImage(outerImage);
  }, [outerImage]);

  const openDialog = () => {
    Alert.alert('', 'Choose an Image', [
      {
        text: 'Camera',
        onPress: () => openCamera(),
      },
      {
        text: 'Gallery',
        onPress: () => onImageUpload(),
        style: 'cancel',
      },
      {text: 'Cancel', onPress: () => console.log('OK Pressed')},
    ]);
  };

  const onImageUpload = () => {
    ImagePicker.openPicker({
      cropping: true,
      avoidEmptySpaceAroundImage: true,
      mediaType: 'photo',
      compressImageQuality: 0.5,
    })
      .then((image: any) => {
        pathToImageFile(image);
      })
      .catch(error => {
        console.log(error, 'onImageUpload error');
      });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
    })
      .then((image: any) => {
        pathToImageFile(image);
      })
      .catch(() => {});
  };

  const openDocument = async () => {
    const response = await DocumentPicker.pick({
      presentationStyle: 'fullScreen',
      // type: DocumentPicker.types.allFiles,
      type: DocumentPicker.types.images,
    });
      console.log("response===",response)
    setImage(response[0]);
  };

  async function pathToImageFile(file: any) {
    try {
      let base64 = await rnfs?.readFile(file?.path, 'base64');
      let baseUrl = `data:${file.type};base64,${base64}`;
      setBaseImage(baseUrl);
      setImage(file);
    } catch (err) {
      showError('Unable to load file. Please try any other file');
    }
  }

  return {openDialog, image, baseImage, openDocument};
}
