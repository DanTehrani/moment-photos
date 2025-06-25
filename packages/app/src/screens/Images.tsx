import { Dimensions, FlatList, RefreshControl, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import StyledButton from '@/components/StyledButton';
import { Image } from 'expo-image';
import { trpc } from '@/lib/trpc';
import useSelectImages from '@/hooks/useSelectImages';
import useTypedNavigation from '@/hooks/useTypedNavigation';
import { getUserId, triggerHapticFeedback } from '@/lib/utils';
import colors from '@/lib/styles/colors';
import Spinner from '@/components/Spinner';
import FeedbackPressable from '@/components/FeedbackPressable';
import useFetchUpdates from '@/hooks/useFetchUpdates';
import TapToUpdateButton from '@/components/TapToUpdateButton';
import StyledText from '@/components/StyledText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useUserId from '@/hooks/useUserId';
import { useTranslation } from 'react-i18next';

const ImageItem = ({
  originalImageUrl,
  editedImageUrl,
  showOriginalImage,
  onPress,
  width,
  height,
  isConverting,
}: {
  originalImageUrl: string;
  editedImageUrl: string;
  showOriginalImage: boolean;
  onPress: () => void;
  width: number;
  height: number;
  isConverting: boolean;
}) => {
  if (isConverting) {
    return (
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: originalImageUrl ?? editedImageUrl }}
          style={{ width, height, borderRadius: 16 }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 16,
          }}
        >
          <Spinner strokeWidth={2} />
        </View>
      </View>
    );
  }

  return (
    <FeedbackPressable onPress={onPress}>
      <Image
        source={{ uri: showOriginalImage ? originalImageUrl : editedImageUrl }}
        style={{ width, height, borderRadius: 16 }}
      />
    </FeedbackPressable>
  );
};

const Images = () => {
  useFetchUpdates();

  const { data: userId } = useUserId();

  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [refetching, setRefetching] = useState<boolean>(false);
  const [isAddingImages, setIsAddingImages] = useState<boolean>(false);

  const [screenWidth, _setScreenWidth] = useState<number>(
    Dimensions.get('window').width
  );

  const { data: images, refetch: refetchImages } = trpc.getImages.useQuery(
    {
      userId: userId ?? '',
    },
    {
      refetchInterval: isConverting ? 1000 : false,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  const navigation = useTypedNavigation();
  const { mutateAsync: selectImages } = useSelectImages();
  const { mutateAsync: convertImages } = trpc.convertImages.useMutation();

  const [showOriginalImage, _setShowOriginalImage] = useState<boolean>(false);

  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const userId = await getUserId();

      if (!userId) {
        navigation.navigate('Welcome');
      }
    })();
  }, []);

  const onSelectImages = async () => {
    setIsAddingImages(true);
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
      });

      await refetchImages();
    }
    setIsAddingImages(false);
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

  if (!userId) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      ></View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: insets.top + 20,
      }}
    >
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
            <StyledText>{t('Images:noPhotosFound')}</StyledText>
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
              showOriginalImage={showOriginalImage}
              onPress={() => {
                navigation.navigate('ImageFullScreen', {
                  image: img,
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
      <View style={{ flexDirection: 'column', rowGap: 16 }}>
        <StyledButton
          icon={<Feather name="plus" size={20} color={colors.background} />}
          title={t('Images:addImages')}
          onPress={onSelectImages}
          isLoading={isAddingImages}
        />
      </View>
    </View>
  );
};

export default Images;
