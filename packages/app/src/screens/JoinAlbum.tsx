import { View } from 'react-native';
import { trpc } from '@/lib/trpc';
import StyledButton from '@/components/StyledButton';
import StyledText from '@/components/StyledText';
import useUserId from '@/hooks/useUserId';
import useTypedNavigation from '@/hooks/useTypedNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@/navigation/types';
import Feather from '@expo/vector-icons/Feather';
import colors from '@/lib/styles/colors';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<RootStackParamsList, 'JoinAlbum'>;

const JoinAlbum = ({ route }: Props) => {
  const { albumId, albumName } = route.params;
  const { data: userId } = useUserId();
  const navigation = useTypedNavigation();

  const { mutateAsync: joinAlbum, isPending } = trpc.joinAlbum.useMutation();

  const handleJoinAlbum = async () => {
    if (!userId) return;

    await joinAlbum({
      userId,
      albumId,
    });

    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs', params: { screen: 'Albums' } }],
    });
  };

  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ alignItems: 'center', width: '100%' }}>
        <StyledText
          style={{
            fontSize: 16,
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          {t('JoinAlbum:youHaveBeenInvitedToJoin', { albumName })}
        </StyledText>
        <View style={{ width: '100%' }}>
          <StyledButton
            icon={
              <Feather name="arrow-right" size={20} color={colors.background} />
            }
            title={t('JoinAlbum:joinAlbum')}
            onPress={handleJoinAlbum}
            isLoading={isPending}
          />
        </View>
      </View>
    </View>
  );
};

export default JoinAlbum;
