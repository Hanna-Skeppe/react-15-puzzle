/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_ROWS: string | number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
