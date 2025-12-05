const DEFAULT_BASE_PATH = "/";
const DEFAULT_IMAGE_PATH = "/";
const DEFAULT_API_BASE_URL_V1 = "http://172.172.176.106:6075/api/v1";
// const DEFAULT_API_BASE_URL_V1 = "http://localhost.106:6075/api/v1";

export const base_path = import.meta.env.VITE_BASE_PATH ?? DEFAULT_BASE_PATH;
export const image_path = import.meta.env.VITE_IMAGE_PATH ?? DEFAULT_IMAGE_PATH;
export const api_base_url =
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL_V1;
