module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "semantic-release-plugin-update-version-in-files",
      {
        files: ["package.json"],
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"],
        message: "chore(release): ${nextRelease.version}",
      },
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: "npm run build",
      },
    ],
    "@semantic-release/npm",
    "@semantic-release/github",
  ],
};
