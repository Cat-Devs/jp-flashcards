const PROD = process.env.PROD;
const NODE_ENV = process.env.NODE_ENV;

export const isProd = PROD === 'true' || NODE_ENV === 'production';
export const isDev = !isProd;
