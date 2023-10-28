import * as React from 'react';
import {Modal, BackHandler} from 'react-native';
// import Modal from 'react-native-modalbox';
import RoundRadius from '../ui/radius/RoundRadius';
import { setpause } from '../redux/reducer/AudioVideoList/audioVideoList';
import { useDispatch } from 'react-redux';
interface RadiusModalProps {}

const RadiusModal = React.forwardRef((props, ref) => {
  const [visibleRadiusView, setVisibleRadiusView] = React.useState(false);
  const dispatch = useDispatch()

  const openCloseAction = (action: boolean) => setVisibleRadiusView(action);

  React.useImperativeHandle(ref, () => {
    return {
      openCloseAction,
    };
  });

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setVisibleRadiusView(false);
      dispatch(setpause(false))
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  const exit = () => {
    setVisibleRadiusView(false);
    dispatch(setpause(false))
  };

  return (
    <Modal visible={visibleRadiusView}>
      <RoundRadius exit={exit} />
    </Modal>
  );
});

export default RadiusModal;
