import Feather from '@expo/vector-icons/Feather';
import { View } from 'react-native';
import colors from '@/lib/styles/colors';
import FeedbackPressable from '@/components/FeedbackPressable';
import useTypedNavigation from '@/hooks/useTypedNavigation';

const Fab = () => {
  const navigation = useTypedNavigation();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        rowGap: 20,
      }}
    >
      <FeedbackPressable
        style={{
          backgroundColor: colors.text,
          borderRadius: 100,
          padding: 12,
          width: 50,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: colors.text,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={() => {
          navigation.navigate('Tabs', {
            screen: 'Images',
          });
        }}
      >
        <Feather name="plus" size={24} color={colors.background} />
      </FeedbackPressable>
    </View>
  );
};

export default Fab;
