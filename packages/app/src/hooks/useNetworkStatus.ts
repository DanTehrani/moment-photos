import { useState, useEffect } from 'react';
// import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // const unsubscribe = NetInfo.addEventListener((status) => {
    //     setIsOffline(!status.isConnected);
    // });
    setIsOffline(false);

    return () => {
      // unsubscribe();
    };
  }, []);

  return isOffline;
};

export default useNetworkStatus;
