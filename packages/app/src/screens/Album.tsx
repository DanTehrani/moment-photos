import { Dimensions, FlatList, RefreshControl, View } from 'react-native';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import StyledButton from '@/components/StyledButton';
import { trpc } from '@/lib/trpc';
import useSelectImages from '@/hooks/useSelectImages';
import useTypedNavigation from '@/hooks/useTypedNavigation';
import { copyToClipboard, triggerHapticFeedback } from '@/lib/utils';
import colors from '@/lib/styles/colors';
import useFetchUpdates from '@/hooks/useFetchUpdates';
import TapToUpdateButton from '@/components/TapToUpdateButton';
import StyledText from '@/components/StyledText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@/navigation/types';
import { Feather } from '@expo/vector-icons';
import useAlbum from '@/hooks/useAlbum';
import useUserId from '@/hooks/useUserId';
import Toast from 'react-native-toast-message';
import ImageItem from '@/components/ImageItem';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<RootStackParamsList, 'Album'>;

const Album = ({ route }: Props) => {
  useFetchUpdates();

  const { albumId } = route.params;

  const { data: userId } = useUserId();
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [refetching, setRefetching] = useState<boolean>(false);
  const [screenWidth, _setScreenWidth] = useState<number>(
    Dimensions.get('window').width
  );
  const [showEditedImage, _setShowEditedImage] = useState<boolean>(true);

  const album = useAlbum(albumId);
  const navigation = useTypedNavigation();

  useEffect(() => {
    if (album?.Album.name) {
      navigation.setOptions({
        title: album.Album.name,
      });
    }
  }, [album?.Album.name, navigation]);

  const { data: images, refetch: refetchImages } = trpc.getImages.useQuery(
    {
      userId: userId ?? '',
      albumId,
    },
    {
      refetchInterval: isConverting ? 1000 : false,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      enabled: !!userId,
      throwOnError: false,
    }
  );

  const { mutateAsync: selectImages } = useSelectImages();
  const { mutateAsync: convertImages, isPending: isAddingImages } =
    trpc.convertImages.useMutation();

  const onSelectImages = async () => {
    const result = await selectImages();

    const selectedImages = result.assets
      ?.map(asset => {
        const { width, height } = asset;

        return {
          base64: asset.base64,
          width,
          height,
        };
      })
      .filter(
        base64 => base64.base64 !== null && base64.base64 !== undefined
      ) as {
      base64: string;
      width: number;
      height: number;
    }[];

    if (selectedImages) {
      await convertImages({
        images: selectedImages,
        userId: userId ?? '',
        albumId,
      });

      refetchImages();
    }
  };

  const onSharePress = async () => {
    const prefix = Linking.createURL('/');
    const host = 'https://moment-web.onrender.com';
    const domain = `${host}/join/${albumId}?albumName=${album?.Album.name}&prefix=${prefix}`;
    const shareLink = domain;

    await copyToClipboard(shareLink);

    Toast.show({
      text1: t('Album:copiedShareableLink'),
      type: 'success',
    });
  };

  const pendingImages = images?.filter(image => !image.editedImageUrl) ?? [];

  const imageFrameWidth = Math.round((screenWidth - 32 - 32) / 3);

  useEffect(() => {
    if (pendingImages.length > 0) {
      setIsConverting(true);
    } else {
      setIsConverting(false);
    }
  }, [pendingImages]);

  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 20,
      }}
    >
      {/**
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          columnGap: 8,
          alignItems: 'center',
        }}
      >
        <StyledText
          style={{
            fontWeight: 'bold',
          }}
        >
          {`Anime`}
        </StyledText>
        <Switch
          value={showEditedImage}
          onValueChange={e => {
            setShowEditedImage(e);
          }}
        />
      </View>
       */}
      <FlatList
        data={images}
        ListHeaderComponent={() => <TapToUpdateButton />}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <StyledText>{t('Album:noPhotosFound')}</StyledText>
          </View>
        )}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          columnGap: 16,
        }}
        contentContainerStyle={{
          rowGap: 16,
          paddingBottom: 40,
        }}
        renderItem={({ item: img }) => (
          <View
            style={{
              width: imageFrameWidth,
              height: imageFrameWidth,
            }}
          >
            <ImageItem
              originalImageUrl={img.originalImageUrl ?? ''}
              editedImageUrl={img.editedImageUrl ?? ''}
              showOriginalImage={!showEditedImage}
              onPress={() => {
                navigation.navigate('AlbumImageFullScreen', {
                  image: img,
                  albumId,
                });
              }}
              width={imageFrameWidth}
              height={imageFrameWidth}
              isConverting={img.editedImageUrl === null}
            />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        refreshControl={
          <RefreshControl
            tintColor={colors.text}
            refreshing={refetching}
            onRefresh={async () => {
              triggerHapticFeedback();
              setRefetching(true);
              await refetchImages();
              setRefetching(false);
            }}
          />
        }
      />
      <View style={{ flexDirection: 'row', columnGap: 16 }}>
        <View style={{ flex: 1 }}>
          <StyledButton
            title={t('Album:share')}
            icon={<Feather name="share" size={16} color={colors.text} />}
            onPress={onSharePress}
            variant="outline"
          />
        </View>
        <View style={{ flex: 1 }}>
          <StyledButton
            icon={<Feather name="plus" size={16} color={colors.background} />}
            title={isAddingImages ? t('Album:uploading') : t('Album:addImages')}
            onPress={onSelectImages}
            isLoading={isAddingImages}
          />
        </View>
      </View>
    </View>
  );
};

export default Album;
