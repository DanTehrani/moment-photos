import { View, FlatList } from 'react-native';
import StyleldBottomSheet from './StyleldBottomSheet';
import { trpc } from '@/lib/trpc';
import StyledText from './StyledText';
import FeedbackPressable from './FeedbackPressable';
import colors from '@/lib/styles/colors';
import { Image } from 'expo-image';
import useUserId from '@/hooks/useUserId';
import { AlbumResponseType } from '@/types';
import StyledButton from './StyledButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const AlbumItem = ({
  album,
  onPress,
}: {
  album: AlbumResponseType;
  onPress: () => void;
}) => {
  return (
    <FeedbackPressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: colors.background,
        marginBottom: 8,
      }}
    >
      <Image
        source={{
          uri: album.Album.images?.[0]?.editedImageUrl ?? '',
        }}
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
        }}
      />
      <StyledText
        style={{
          marginLeft: 12,
          fontSize: 16,
        }}
      >
        {album.Album.name}
      </StyledText>
    </FeedbackPressable>
  );
};

const AddToAlbumSheet = ({
  open,
  onClose,
  onSelectAlbum,
}: {
  open: boolean;
  onClose: () => void;
  onSelectAlbum: (albumId: string) => void;
}) => {
  const { data: userId } = useUserId();

  const { data: albums } = trpc.getAlbums.useQuery(
    { userId: userId ?? '' },
    { enabled: !!userId }
  );

  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <StyleldBottomSheet open={open} onClose={onClose} snapPoints={['80%']}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + insets.top + 32,
        }}
      >
        <StyledText
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 16,
          }}
        >
          {t('AddToAlbumSheet:title')}
        </StyledText>
        <FlatList
          style={{
            flex: 1,
          }}
          nestedScrollEnabled
          data={albums}
          renderItem={({ item }) => (
            <AlbumItem
              album={item}
              onPress={() => onSelectAlbum(item.Album.id)}
            />
          )}
          keyExtractor={item => item.Album.id}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <StyledText>{t('AddToAlbumSheet:noAlbumsFound')}</StyledText>
            </View>
          )}
        />
        <StyledButton
          title={t('AddToAlbumSheet:cancel')}
          onPress={() => onClose()}
          variant="outline"
        />
      </View>
    </StyleldBottomSheet>
  );
};

export default AddToAlbumSheet;
