import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import colors from '@/lib/styles/colors';
import useTypedNavigation from '@/hooks/useTypedNavigation';
import { useEffect, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import FeedbackPressable from '@/components/FeedbackPressable';
import useDownloadImage from '@/hooks/useDownloadImage';
import Spinner from '@/components/Spinner';
import StyledText from '@/components/StyledText';
import {
  FlatList,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { ImageResponseType } from '@/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@/navigation/types';
import InstructionsSheet from '@/components/InstructionsSheet';
import AddToAlbumSheet from '@/components/AddToAlbumSheet';
import ImageOptionsSheet from '@/components/ImageOptionsSheet';
import useUserId from '@/hooks/useUserId';
import LimitInfoSheet from '@/components/LimitInfoSheet';
import { useTranslation } from 'react-i18next';

const ActionButton = ({
  onPress,
  icon,
  label,
}: {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <FeedbackPressable
      onPress={onPress}
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: 8,
      }}
    >
      {icon}
      <StyledText style={{ fontSize: 14 }}>{label}</StyledText>
    </FeedbackPressable>
  );
};

const ImageFullScreen = ({ image }: { image: ImageResponseType }) => {
  const [screenWidth, _setScreenWidth] = useState<number>(
    Dimensions.get('window').width
  );

  const aspectRatio = 1;
  const imageWidth = screenWidth;
  const imageHeight = Math.round(imageWidth / aspectRatio);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingBottom: 40,
      }}
    >
      <Image
        source={{ uri: image.editedImageUrl ?? image.originalImageUrl ?? '' }}
        style={{
          width: imageWidth,
          height: imageHeight,
        }}
      />
    </View>
  );
};

type Props = NativeStackScreenProps<RootStackParamsList, 'ImageFullScreen'>;

const Images = ({ route }: Props) => {
  const { image } = route.params;
  const flatListRef = useRef<FlatList>(null);

  const { data: userId } = useUserId();
  const [currentImage, setCurrentImage] = useState<ImageResponseType | null>(
    null
  );
  const [instructionsSheetOpen, setInstructionsSheetOpen] = useState(false);
  const [imageSaved, setImageSaved] = useState(false);
  const [screenWidth, _setScreenWidth] = useState(
    Dimensions.get('window').width
  );
  const [addToAlbumSheetOpen, setAddToAlbumSheetOpen] = useState(false);
  const [optionsSheetOpen, setOptionsSheetOpen] = useState(false);
  const [limitInfoSheetOpen, setLimitInfoSheetOpen] = useState(false);

  const insets = useSafeAreaInsets();
  const navigation = useTypedNavigation();

  const { data: images } = trpc.getImages.useQuery(
    {
      userId: userId ?? '',
    },
    {
      enabled: !!userId,
      throwOnError: false,
    }
  );

  useEffect(() => {
    setCurrentImage(image);
    if (images) {
      const imageIndex = images.findIndex(img => img.id === image.id);

      if (imageIndex === -1) {
        return;
      }

      // wait until the list has laid out at least the first item
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: imageIndex ?? 0,
          animated: false,
        });
      }, 0);
    }
  }, [image, images]);

  const { mutateAsync: addImageToAlbum } = trpc.addImageToAlbum.useMutation();

  const { mutateAsync: deleteImage } = trpc.deleteImage.useMutation();
  const queryClient = useQueryClient();

  const { mutateAsync: downloadImage, isPending: isDownloading } =
    useDownloadImage();

  const { mutateAsync: recreateImage, isPending: isRecreating } =
    trpc.recreateImage.useMutation();

  const [isConfirming, setIsConfirming] = useState(false);

  const onDeletePress = async () => {
    if (!currentImage) return;

    setLimitInfoSheetOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!currentImage) return;

    await deleteImage({ imageId: currentImage.id });
    await queryClient.invalidateQueries({
      queryKey: getQueryKey(trpc.getImages),
    });
    navigation.goBack();
  };

  const onSavePress = async () => {
    if (currentImage) {
      await downloadImage(
        currentImage.editedImageUrl ?? currentImage.originalImageUrl
      );
      setImageSaved(true);
    }
  };

  const onAgainPress = async () => {
    // open instructions sheet
    setInstructionsSheetOpen(true);
  };

  const onRegenerate = async (instructions: string) => {
    if (currentImage) {
      setIsConfirming(true);
      await recreateImage({ imageId: currentImage.id, instructions });
      await queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.getImages),
      });

      navigation.goBack();
      setIsConfirming(false);
    }
  };

  const downloadIcon = imageSaved ? (
    <Feather name="check" size={24} color={colors.text} />
  ) : isDownloading ? (
    <Spinner size={24} strokeWidth={2} />
  ) : (
    <Feather name="download" size={24} color={colors.subbedText} />
  );

  const updateDirection = (newDirection: string | null) => {
    if (newDirection === 'down') {
      navigation.navigate('Tabs', {
        screen: 'Images',
      });
    }
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    // divide by the page width and round
    const pageIndex = Math.round(offsetX / screenWidth);

    const image = images?.[pageIndex];
    if (image) {
      setCurrentImage(image);
    }
  };

  const onAddToAlbumPress = () => {
    setAddToAlbumSheetOpen(true);
  };

  const onSelectAlbum = async (albumId: string) => {
    if (!currentImage?.id) return;

    await addImageToAlbum({
      imageId: currentImage.id,
      albumId,
    });

    await queryClient.invalidateQueries({
      queryKey: getQueryKey(trpc.getImages),
    });

    setAddToAlbumSheetOpen(false);
    navigation.navigate('Album', {
      albumId,
    });
  };

  const pan = Gesture.Pan()
    .onUpdate(e => {
      'worklet';
      const TH = 10; // threshold in pixels

      // positive translationY → dragging down
      if (e.translationY > TH) {
        runOnJS(updateDirection)('down');
      }
      // negative → dragging up
      else if (e.translationY < -TH) {
        runOnJS(updateDirection)('up');
      }
    })
    .onEnd(() => {
      'worklet';
      runOnJS(updateDirection)(null);
    });

  const { t } = useTranslation();

  const imageOptions = [
    {
      icon: <Feather name="plus" size={16} color={colors.text} />,
      label: t('ImageFullScreen:addToAlbum'),
      onPress: onAddToAlbumPress,
    },
    {
      icon: <Feather name="trash" size={16} color={colors.warning} />,
      label: t('ImageFullScreen:delete'),
      onPress: onDeletePress,
      destructive: true,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
            paddingBottom: 40,
          }}
        >
          <FlatList
            ref={flatListRef}
            data={images ?? []}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ flex: 1 }}>
                <ImageFullScreen image={item} />
              </View>
            )}
            onMomentumScrollEnd={onScrollEnd}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={1}
          />
          <View
            style={{
              position: 'absolute',
              flexDirection: 'column',
              justifyContent: 'space-around',
              bottom: insets.bottom + 20,
              alignItems: 'center',
              width: '100%',
              rowGap: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <ActionButton
                onPress={onSavePress}
                icon={downloadIcon}
                label={t('ImageFullScreen:save')}
              />

              <ActionButton
                onPress={onAgainPress}
                icon={
                  isRecreating ? (
                    <Spinner size={24} strokeWidth={2} />
                  ) : (
                    <Feather
                      name="refresh-cw"
                      size={24}
                      color={colors.subbedText}
                    />
                  )
                }
                label={t('ImageFullScreen:again')}
              />
              <ActionButton
                onPress={() => setOptionsSheetOpen(true)}
                icon={
                  <Feather
                    name="more-horizontal"
                    size={24}
                    color={colors.text}
                  />
                }
                label={t('ImageFullScreen:more')}
              />
            </View>
          </View>
        </View>
      </GestureDetector>
      <LimitInfoSheet
        open={limitInfoSheetOpen}
        onClose={() => setLimitInfoSheetOpen(false)}
        onConfirm={onConfirmDelete}
      />
      <InstructionsSheet
        open={instructionsSheetOpen}
        onCancel={() => setInstructionsSheetOpen(false)}
        onConfirm={onRegenerate}
        isConfirming={isConfirming}
      />
      <AddToAlbumSheet
        open={addToAlbumSheetOpen}
        onClose={() => setAddToAlbumSheetOpen(false)}
        onSelectAlbum={onSelectAlbum}
      />
      <ImageOptionsSheet
        open={optionsSheetOpen}
        onClose={() => setOptionsSheetOpen(false)}
        options={imageOptions}
      />
    </View>
  );
};

export default Images;
