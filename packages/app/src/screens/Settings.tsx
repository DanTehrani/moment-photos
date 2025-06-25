import TapToUpdateButton from '@/components/TapToUpdateButton';
import { View } from 'react-native';
import StyledButton from '@/components/StyledButton';
import useTypedNavigation from '@/hooks/useTypedNavigation';
import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import useUserId from '@/hooks/useUserId';
import colors from '@/lib/styles/colors';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import StyledText from '@/components/StyledText';
import { Feather } from '@expo/vector-icons';
import FeedbackPressable from '@/components/FeedbackPressable';
import { useTranslation } from 'react-i18next';

const SettingsListItem = ({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}) => {
  return (
    <FeedbackPressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,

        paddingVertical: 16,
      }}
    >
      {icon}
      <StyledText>{title}</StyledText>
    </FeedbackPressable>
  );
};

const Settings = () => {
  const navigation = useTypedNavigation();
  const [defaultPrompt, setDefaultPrompt] = useState('');

  const { data: userId } = useUserId();

  const onAdvancedPress = () => {
    navigation.navigate('Advanced');
  };

  const queryClient = useQueryClient();

  const {
    mutateAsync: updateDefaultPrompt,
    isPending: isUpdatingDefaultPrompt,
  } = trpc.updateUserSettings.useMutation();

  const { data: userSettings } = trpc.getUserSettings.useQuery(
    {
      userId: userId ?? '',
    },
    {
      enabled: !!userId,
    }
  );

  useEffect(() => {
    if (userSettings) {
      setDefaultPrompt(userSettings.defaultPrompt ?? '');
    }
  }, [userSettings]);

  const _onSaveDefaultPromptPress = async () => {
    if (!userId) {
      return;
    }

    await updateDefaultPrompt({
      defaultPrompt: defaultPrompt.trim(),
      userId: userId,
    });

    await queryClient.invalidateQueries({
      queryKey: [getQueryKey(trpc.getUserSettings)],
    });

    Toast.show({
      text1: 'Default style updated',
    });
  };

  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 16,
      }}
    >
      <View style={{ flexDirection: 'column' }}>
        <TapToUpdateButton />
        <View style={{ flexDirection: 'column', gap: 12 }}>
          <SettingsListItem
            title={t('Settings:language')}
            icon={<Feather name="globe" size={24} color={colors.text} />}
            onPress={() => {
              navigation.navigate('SelectLanguage');
            }}
          />
          {/** 
          <TextInput
            placeholder={'Default style (e.g. 90s animation style)'}
            style={{
              borderWidth: 1,
              height: 100,
              borderColor: colors.border,
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 12,
              fontSize: 16,
              color: colors.text,
            }}
            value={defaultPrompt}
            multiline={true}
            placeholderTextColor={colors.subbedText}
            onChangeText={setDefaultPrompt}
          />
          <StyledButton
            onPress={onSaveDefaultPromptPress}
            title={'Save'}
            disabled={isUpdatingDefaultPrompt}
          />
          */}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'column',
          rowGap: 12,
        }}
      >
        <StyledButton
          onPress={onAdvancedPress}
          title={t('Settings:advanced')}
          variant={'outline'}
          isLoading={isUpdatingDefaultPrompt}
        />
      </View>
    </View>
  );
};

export default Settings;
