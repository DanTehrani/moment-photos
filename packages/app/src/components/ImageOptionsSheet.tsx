import { View } from 'react-native';
import StyleldBottomSheet from './StyleldBottomSheet';
import StyledText from './StyledText';
import FeedbackPressable from './FeedbackPressable';
import colors from '@/lib/styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Option = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  destructive?: boolean;
};

const ImageOptionsSheet = ({
  open,
  onClose,
  options,
}: {
  open: boolean;
  onClose: () => void;
  options: Option[];
}) => {
  const insets = useSafeAreaInsets();

  return (
    <StyleldBottomSheet open={open} onClose={onClose} snapPoints={['50%']}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 4,
          paddingTop: 4,
          paddingBottom: insets.top + insets.bottom + 32,
        }}
      >
        <View style={{ rowGap: 8 }}>
          {options.map((option, index) => (
            <FeedbackPressable
              key={index}
              onPress={() => {
                option.onPress();
                onClose();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.background,
              }}
            >
              {option.icon}
              <StyledText
                style={{
                  marginLeft: 12,
                  fontSize: 16,
                  color: option.destructive ? colors.warning : colors.text,
                }}
              >
                {option.label}
              </StyledText>
            </FeedbackPressable>
          ))}
        </View>
      </View>
    </StyleldBottomSheet>
  );
};

export default ImageOptionsSheet;
