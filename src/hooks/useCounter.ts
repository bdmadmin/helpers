import {useEffect, useMemo, useRef, useState} from 'react';

export const useCountdown = (isConnected: boolean) => {
  const intervalTime = useRef<NodeJS.Timer>();
  let countDownDate = useMemo(() => {
    return new Date().getTime();
  }, [isConnected]);

  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    setCountDown(0);
  }, [isConnected]);

  useEffect(() => {
    intervalTime.current = setInterval(() => {
      if (isConnected) {
        setCountDown(new Date().getTime() - countDownDate);
      }
    }, 1000);
    return () => clearInterval(intervalTime.current);
  }, [countDownDate, isConnected]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  const minutesWithZero = minutes < 10 ? '0' + minutes : minutes;
  const secondWithZero = seconds < 10 ? '0' + seconds : seconds;
  return [days, hours, minutesWithZero, secondWithZero];
};
