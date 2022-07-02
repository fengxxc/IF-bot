# IF-bot

## install
`pnpm install`

## start
### shell
```
TG_BOT_TOKEN={you_tg_bot_token} npx ts-node .\src\main.ts 
```
### Powershell
```
$env:TG_BOT_TOKEN="{you_tg_bot_token}"; $env:TG_PROXY="{you_proxy, such as 'socks5://127.0.0.1:1080'}"; npx ts-node .\src\main.ts 
```
### cmd
```
set TG_BOT_TOKEN={you_tg_bot_token} && set TG_PROXY={you_proxy, such as 'socks5://127.0.0.1:1080'} && npx ts-node .\src\main.ts 
```