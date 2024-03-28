/// <reference types="vite/client" />

// Extend the Vite-specific ImportMetaEnv interface with your custom environment variables
interface ImportMetaEnv {
  readonly VUE_APP_API_URL: string
  // Define other environment variables as needed
}

// Extend the ImportMeta interface to include the above ImportMetaEnv type
interface ImportMeta {
  readonly env: ImportMetaEnv
}
