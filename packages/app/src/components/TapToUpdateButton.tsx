import Feather from '@expo/vector-icons/Feather';
import StyledText from './StyledText';
import colors from '@/lib/styles/colors';
import FeedbackPressable from './FeedbackPressable';
import * as Updates from 'expo-updates';
import useAsyncStorageValue from '@/hooks/useAsyncStorageValue';
import { UPDATE_AVAILABLE_KEY } from '@/lib/asyncStorageKeys';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

const TapToUpdateButton = () => {
  const { data: readyToUpdate } =
    useAsyncStorageValue<boolean>(UPDATE_AVAILABLE_KEY);

  const onPress = async () => {
    await Updates.reloadAsync();
  };

  const { t } = useTranslation();

  if (!readyToUpdate) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
      <FeedbackPressable
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 6,
        }}
      >
        <Feather name="rotate-ccw" size={16} color={colors.subbedText} />
        <StyledText style={{ color: colors.subbedText }}>
          {t('TapToUpdateButton:newVersion')}
        </StyledText>
      </FeedbackPressable>
    </View>
  );
};

export default TapToUpdateButton;
