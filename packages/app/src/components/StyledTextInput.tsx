import { TextInput, TextInputProps } from 'react-native';
import colors from '@/lib/styles/colors';

const StyledTextInput = (props: TextInputProps) => {
  return (
    <TextInput
      {...props}
      style={[
        {
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.subbedText,
          borderRadius: 8,
          padding: 12,
          color: colors.text,
          fontSize: 16,
        },
        props.style,
      ]}
      placeholderTextColor={colors.subbedText}
    />
  );
};

export default StyledTextInput;
