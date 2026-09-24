/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUIZ_API_URL: string;
  readonly VITE_GAME_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
