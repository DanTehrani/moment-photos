import { AppRouter } from '@moment/api';
import { inferRouterOutputs } from '@trpc/server';

export type ImageResponseType =
  inferRouterOutputs<AppRouter>['getImages'][number];

export type AlbumResponseType =
  inferRouterOutputs<AppRouter>['getAlbums'][number];
