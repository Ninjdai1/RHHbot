# RHHbot

A simple bot for the RHH discord server. Used to quickly access issues and pull request when typing #1234. Also features a PR/Issue lookup command.

## Usage
RHHbot requires NodeJS.

To install the required dependencies, run
```bash
npm install
```

To use the GitHub API, you'll need a Personal Access Token (PAT).
Create one at https://github.com/settings/tokens with no scopes enabled (the only data accessed is public, the PAT is needed to go from 60 to 15.000 allowed requests per hour).
You'll need to create a config.json file (a reference config.example.json is included in the repo) for the bot to work.

To launch it, run
```bash
node .
```
