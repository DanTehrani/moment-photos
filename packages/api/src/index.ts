import 'dotenv/config';
import './lib/sentry';
import {
  router,
  createCallerFactory,
  authedProcedure,
  publicProcedure,
} from './trpc';
import { createContext } from './context';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import {
  convertImagesRequestBodyType,
  createAlbumRequestBodyType,
  deleteImageRequestBodyType,
  getAlbumsRequestBodyType,
  getImagesRequestBodyType,
  recreateImageRequestBodyType,
  registerExpoPushTokenRequestBodyType,
  registerUserRequestBodyType,
  addImageToAlbumRequestBodyType,
  removeImageFromAlbumRequestBodyType,
  setAlbumThumbnailRequestBodyType,
  editAlbumNameRequestBodyType,
  deleteAlbumRequestBodyType,
  updateUserSettingsRequestBodyType,
  getUserSettingsRequestBodyType,
  joinAlbumRequestBodyType,
  getAlbumRequestBodyType,
  trackRequestBodyType,
} from './rpcTypes';
import registerExpoPushToken from './api/registerExpoPushToken';
import getAlbums from './api/getAlbums';
import createAlbum from './api/createAlbum';
import registerUser from './api/registerUser';
import convertImages from './api/convertImages';
import getImages from './api/getImages';
import deleteImage from './api/deleteImage';
import recreateImage from './api/recreateImage';
import addImageToAlbum from './api/addImageToAlbum';
import removeImageFromAlbum from './api/removeImageFromAlbum';
import setAlbumThumbnail from './api/setAlbumThumbnail';
import editAlbumName from './api/editAlbumName';
import deleteAlbum from './api/deleteAlbum';
import updateUserSettings from './api/updateUserSettings';
import getUserSettings from './api/getUserSettings';
import joinAlbum from './api/joinAlbum';
import getAlbum from './api/getAlbum';
import track from './api/track';

export const appRouter = router({
  registerExpoPushToken: authedProcedure
    .input(registerExpoPushTokenRequestBodyType)
    .mutation(async ({ input, ctx }) => {
      return await registerExpoPushToken({
        ...input,
        userId: ctx.userId,
      });
    }),

  registerUser: publicProcedure
    .input(registerUserRequestBodyType)
    .mutation(async ({ input }) => {
      return await registerUser(input.userId);
    }),

  getImages: publicProcedure
    .input(getImagesRequestBodyType)
    .query(async ({ input }) => {
      return await getImages(input);
    }),

  convertImages: publicProcedure
    .input(convertImagesRequestBodyType)
    .mutation(async ({ input }) => {
      return await convertImages(input);
    }),

  deleteImage: publicProcedure
    .input(deleteImageRequestBodyType)
    .mutation(async ({ input }) => {
      return await deleteImage(input);
    }),

  recreateImage: publicProcedure
    .input(recreateImageRequestBodyType)
    .mutation(async ({ input }) => {
      return await recreateImage(input);
    }),

  getAlbums: publicProcedure
    .input(getAlbumsRequestBodyType)
    .query(async ({ input }) => {
      return await getAlbums(input);
    }),

  createAlbum: publicProcedure
    .input(createAlbumRequestBodyType)
    .mutation(async ({ input }) => {
      return await createAlbum(input);
    }),

  addImageToAlbum: publicProcedure
    .input(addImageToAlbumRequestBodyType)
    .mutation(async ({ input }) => {
      return await addImageToAlbum(input);
    }),

  removeImageFromAlbum: publicProcedure
    .input(removeImageFromAlbumRequestBodyType)
    .mutation(async ({ input }) => {
      return await removeImageFromAlbum(input);
    }),

  setAlbumThumbnail: publicProcedure
    .input(setAlbumThumbnailRequestBodyType)
    .mutation(async ({ input }) => {
      return await setAlbumThumbnail(input);
    }),

  editAlbumName: publicProcedure
    .input(editAlbumNameRequestBodyType)
    .mutation(async ({ input }) => {
      return await editAlbumName(input);
    }),

  deleteAlbum: publicProcedure
    .input(deleteAlbumRequestBodyType)
    .mutation(async ({ input }) => {
      return await deleteAlbum(input);
    }),

  updateUserSettings: publicProcedure
    .input(updateUserSettingsRequestBodyType)
    .mutation(async ({ input }) => {
      return await updateUserSettings(input);
    }),

  getUserSettings: publicProcedure
    .input(getUserSettingsRequestBodyType)
    .query(async ({ input }) => {
      return await getUserSettings(input);
    }),

  joinAlbum: publicProcedure
    .input(joinAlbumRequestBodyType)
    .mutation(async ({ input }) => {
      return await joinAlbum(input);
    }),

  getAlbum: publicProcedure
    .input(getAlbumRequestBodyType)
    .query(async ({ input }) => {
      return await getAlbum(input);
    }),

  track: publicProcedure
    .input(trackRequestBodyType)
    .mutation(async ({ input }) => {
      return await track(input);
    }),
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  // @ts-expect-error
  createContext,
});

server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on port 3000');
});

export * from './rpcTypes';
