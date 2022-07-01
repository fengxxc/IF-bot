# IF-bot

## install
`pnpm install`

## start
### shell
```
TG_BOT_TOKEN={you_tg_bot_token} node .\main.js
```
### Powershell
```
$env:TG_BOT_TOKEN="{you_tg_bot_token}"; $env:TG_PROXY="{you_proxy, such as 'socks5://127.0.0.1:1080'}"; node .\main.js
```
### cmd
```
set TG_BOT_TOKEN={you_tg_bot_token} && set TG_PROXY={you_proxy, such as 'socks5://127.0.0.1:1080'} && node .\main.js
```