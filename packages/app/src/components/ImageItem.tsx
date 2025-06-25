import { View } from 'react-native';
import { Image } from 'expo-image';
import Spinner from '@/components/Spinner';
import FeedbackPressable from '@/components/FeedbackPressable';

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
          source={{ uri: originalImageUrl }}
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

export default ImageItem;
