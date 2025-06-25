import { z } from 'zod';

/**
 * Request body for `signUp`
 */
export const signUpRequestBodyType = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

/**
 * Request body for `signIn`
 */
export const signInRequestBodyType = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignInRequestBody = z.infer<typeof signInRequestBodyType>;

/**
 * Request body for `registerExpoPushToken`
 */
export const registerExpoPushTokenRequestBodyType = z.object({
  token: z.string(),
});

export type RegisterExpoPushTokenRequestBody = z.infer<
  typeof registerExpoPushTokenRequestBodyType
>;

/**
 * Request body for `createHaiku`
 */
export const createHaikuRequestBodyType = z.object({
  image: z.string(),
  instruction: z.string().optional(),
  language: z.string(),
});

export type CreateHaikuRequestBody = z.infer<typeof createHaikuRequestBodyType>;

export const createStoryRequestBodyType = z.object({
  story: z.string(),
});

export type CreateStoryRequestBody = z.infer<typeof createStoryRequestBodyType>;

export const registerUserRequestBodyType = z.object({
  userId: z.string(),
});

export type RegisterUserRequestBody = z.infer<
  typeof registerUserRequestBodyType
>;

export const registerAppleUserRequestBodyType = z.object({
  appleUserId: z.string(),
});

export type RegisterAppleUserRequestBody = z.infer<
  typeof registerAppleUserRequestBodyType
>;

export const getImagesRequestBodyType = z.object({
  userId: z.string(),
  albumId: z.string().optional(),
});

export type GetImagesRequestBody = z.infer<typeof getImagesRequestBodyType>;

export const convertImagesRequestBodyType = z.object({
  images: z.array(
    z.object({
      base64: z.string(),
      width: z.number(),
      height: z.number(),
    })
  ),
  userId: z.string(),
  albumId: z.string().optional(),
});

export type ConvertImagesRequestBody = z.infer<
  typeof convertImagesRequestBodyType
>;

export const deleteImageRequestBodyType = z.object({
  imageId: z.string(),
});

export type DeleteImageRequestBody = z.infer<typeof deleteImageRequestBodyType>;

export const recreateImageRequestBodyType = z.object({
  imageId: z.string(),
  instructions: z.string().optional(),
});

export type RecreateImageRequestBody = z.infer<
  typeof recreateImageRequestBodyType
>;

export const getAlbumsRequestBodyType = z.object({
  userId: z.string(),
});

export type GetAlbumsRequestBody = z.infer<typeof getAlbumsRequestBodyType>;

export const createAlbumRequestBodyType = z.object({
  userId: z.string(),
  name: z.string(),
  imageIds: z.array(z.string()),
});

export type CreateAlbumRequestBody = z.infer<typeof createAlbumRequestBodyType>;

export const addImageToAlbumRequestBodyType = z.object({
  imageId: z.string(),
  albumId: z.string(),
});

export type AddImageToAlbumRequestBody = z.infer<
  typeof addImageToAlbumRequestBodyType
>;

export const removeImageFromAlbumRequestBodyType = z.object({
  imageId: z.string(),
});

export type RemoveImageFromAlbumRequestBody = z.infer<
  typeof removeImageFromAlbumRequestBodyType
>;

export const setAlbumThumbnailRequestBodyType = z.object({
  albumId: z.string(),
  imageId: z.string(),
});

export type SetAlbumThumbnailRequestBody = z.infer<
  typeof setAlbumThumbnailRequestBodyType
>;

export const editAlbumNameRequestBodyType = z.object({
  albumId: z.string(),
  name: z.string(),
});

export type EditAlbumNameRequestBody = z.infer<
  typeof editAlbumNameRequestBodyType
>;

export const deleteAlbumRequestBodyType = z.object({
  albumId: z.string(),
});

export type DeleteAlbumRequestBody = z.infer<typeof deleteAlbumRequestBodyType>;

export const addImagesRequestBodyType = z.object({
  images: z.array(
    z.object({
      base64: z.string(),
      width: z.number(),
      height: z.number(),
    })
  ),
  albumId: z.string().optional(),
  userId: z.string(),
});

export type AddImagesRequestBody = z.infer<typeof addImagesRequestBodyType>;

export const updateUserSettingsRequestBodyType = z.object({
  userId: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  profilePictureUrl: z.string().optional(),
  defaultPrompt: z.string().optional(),
});

export type UpdateUserSettingsRequestBody = z.infer<
  typeof updateUserSettingsRequestBodyType
>;

export const getUserSettingsRequestBodyType = z.object({
  userId: z.string(),
});

export type GetUserSettingsRequestBody = z.infer<
  typeof getUserSettingsRequestBodyType
>;

export const getImageCountRequestBodyType = z.object({
  userId: z.string(),
  albumId: z.string().optional(),
});

export type GetImageCountRequestBody = z.infer<
  typeof getImageCountRequestBodyType
>;

export const registerCreditPurchaseRequestBodyType = z.object({
  userId: z.string(),
  credits: z.number(),
  purchaseId: z.string(),
});

export type RegisterCreditPurchaseRequestBody = z.infer<
  typeof registerCreditPurchaseRequestBodyType
>;

export const joinAlbumRequestBodyType = z.object({
  userId: z.string(),
  albumId: z.string(),
});

export type JoinAlbumRequestBody = z.infer<typeof joinAlbumRequestBodyType>;

export const getAlbumRequestBodyType = z.object({
  albumId: z.string(),
});

export type GetAlbumRequestBody = z.infer<typeof getAlbumRequestBodyType>;

export const createStripeCheckoutRequestBodyType = z.object({
  userId: z.string(),
  credits: z.number(),
  priceId: z.string(),
});

export type CreateStripeCheckoutRequestBody = z.infer<
  typeof createStripeCheckoutRequestBodyType
>;

/**
 * Request body for `track`
 */
export const trackRequestBodyType = z.object({
  properties: z.record(z.string(), z.unknown()),
  timestamp: z.number(),
  userId: z.string().optional(),
});

export type TrackRequestBody = z.infer<typeof trackRequestBodyType>;
