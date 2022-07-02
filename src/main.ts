import { Telegraf } from 'telegraf'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { InkParser } from 'inkjs/compiler/Parser/InkParser'
import { Story as RuntimeStory } from 'inkjs/engine/Story'
import { PosixFileHandler } from 'inkjs/compiler/FileHandler/PosixFileHandler'
import path from 'path'
import fs from 'fs'
import { ErrorHandler } from 'inkjs/engine/Error'
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import 'dotenv/config' 

const TG_BOT_TOKEN: string | undefined = process.env.TG_BOT_TOKEN?.trim()
const TG_PROXY: string | undefined = process.env.TG_PROXY?.trim()
if (!TG_BOT_TOKEN) {
  throw new Error('TG_BOT_TOKEN is not defined')
}
console.log("TG_BOT_TOKEN: " + TG_BOT_TOKEN)
console.log("TG_PROXY: " + TG_PROXY)
// new HttpsProxyAgent(TG_PROXY)
const bot = TG_PROXY ? new Telegraf(TG_BOT_TOKEN, {
    telegram: { 
        agent: (TG_PROXY.startsWith('http') ? (new HttpsProxyAgent(TG_PROXY)) : new SocksProxyAgent(TG_PROXY))
    }
}) : new Telegraf(TG_BOT_TOKEN)

// Login widget events
bot.on('connected_website', (ctx) => ctx.reply('Website connected'))

// Telegram passport events
bot.on('passport_data', (ctx) => ctx.reply('Telegram passport connected'))

bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Hi, This is nice IF bot~')
})
bot.hears('if', ctx => {
    console.log(path.join(__dirname, "../ink/tests.ink"))
    const filePath = path.join(__dirname, "../ink/tests.ink")
    const inkString = fs.readFileSync(filePath, "utf-8");
    const onError: ErrorHandler = (message, errorType) => {
        console.log(message, errorType)
    }
    const fileHandler = new PosixFileHandler(path.join(__dirname, "../ink"))
    const parser = new InkParser(inkString, null, onError, null, fileHandler)
    const parsedStory = parser.ParseStory()
    const runtimeStory: RuntimeStory|null = parsedStory.ExportRuntime(onError)
    if (runtimeStory == null) {
        ctx.reply('Story is null')
        return
    }
    const storyText = runtimeStory.ContinueMaximally()
    console.log(storyText)
    runtimeStory.currentChoices.forEach(choice => {
        console.log(choice.text)
    })
    const choices = (() => runtimeStory.currentChoices.map(choice => ({
                    text: choice.text,
                    callback_data: choice.text
                })))()
    ctx.reply(storyText, {
        reply_markup: {
            inline_keyboard: [
                choices
            ]
        }
    })
})

bot.action(/.+/, ctx => {
    ctx.reply(`You clicked: ${ctx.match[0]}`)
})

// bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('hipster', Telegraf.reply('λ'))
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
