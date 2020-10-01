export const isDev: boolean = process.env.NODE_ENV === "development";
export const server_url: string = "https://troisplay.herokuapp.com/api";
export const dev_url: string = "http://localhost:4050/api";
export const server_url_media: string = "https://troisplay.herokuapp.com/";
export const dev_url_media: string = "http://localhost:4050/";
export const url: string = isDev ? dev_url : server_url;
export const url_media: string = isDev ? dev_url_media : server_url_media;
