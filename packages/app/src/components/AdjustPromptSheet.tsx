import { TextInput, View } from 'react-native';
import StyleldBottomSheet from './StyleldBottomSheet';
import { useState } from 'react';
import StyledButton from './StyledButton';
import colors from '@/lib/styles/colors';
import FeedbackPressable from './FeedbackPressable';
import StyledText from './StyledText';
import { useTranslation } from 'react-i18next';

const OptionButton = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => {
  return (
    <FeedbackPressable
      style={{
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.primary,
      }}
      onPress={onPress}
    >
      <StyledText style={{ color: colors.background }}>{title}</StyledText>
    </FeedbackPressable>
  );
};

const AdjustPromptSheet = ({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: (instruction: string) => void;
}) => {
  const [prompt, setPrompt] = useState('');
  const { t } = useTranslation();

  return (
    <StyleldBottomSheet
      open={open}
      onClose={() => {
        onCancel();
      }}
      snapPoints={['90%']}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <TextInput
          placeholder={t('AdjustPromptSheet:instruction')}
          onChangeText={setPrompt}
          autoFocus
          style={{
            width: '100%',
            height: 100,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 10,
          }}
          multiline
        />
        <View
          style={{
            flexDirection: 'row',
            columnGap: 16,
            marginTop: 16,
          }}
        >
          <OptionButton
            title={t('AdjustPromptSheet:funny')}
            onPress={() => {
              onConfirm(prompt + t('AdjustPromptSheet:funny'));
            }}
          />
          <OptionButton
            title={t('AdjustPromptSheet:grandly')}
            onPress={() => onConfirm(prompt + t('AdjustPromptSheet:grandly'))}
          />
        </View>
        <View
          style={{
            marginTop: 20,
          }}
        >
          <StyledButton
            onPress={() => onConfirm(prompt)}
            title={t('AdjustPromptSheet:confirm')}
            disabled={prompt.length === 0}
          />
        </View>
      </View>
    </StyleldBottomSheet>
  );
};

export default AdjustPromptSheet;
