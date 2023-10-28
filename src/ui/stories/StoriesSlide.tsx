/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Platform, View} from 'react-native';
import {width} from '../../theme/responsiveSize';
import CubeNavigationHorizontal from './navigationAnimation/CubicNavigationHorizontal';
import AndroidCubeEffect from './navigationAnimation/AndroidCubeEffect';
import StoryListItem from './StoryListItem';
import {isNullOrWhitespace} from '../../utils/helper';
import {FILE_BASE_URL} from '../../config/constant';
import colors from '../../theme/colors';
import ModalBox from './ModalBox';
interface StoriesSlideProps {
  data: any;
  refreshList?: () => void;
}

export interface Status {
  _handleStoryItemPress: (index: number) => void;
}

const StoriesSlide = React.forwardRef((props: StoriesSlideProps, ref: any) => {
  const {data, refreshList} = props;
  const [dataState, setDataState] = React.useState(data);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [selectedData, setSelectedData] = React.useState([]);
  const cube = React.useRef<any>();

  React.useEffect(() => {
    setDataState(data);
  }, [data]);

  function onStoryFinish(state: any) {
    if (!isNullOrWhitespace(state)) {
      if (state === 'next') {
        const newPage = currentPage + 1;
        if (newPage < selectedData.length) {
          setCurrentPage(newPage);
          cube?.current?.scrollTo(newPage);
        } else {
          setIsModalOpen(false);
          setCurrentPage(0);
          // if (onClose) {
          //   onClose(selectedData[selectedData.length - 1]);
          // }
        }
      } else if (state == 'previous') {
        const newPage = currentPage - 1;
        if (newPage < 0) {
          setIsModalOpen(false);
          setCurrentPage(0);
        } else {
          setCurrentPage(newPage);
          cube?.current?.scrollTo(newPage);
        }
      }
    }
  }

  React.useImperativeHandle(ref, (): Status => {
    return {
      _handleStoryItemPress,
    };
  });

  const _handleStoryItemPress = (index: number) => {
    const newData = dataState?.slice(index);
    setCurrentPage(0);
    setSelectedData(newData);
    setIsModalOpen(true);
  };

  const renderStoryList = () =>
    selectedData.map((x: any, i: number) => {
      return (
        <StoryListItem
          duration={5 * 1000}
          key={i}
          profileName={x?.firstName + ' ' + x?.lastName}
          profileImage={FILE_BASE_URL + x.profilePic}
          userId={x?.id}
          stories={x?.user_post}
          currentPage={currentPage}
          onFinish={onStoryFinish}
          swipeText={''}
          onClosePress={() => {
            setIsModalOpen(false);
            refreshList && refreshList();
          }}
          index={i}
        />
      );
    });

  const renderCube = () => {
    if (Platform.OS === 'ios') {
      return (
        <CubeNavigationHorizontal
          ref={cube}
          callBackAfterSwipe={(x: any) => {
            if (x !== currentPage) {
              setCurrentPage(parseInt(x, 10));
            }
          }}>
          {renderStoryList()}
        </CubeNavigationHorizontal>
      );
    } else {
      return (
        <AndroidCubeEffect
          ref={cube}
          callBackAfterSwipe={(x: any) => {
            if (x !== currentPage) {
              setCurrentPage(parseInt(x, 10));
            }
          }}>
          {renderStoryList()}
        </AndroidCubeEffect>
      );
    }
  };

  return (
    <View>
      <ModalBox
        style={{
          flex: 1,
          height: 100,
          width: width,
          backgroundColor: colors.black,
        }}
        isOpen={isModalOpen}
        position="top"
        swipeToClose
        swipeArea={250}
        backButtonClose={false}
        coverScreen={true}>
        {renderCube()}
      </ModalBox>
    </View>
  );
});

export default StoriesSlide;
