export interface Config {
  readonly apiURL: string;
}

export const config: Config = {
  apiURL: 'http://localhost:5000/api',
};

export default config;
