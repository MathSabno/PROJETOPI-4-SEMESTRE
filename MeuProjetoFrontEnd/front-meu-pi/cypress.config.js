import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {

    },

    defaultCommandTimeout: 10000,

    chromeWebSecurity: false,

    baseUrl: 'http://localhost:5173',


    video: false,
  },
});