import {FlutterWaveTypes} from "flutterwave-react-v3"

export const isDev: boolean = process.env.NODE_ENV === "development";
export const server_url: string = "https://troisplay.herokuapp.com/api";
export const dev_url: string = "http://localhost:4050/api";
export const dev_url_media: string = "http://localhost:4050/";
export const server_url_socket: string = "https://troisplay.herokuapp.com:5040";
export const server_url_media: string = "https://troisplay.herokuapp.com/";
export const dev_url_socket: string = "http://localhost:3022";
export const socket_url: string = isDev ? dev_url_socket : server_url_socket;
export const url: string = isDev ? dev_url : server_url;
export const url_media: string = isDev ? dev_url_media : server_url_media;
export const config: FlutterWaveTypes.FlutterwaveConfig = {
    public_key: 'FLWPUBK-8c5827522df0380bb54faca18b03458e-X',
    tx_ref: new  Date().toString(),
    amount: 100,
    // NOTE: Alway change price
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
        email: 'user@gmail.com',
        phonenumber: '07064586146',
        name: 'joel ugwumadu',
    },
    // NOTE: Alway change user details
    customizations: {
      title: 'Troisplay Mobile Wallet',
      description: 'payment to your Troisplay E-Account',
      logo: 'https://troisplay2.vercel.app/images/logo.png',
    },
  };