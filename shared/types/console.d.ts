// Added to prevent typescript from adding an import
// statement when using console.log that breaks web bundling :(

  declare module 'console' {
    export = typeof import("console");
  }
