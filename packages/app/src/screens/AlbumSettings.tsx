import { View, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@/navigation/types';
import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import colors from '@/lib/styles/colors';
import StyledText from '@/components/StyledText';
import useTypedNavigation from '@/hooks/useTypedNavigation';
import Toast from 'react-native-toast-message';
import StyledButton from '@/components/StyledButton';
import useAlbum from '@/hooks/useAlbum';
import ProfileImage from '@/components/ProfileImage';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<RootStackParamsList, 'AlbumSettings'>;

const AlbumSettings = ({ route }: Props) => {
  const { albumId } = route.params;
  const navigation = useTypedNavigation();
  const queryClient = useQueryClient();
  const [albumName, setAlbumName] = useState('');

  const album = useAlbum(albumId);

  useEffect(() => {
    if (album?.Album.name) {
      setAlbumName(album.Album.name);
    }
  }, [album?.Album.name]);

  const { mutateAsync: editAlbumName, isPending } =
    trpc.editAlbumName.useMutation();

  const { mutateAsync: deleteAlbum, isPending: isDeleting } =
    trpc.deleteAlbum.useMutation();

  const onSave = async () => {
    try {
      await editAlbumName({
        albumId,
        name: albumName,
      });

      await queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.getAlbums),
      });

      Toast.show({
        text1: 'Album name updated',
        type: 'success',
      });

      navigation.goBack();
    } catch (_error) {
      Toast.show({
        text1: 'Failed to update album name',
        type: 'error',
      });
    }
  };

  const onDelete = async () => {
    try {
      Alert.alert(
        'Delete Album',
        'Are you sure you want to delete this album?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteAlbum({ albumId });
              await queryClient.invalidateQueries({
                queryKey: getQueryKey(trpc.getAlbums),
              });
              Toast.show({ text1: 'Album deleted', type: 'success' });
              navigation.navigate('Tabs', {
                screen: 'Albums',
              });
            },
          },
        ]
      );
    } catch (_error) {
      Toast.show({ text1: 'Failed to delete album', type: 'error' });
    }
  };

  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 40,
      }}
    >
      <View style={{ flex: 1 }}>
        <StyledText
          style={{ fontSize: 16, marginBottom: 8, color: colors.subbedText }}
        >
          {t('AlbumSettings:albumName')}
        </StyledText>
        <TextInput
          value={albumName}
          onChangeText={setAlbumName}
          autoFocus
          style={{
            backgroundColor: colors.card,
            borderRadius: 8,
            paddingVertical: 12,
            color: colors.text,
            fontSize: 16,
          }}
          placeholder="Enter album name"
          placeholderTextColor={colors.subbedText}
        />
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 32,
            marginBottom: 16,
          }}
        >
          <StyledText
            style={{
              fontSize: 16,
              color: colors.subbedText,
              marginBottom: 8,
            }}
          >
            {'Users'}
          </StyledText>
          <View style={{ flexDirection: 'column', rowGap: 16, marginTop: 8 }}>
            {album?.Album.users.map(user => (
              <View
                key={user.User.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <ProfileImage
                  imageUri={user.User.profilePictureUrl}
                  size={30}
                />
                <StyledText>{user.User.name}</StyledText>
                <StyledText
                  style={{
                    fontSize: 12,
                    color: colors.subbedText,
                    textTransform: 'capitalize',
                  }}
                >
                  {'('}
                  {user.role.toLowerCase()}
                  {')'}
                </StyledText>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'column', gap: 16 }}>
        <StyledButton
          title="Delete album"
          onPress={onDelete}
          isLoading={isDeleting}
          variant="destructive"
        />
        <StyledButton title="Save" onPress={onSave} isLoading={isPending} />
      </View>
    </View>
  );
};

export default AlbumSettings;
