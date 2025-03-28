import * as FileSystem from 'expo-file-system';

export default readFile = async (imageUri) => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log('Image data (Base64):', fileContent);
    return(fileContent)
  } catch (error) {
    console.error('Error reading file:', error);
  }
};