import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

const DownloadVideo = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [downloadPath, setDownloadPath] = useState('');

    const handleDownloadVideo = async () => {
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = `${dirs.DownloadDir}/tiktok_videos`;

    try {
        const response = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: `${dirToSave}/${new Date().getTime()}.mp4`,
            description: 'Downloading TikTok video',
        },
        }).fetch('GET', videoUrl);

        console.log("response",response)

        setDownloadPath(response.path());

        // Copy video to app's document directory
        // const copyToPath = `${RNFS.DocumentDirectoryPath}/tiktok_video_${new Date().getTime()}.mp4`;
        // await RNFS.copyFile(response.path(), copyToPath);
        // console.log("copyToPath---",copyToPath)
        // // Move video to device's Downloads directory
        // await RNFS.moveFile(copyToPath, `${dirToSave}/tiktok_video_${new Date().getTime()}.mp4`);
        // console.log("copyToPath---22",copyToPath)

    } catch (error) {
        console.log('Error downloading video:', error);
    }
    };

    return (
    <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
            style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1, marginVertical: 10 }}
            onChangeText={(text) => setVideoUrl(text)}
            value={videoUrl}
            placeholder="Enter TikTok video URL"
        />
        <TouchableOpacity onPress={handleDownloadVideo} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
            <Text style={{ color: 'white' }}>Download</Text>
        </TouchableOpacity>
        </View>
        
    </View>
    );
};

export default DownloadVideo;