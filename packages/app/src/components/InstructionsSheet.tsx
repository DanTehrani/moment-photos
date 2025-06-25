import { TextInput, View } from 'react-native';
import StyleldBottomSheet from './StyleldBottomSheet';
import { useState } from 'react';
import StyledButton from './StyledButton';
import colors from '@/lib/styles/colors';
import { useTranslation } from 'react-i18next';

const InstructionsSheet = ({
  open,
  onCancel,
  onConfirm,
  isConfirming,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: (instruction: string) => void;
  isConfirming: boolean;
}) => {
  const [instructions, setInstructions] = useState('');

  const onRegenerate = () => {
    onConfirm(instructions);
  };

  const { t } = useTranslation();

  return (
    <StyleldBottomSheet
      open={open}
      onClose={() => {
        onCancel();
      }}
      snapPoints={['80%']}
    >
      <View
        style={{
          flex: 1,
          rowGap: 16,
        }}
      >
        <TextInput
          placeholder={t('InstructionsSheet:instructions')}
          onChangeText={setInstructions}
          placeholderTextColor={colors.subbedText}
          autoFocus
          style={{
            width: '100%',
            height: 100,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 10,
            color: colors.text,
          }}
          multiline
        />
        <StyledButton
          title={t('InstructionsSheet:generateAgain')}
          onPress={onRegenerate}
          disabled={isConfirming}
        />
      </View>
    </StyleldBottomSheet>
  );
};

export default InstructionsSheet;
