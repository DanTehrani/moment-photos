import { View } from 'react-native';
import StyleldBottomSheet from './StyleldBottomSheet';
import StyledText from './StyledText';
import StyledButton from './StyledButton';
import colors from '@/lib/styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const LimitInfoSheet = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const insets = useSafeAreaInsets();

  const handleConfirm = async () => {
    onConfirm();
    onClose();
  };

  const { t } = useTranslation();

  return (
    <StyleldBottomSheet open={open} onClose={onClose} snapPoints={['40%']}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingBottom: insets.top + insets.bottom + 32,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <StyledText
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 16,
            }}
          >
            {t('LimitInfoSheet:title')}
          </StyledText>
          <StyledText
            style={{
              fontSize: 16,
              color: colors.subbedText,
              marginBottom: 24,
            }}
          >
            {t('LimitInfoSheet:deleteImageDescription')}
          </StyledText>
        </View>
        <View style={{ flexDirection: 'column', gap: 16 }}>
          <StyledButton
            title={t('LimitInfoSheet:deleteImage')}
            onPress={handleConfirm}
            variant="destructive"
          />
        </View>
      </View>
    </StyleldBottomSheet>
  );
};

export default LimitInfoSheet;
