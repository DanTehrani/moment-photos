import StyledText from '@/components/StyledText';
import { trpc } from '@/lib/trpc';
import { triggerHapticFeedback } from '@/lib/utils';
import { useState } from 'react';
import { Dimensions, RefreshControl, View } from 'react-native';
import { Image } from 'expo-image';
import FeedbackPressable from '@/components/FeedbackPressable';
import StyledButton from '@/components/StyledButton';
import colors from '@/lib/styles/colors';
import { FlatList } from 'react-native-gesture-handler';
import useTypedNavigation from '@/hooks/useTypedNavigation';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamsList } from '@/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useUserId from '@/hooks/useUserId';
import { useTranslation } from 'react-i18next';
import useImageUrl from '@/hooks/useImageUrl';

const ImageItem = ({
  imageId,
  onPress,
  width,
  height,
  isSelected,
}: {
  imageId: string;
  onPress: () => void;
  width: number;
  height: number;
  isSelected: boolean;
}) => {
  const { data: imageUrl } = useImageUrl(imageId);

  return (
    <FeedbackPressable onPress={onPress}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width, height, borderRadius: 16 }}
        />
        {isSelected && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Feather name="check" size={16} color={colors.background} />
          </View>
        )}
      </View>
    </FeedbackPressable>
  );
};

type Props = NativeStackScreenProps<RootStackParamsList, 'SelectImages'>;

const SelectImages = ({ route }: Props) => {
  const { data: userId } = useUserId();
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  const [screenWidth, _setScreenWidth] = useState(
    Dimensions.get('window').width
  );
  const [refetching, setRefetching] = useState(false);

  const { mutateAsync: createAlbum, isPending: isCreatingAlbum } =
    trpc.createAlbum.useMutation();

  const { data: images, refetch: refetchImages } = trpc.getImages.useQuery(
    { userId: userId ?? '' },
    { enabled: userId !== null }
  );
  const imageFrameWidth = Math.round((screenWidth - 32 - 32) / 3);

  const navigation = useTypedNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const onSelectImage = (imageId: string) => {
    if (selectedImageIds.includes(imageId)) {
      setSelectedImageIds(selectedImageIds.filter(id => id !== imageId));
    } else {
      setSelectedImageIds([...selectedImageIds, imageId]);
    }
  };

  const onCreateAlbum = async () => {
    if (!userId) {
      return;
    }

    await createAlbum({
      userId,
      name: route.params.albumName,
      imageIds: selectedImageIds,
    });

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Tabs',
          params: {
            screen: 'Albums',
          },
        },
      ],
    });
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: insets.bottom + 8,
        paddingTop: 20,
      }}
    >
      <FlatList
        data={images ?? []}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <StyledText>{t('SelectImages:noPhotosFound')}</StyledText>
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
              imageId={img.editedImageUrl ?? img.originalImageUrl ?? ''}
              onPress={() => onSelectImage(img.id)}
              width={imageFrameWidth}
              height={imageFrameWidth}
              isSelected={selectedImageIds.includes(img.id)}
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
        {selectedImageIds.length > 0 && (
          <StyledButton
            title={t('SelectImages:clearSelections')}
            onPress={() => {
              setSelectedImageIds([]);
            }}
            variant="outline"
          />
        )}
        <StyledButton
          title={t('SelectImages:createAlbum')}
          onPress={() => {
            onCreateAlbum();
          }}
          isLoading={isCreatingAlbum}
        />
      </View>
    </View>
  );
};

export default SelectImages;
