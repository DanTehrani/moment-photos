import { BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import SheetBackDrop from './SheetBackDrop';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import colors from '@/lib/styles/colors';

const StyleldBottomSheet = ({
  open,
  children,
  onClose,
  ...props
}: {
  open: boolean;
  children: React.ReactNode;
  onClose?: () => void;
} & BottomSheetModalProps) => {
  const insets = useSafeAreaInsets();
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (open) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [open]);

  return (
    <BottomSheetModal
      stackBehavior="push"
      ref={ref}
      style={{
        marginTop: insets.top,
        paddingTop: 16,
        paddingHorizontal: 16,
        ...{
          sheetTopShadow: {
            borderRadius: 32,
            shadowColor: colors.text,
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
        },
        ...(typeof props.style === 'object' ? props.style : {}),
      }}
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      index={0}
      enablePanDownToClose
      enableDynamicSizing={false}
      snapPoints={['50%', '100%']}
      keyboardBlurBehavior="none" // Prevents the keyboard from dismissing
      backdropComponent={SheetBackDrop}
      onDismiss={onClose}
      {...props}
    >
      {children}
    </BottomSheetModal>
  );
};

export default StyleldBottomSheet;
