export const STORAGE_AUTHORIZE_KEY = 'Authorization_token'

export const REQUEST_HEADER_TOKEN_KEY = 'Authorization'

export const YGT_ACCOUNT_KEY = 'YGT_ACCOUNT'

export const useAuthorization = createGlobalState(() => useStorage<null | string>(STORAGE_AUTHORIZE_KEY, null))

export const useYGTAccount = createGlobalState(() => useStorage<null | string>(YGT_ACCOUNT_KEY, null))
