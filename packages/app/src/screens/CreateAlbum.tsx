import StyledButton from '@/components/StyledButton';
import colors from '@/lib/styles/colors';
import { View } from 'react-native';
import { TextInput } from 'react-native';
import useTypedNavigation from '@/hooks/useTypedNavigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CreateAlbum = () => {
  const navigation = useTypedNavigation();
  const [albumName, setAlbumName] = useState('');
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <TextInput
          placeholder={t('CreateAlbum:albumName')}
          autoFocus
          style={{
            borderRadius: 5,
            fontSize: 24,
            color: colors.text,
          }}
          placeholderTextColor={'#D0CEC8'}
          onChangeText={setAlbumName}
        />
      </View>
      <View style={{ width: '100%' }}>
        <StyledButton
          title={t('CreateAlbum:next')}
          onPress={() => {
            navigation.navigate('SelectImages', {
              albumName: albumName,
            });
          }}
        />
      </View>
    </View>
  );
};

export default CreateAlbum;
