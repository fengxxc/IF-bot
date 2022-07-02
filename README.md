# IF-bot (unfinished)
A Telegram Bot, play IF（Interactive fiction）

## install
```
npm install pnpm -g
pnpm install
```

## config && start
* `cp .env.template .env`
* overwrite config in `.env ` file
* run `pnpm start` to start the server

also you can overwrite config in start script:
### shell
```
TG_BOT_TOKEN={you_tg_bot_token} TG_PROXY={you_proxy} pnpm start
```
### Powershell
```
$env:TG_BOT_TOKEN="{you_tg_bot_token}"; $env:TG_PROXY="{you_proxy}"; pnpm.cmd start
```
### cmd
```
set TG_BOT_TOKEN={you_tg_bot_token} && set TG_PROXY={you_proxy} && pnpm start
```

## start server at developing
It will watch you code changed and restart server
```
pnpm start:watch
```

## lint
```
pnpm lint
```

## build
```
pnpm build
```
default outdir is `dist/`

## start server
make sure installed nodejs  
```
node dist/main.js
```