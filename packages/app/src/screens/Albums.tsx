import FeedbackPressable from '@/components/FeedbackPressable';
import StyledText from '@/components/StyledText';
import TapToUpdateButton from '@/components/TapToUpdateButton';
import useUserId from '@/hooks/useUserId';
import { trpc } from '@/lib/trpc';
import { useState } from 'react';
import { Dimensions, FlatList, RefreshControl, View } from 'react-native';
import { AlbumResponseType } from '@/types';
import { Image } from 'expo-image';
import useTypedNavigation from '@/hooks/useTypedNavigation';
import StyledButton from '@/components/StyledButton';
import colors from '@/lib/styles/colors';
import { Feather } from '@expo/vector-icons';
import { triggerHapticFeedback } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import useImageUrl from '@/hooks/useImageUrl';

const AlbumListItem = ({
  album,
  thumbnail,
  imageWidth,
  imageHeight,
  onPress,
}: {
  album: AlbumResponseType;
  thumbnail?: string;
  imageWidth: number;
  imageHeight: number;
  onPress: () => void;
}) => {
  return (
    <FeedbackPressable
      onPress={onPress}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 10,
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {thumbnail ? (
          <Image
            source={{ uri: thumbnail }}
            style={{
              borderRadius: 16,
              width: imageWidth,
              height: imageHeight,
            }}
          />
        ) : (
          <View
            style={{
              width: imageWidth,
              height: imageHeight,
              backgroundColor: colors.background,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.subbedText,
            }}
          >
            <Feather name="image" size={24} color={colors.subbedText} />
          </View>
        )}
      </View>
      <StyledText>{album.Album.name}</StyledText>
    </FeedbackPressable>
  );
};

const Albums = () => {
  const [screenWidth, _setScreenWidth] = useState(
    Dimensions.get('window').width
  );
  const [refetching, setRefetching] = useState(false);

  const { data: userId } = useUserId();

  const { data: albums, refetch: refetchAlbums } = trpc.getAlbums.useQuery(
    {
      userId: userId || '',
    },
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    }
  );

  const albumFrameWidth = Math.round((screenWidth - 32 - 33) / 2);

  const { t } = useTranslation();
  const navigation = useTypedNavigation();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 20,
      }}
    >
      <FlatList
        data={albums?.filter(
          album =>
            album.Album.name !== 'Taipei 2025' && album.Album.name !== '北千住'
        )}
        renderItem={({ item }) => {
          const thumbnail = item.Album.thumbnailImageId
            ? item.Album.images.find(
                image => image.id === item.Album.thumbnailImageId
              )?.editedImageUrl
            : item.Album.images?.[0]?.editedImageUrl;

          const { data: thumbnailUrl } = useImageUrl(thumbnail ?? '');

          return (
            <AlbumListItem
              onPress={() => {
                navigation.navigate('Album', {
                  albumId: item.Album.id,
                });
              }}
              album={item}
              thumbnail={thumbnailUrl ?? undefined}
              imageWidth={albumFrameWidth}
              imageHeight={albumFrameWidth}
            />
          );
        }}
        keyExtractor={item => item.Album.id}
        ListHeaderComponent={() => <TapToUpdateButton />}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <StyledText>{t('Albums:noAlbumsFound')}</StyledText>
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          columnGap: 32,
        }}
        contentContainerStyle={{
          rowGap: 40,
          paddingBottom: 40,
        }}
        refreshControl={
          <RefreshControl
            tintColor={colors.text}
            refreshing={refetching}
            onRefresh={async () => {
              triggerHapticFeedback();
              setRefetching(true);
              await refetchAlbums();
              setRefetching(false);
            }}
          />
        }
      />
      <View>
        <StyledButton
          icon={<Feather name="plus" size={20} color={colors.background} />}
          title={t('Albums:createAlbum')}
          onPress={() => {
            navigation.navigate('CreateAlbum');
          }}
        />
      </View>
    </View>
  );
};

export default Albums;
