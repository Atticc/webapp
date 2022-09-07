module.exports = {
  root: true,
  extends: ["custom", "next", "prettier"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
