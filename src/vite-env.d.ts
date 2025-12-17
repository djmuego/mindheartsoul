/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly url: string;
  glob: (pattern: string, options?: { eager?: boolean; [key: string]: any }) => Record<string, any>;
}

declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  }
};
