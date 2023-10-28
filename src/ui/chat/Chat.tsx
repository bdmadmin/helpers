import * as React from "react";
var relativeTime = require("dayjs/plugin/relativeTime");
import {
  ActivityIndicator,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import WrapperContainer from "../../components/WrapperContainer";
import imagePath from "../../config/imagePath";
import colors from "../../theme/colors";
import styles from "./styles";
import FastImage from "react-native-fast-image";
import ChatHeader from "./ChatHeader";
import AcceptSheet from "./AcceptSheet";
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Day,
  MessageImage,
} from "react-native-gifted-chat";
import socketServices from "../../service/SocketService";
import { useSelector } from "react-redux";
import {
  chatWithWithoutRoomId,
  chatWithRoomId,
  chatAcceptRequest,
  sendMessage,
  uploadFile,
} from "../../redux/actions/home";
import { showError } from "../../utils/utils";
import dayjs from "dayjs";
import commonStyles from "../../utils/commonStyles";
import { FILE_BASE_URL } from "../../config/constant";
import navigationString from "../../config/navigationString";
import { TouchableOpacity } from "react-native-gesture-handler";
import { moderateScale } from "../../theme/responsiveSize";
import useUploadImage from "../../hooks/userUploadImage";
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from "react-native-audio-recorder-player";
import { AudioPlayer } from "react-native-simple-audio-player";
import uuid from "react-native-uuid";
import Chat1 from "./Chat1";

dayjs.extend(relativeTime);
interface ChatProps {}
const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.09);
const Chat = (props: ChatProps) => {
  const { navigation } = props;
  const { item } = props?.route.params ?? {};
  const [messages, setMessages] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const isSend = React.useRef(true);
  const { openDocument, image } = useUploadImage();
  const userData = useSelector((state) => state?.authUser.authUser);
  const isAddedCheckFromMe = React.useRef(false);
  const [state, setState] = React.useState({
    isLoading: false,
    user_id: 0,
    textMessage: "",
    imageModal: false,
    modal_image: "",
    isMessageSendAlready: false,
    isRecording: false,
  });
  const IS_REQUEST_SIDE = !!item?.room;
  const [isAcceptSheetOpen, setAcceptSheet] = React.useState<boolean>(
    IS_REQUEST_SIDE && !item?.status
  );
  const { textMessage, isRecording } = state;
  const [sendLoading, setSendLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    image && uploadImage(image);
  }, [image]);  

  const uploadImage = async (file: string) => {
    const formData = new FormData();
    formData.append("images", file);
    try {
      const data = await uploadFile(formData);
      onSendRequest(data?.fileName, 1);
    } catch (error) {
      console.log("aaaaa", error);
    }
  };

  const uploadAudio = async (file: string) => {
    const formData = new FormData();
    formData.append("audios", {
      uri: file,
      type: "audio/mp4",
      name: "audio.mp4",
    });
    try {
      const data = await uploadFile(formData);
      onSendRequest(data?.fileName, 2);
    } catch (error) {
      console.log("aaaaa", error);
      showError("Please try after sometime");
    }
  };

  React.useEffect(() => {
    socketServices.initializeSocket({ userId: userData?.id }, chatListing);
    return () => {
      socketServices.removeAllListener();
    };
  }, [userData]);

  const onStartRecord = async () => {
    if (Platform.OS === "android") {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.READ_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.RECORD_AUDIO"] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("permissions granted");
        } else {
          console.log("All required permissions not granted");
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    const x = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    try {
      const uri = await audioRecorderPlayer.startRecorder(undefined, x);
      console.log("uriuriuri", uri);
    } catch (error) {}
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    uploadAudio(result);
  };

  const chatListing = async () => {
    try {
      const messageListing = IS_REQUEST_SIDE
        ? await chatWithRoomId(item?.postId, item?.room)
        : await chatWithWithoutRoomId(item?.postId);
      const sortedMessage = messageListing?.listing.map((item: any) => {
        if (
          item.sender.id !== userData.id ||
          item.sender.mobile !== userData.mobile
        ) {
          return {
            _id: uuid.v4(),
            createdAt: item.createdAt,
            text: item?.message,
            ...(item?.mediaType === 1 && {
              image: FILE_BASE_URL + item?.mediaName,
            }),
            ...(item?.mediaType === 2 && {
              audio: FILE_BASE_URL + item?.mediaName,
            }),
            user: {
              _id: item?.sender.id,
              name: item.sender.firstName + item.sender.lastName,
              avatar: item.sender.profilePic
                ? item.sender.baseUrl + item.sender.profilePic
                : "",
            },
          };
        } else {
          isAddedCheckFromMe.current = true;
          return {
            _id: uuid.v4(),
            text: item?.message,
            createdAt: item.createdAt,
            ...(item?.mediaType === 1 && {
              image: FILE_BASE_URL + item?.mediaName,
            }),
            ...(item?.mediaType === 2 && {
              audio: FILE_BASE_URL + item?.mediaName,
            }),
            user: {
              _id: -1,
              avatar: userData?.profilePic ? userData?.profilePic : "",
            },
          };
        }
      });
      setMessages(sortedMessage);
    } catch (error) {
      showError((error as Error)?.message);
    }
  };

  const updateState = (data: any) => {
    setState((updatedState: any) => ({ ...updatedState, ...data }));
  };

  const messageWrapperStyle = React.useMemo(() => {
    return {
      left: {
        backgroundColor: colors.grey,
        padding: 5,
        borderTopLeftRadius: 0,
      },
      right: {
        backgroundColor: colors.black,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 0,
        padding: 5,
      },
    };
  }, []);

  const messageTextStyle = React.useMemo(() => {
    return {
      left: {
        color: colors.white,
      },
      right: {
        color: colors.white,
      },
    };
  }, []);

  const onSend = React.useCallback((x: any = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, x));
  }, []);

  const onSendRequest = React.useCallback(
    async (fileInput?: any, type?: 1 | 2) => {
      isSend.current = false;
      console.log(
        "textMessage.trim() || fileInput",
        textMessage.trim(),
        fileInput
      );

      if (textMessage.trim() || fileInput) {
        try {
          const formData = new FormData();
          formData.append("receiverId", item?.user.id);
          formData.append("postId", item?.postId);
          if (fileInput) {
            formData.append("mediaName", fileInput);
            formData.append("mediaType", type);
          }
          if (textMessage) {
            formData.append("message", textMessage.trim());
          }
          if (item?.room) {
            formData.append("room", item?.room);
          }
          await sendMessage(formData);
          isSend.current = true;
          setSendLoading(false);
          updateState({ textMessage: "", isMessageSendAlready: true });
          onSend([
            {
              _id: uuid.v4(),
              text: textMessage,
              createdAt: new Date(),
              ...(type === 1 && {
                image: FILE_BASE_URL + fileInput,
              }),
              ...(type === 2 && {
                audio: FILE_BASE_URL + fileInput,
              }),
              user: {
                _id: -1,
                name: "",
                avatar: userData?.profilePic ?? "",
              },
            },
          ]);
        } catch (error) {
          setSendLoading(false);
          isSend.current = true;
          setSendLoading(false);
        }
      } else {
        setSendLoading(false);
        isSend.current = true;
      }
    },
    [textMessage, item, onSend, userData]
  );

  const onSendMessageButton = () => {
    if (isSend.current) {
      setSendLoading(true);
      onSendRequest();
    }
  };

  const renderSend = React.useCallback(
    (_: any) => {
      return (
        <View style={styles.renderSendContainer}>
          {!sendLoading ? (
            <TouchableOpacity
              
              onPress={onSendMessageButton}
              style={styles.sendContainer}
            >
              <Text style={styles.sendText}>{"Send"}</Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size={25} style={{ margin: 10 }} />
          )}
          {!textMessage && (
            <TouchableOpacity
              // disabled={this.state.description}
              onPress={() => {
                updateState({ isRecording: !isRecording });
                isRecording ? onStopRecord() : onStartRecord();
              }}
            >
              {isRecording ? (
                <FastImage style={styles.micIcon} source={imagePath.mic_gif} />
              ) : (
                <Image
                  source={isRecording ? imagePath.mic_gif : imagePath.mic}
                  style={styles.micIcon}
                  resizeMode={"contain"}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [onSendRequest, isRecording]
  );

  const onPressAttachment = () => {
    openDocument();
  };

  const customInputContainer = React.useCallback(
    (inputContainerProps: any) => {
      if (item?.post_info?.status === 1) {
        return <View />;
      }
      return (
        <InputToolbar
          {...inputContainerProps}
          options={{}}
          containerStyle={styles.inputContainer}
          renderComposer={() => (
            <View style={styles.itemContainer}>
              <Pressable
             
              onPress={onPressAttachment}>
                <Image
                  style={{ marginStart: moderateScale(6) }}
                  source={imagePath.attachment}
                />
              </Pressable>
              <TextInput
                placeholder={"Type a message"}
                placeholderTextColor={colors.grey}
                style={styles.customInputContainer}
                multiline
                value={textMessage}
                onChangeText={(text) => updateState({ textMessage: text })}
              />
            </View>
          )}
        />
      );
    },
    [textMessage, item]
  );

  const renderBubble = React.useCallback(
    (bubbleProps: any) => {
      const currentMessage = bubbleProps.currentMessage;
      return (
        <View style={styles.bubbleContainer}>
          <FastImage
            source={
              currentMessage?.user?.avatar
                ? { uri: currentMessage?.user?.avatar }
                : imagePath.user
            }
            style={{
              ...styles.userImage,
              alignSelf:
                currentMessage?.user?._id === -1 ? "flex-end" : "flex-start",
            }}
          />
          <Bubble
            {...bubbleProps}
            wrapperStyle={messageWrapperStyle}
            textStyle={messageTextStyle}
            renderMessageImage={(imageProps) => {
              return <MessageImage {...imageProps} />;
            }}
            renderMessageAudio={() => {
              return (
                <>
                  <AudioPlayer url={currentMessage.audio} />
                  <Text style={styles.time}>
                    {dayjs()?.to(currentMessage?.createdAt)}
                  </Text>
                </>
              );
            }}
            renderMessageText={(messageProps: any) => {
              return (
                <View>
                  <Text style={styles.messageText}>
                    {messageProps?.currentMessage?.text}
                  </Text>
                  <Text style={styles.time}>
                    {dayjs()?.to(currentMessage?.createdAt)}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      );
    },
    [messageTextStyle, messageWrapperStyle]
  );

  const navigateToProfile = () => {
    navigation.navigate(navigationString.OTHER_USER_PROFILE, { user: item });
  };

  const UserDetail = React.useCallback(() => {
    return (
      <View style={styles.userDetailParentContainer}>
        <View style={styles.userDetailContainer}>
          <View style={styles.userDetailItemContainer}>
            <FastImage
              style={styles.user}
              source={{ uri: FILE_BASE_URL + item?.user?.profilePic }}
            />
            <Text
              style={{
                ...commonStyles.fontBold16,
                textAlign: "center",
                width: "100%",
              }}
            >
              {item?.user?.firstName?.replace(
                /\b[a-z]/g,
                function (letter: string) {
                  return letter.toUpperCase();
                }
              ) +
                " " +
                item?.user?.lastName +
                "    "}
              <Image
                style={styles.gender}
                source={
                  item?.user?.gender === "male"
                    ? imagePath.male
                    : imagePath.femenine
                }
              />
            </Text>
            <TouchableOpacity onPress={navigateToProfile}>
              <Image style={styles.frame} source={imagePath.Frame} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [item]);

  const onPressAction = React.useCallback(
    async (actionType: number) => {
      setLoading(true);
      try {
        await chatAcceptRequest(actionType.toString(), {
          postId: item?.postId.toString(),
          room: item?.room,
        });
        setLoading(false);
        setAcceptSheet(false);
      } catch (error) {
        setLoading(false);
        showError((error as Error).message);
      }
    },
    [item]
  );

  return (
    <WrapperContainer isLoading={isLoading}>
      <FastImage
        style={styles.backgroundImageContainer}
        tintColor={colors.error}
        source={imagePath.chat_bg}
      />
      <ChatHeader onPressAction={onPressAction} item={item} />
      <View style={{ flex: 1 }}>
        {/* {!messages.length && <UserDetail />} */}
        <Chat1 Room={item?.room} item={item}/>
        {/* <GiftedChat
          messages={messages}
          user={{
            _id: -1,
          }}
          alwaysShowSend={true}
          showUserAvatar={true}
          renderSend={renderSend}
          renderInputToolbar={customInputContainer}
          renderBubble={renderBubble}
          renderTime={(_: any) => null}
          renderDay={(dayProps) => (
            <Day {...dayProps} textStyle={{ ...commonStyles.fontSize12 }} />
          )}
          renderAvatar={() => null}
          showAvatarForEveryMessage={true}
          alignTop={messages.length > 10 ? false : true}
        /> */}
      </View>
      {item?.post_info?.status === 1 && (
        <View style={styles.acceptContainer}>
          <Text style={{ ...commonStyles.fontBold16, alignSelf: "center" }}>
            {"This chat will be delete after a week"}
          </Text>
        </View>
      )}
      {isAcceptSheetOpen && (
        <AcceptSheet onPressAction={onPressAction} item={item} />
      )}
    </WrapperContainer>
  );
};

export default Chat;
