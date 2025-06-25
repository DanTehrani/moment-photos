import { ImageResponseType } from '@/types';

export type RootTabsParamsList = {
  Images: undefined;
  Settings: undefined;
  Albums: undefined;
};

export type RootStackParamsList = {
  Tabs: { screen: keyof RootTabsParamsList; params?: any };
  Dev: undefined;
  SelectLanguage: undefined;
  ImageFullScreen: {
    image: ImageResponseType;
  };
  AlbumImageFullScreen: {
    image: ImageResponseType;
    albumId: string;
  };
  CreateAlbum: undefined;
  SelectImages: {
    albumName: string;
  };
  Album: {
    albumId: string;
  };
  Albums: undefined;
  AlbumSettings: {
    albumId: string;
  };
  Advanced: undefined;
  JoinAlbum: {
    albumId: string;
    albumName: string;
  };
  Welcome: undefined;
};
