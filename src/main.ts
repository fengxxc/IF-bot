import { Telegraf } from 'telegraf'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import 'dotenv/config' 
import LocalSession from 'telegraf-session-local'
import StoryContext from './StoryContext'
import BotAction, { Choice } from './BotAction'
import StoryUtil from './StoryUtil'

const TG_BOT_TOKEN: string | undefined = process.env.TG_BOT_TOKEN?.trim()
const TG_PROXY: string | undefined = process.env.TG_PROXY?.trim()
if (!TG_BOT_TOKEN) {
  throw new Error('TG_BOT_TOKEN is not defined')
}
console.log("TG_BOT_TOKEN: " + TG_BOT_TOKEN)
console.log("TG_PROXY: " + TG_PROXY)
// new HttpsProxyAgent(TG_PROXY)
const bot = TG_PROXY ? new Telegraf<StoryContext>(TG_BOT_TOKEN, {
    telegram: { 
        agent: (TG_PROXY.startsWith('http') ? (new HttpsProxyAgent(TG_PROXY)) : new SocksProxyAgent(TG_PROXY))
    }
}) : new Telegraf<StoryContext>(TG_BOT_TOKEN)

// session location
bot.use((new LocalSession({ database: '.work/.story_states_db.json' })).middleware())


bot.action(/(^choice|^story|^restart):(.+):(.*)/, ctx => {
    const [type, storyName, choiceRaw] = ctx.match.slice(1)
    // console.log(`type: ${type}, storyName: ${storyName}, choiceRaw: ${choiceRaw}`)
    const choiceRawSpl = choiceRaw.split("_").map(x => parseInt(x))
    const choice: Choice = { threadIndex: choiceRawSpl[0], index: choiceRawSpl[1] }
    BotAction.inlineKeyboardCallback(ctx, type, storyName, choice)
})

bot.hears(/> .*/, ctx => {
    console.log(`hears: ${ctx.message.text}`)
    // ctx.reply(`you send ${ctx.message.text.slice(2)}`)
    BotAction.keyboardCallback(ctx, ctx.message.text.slice(2))
})

bot.start(ctx => {
    // console.log(ctx.from)
    console.log(ctx.message.text)
    const spaceIdx = ctx.message.text.indexOf(" ")
    if (spaceIdx < 0) {
        return ctx.replyWithMarkdown(`Hello ${ctx.from.first_name}${ctx.from.last_name}, Welcome~ 
                    \nSend [/list](${ctx.from.username}/list) to see the list of stories.
                    \nSend [/help](${ctx.from.username}/help) to see the help.
                    \nSend [/search + <storyName>](${ctx.from.username}/search) to search stories.`)
    }
    const storyName = ctx.message.text.replace("/start ", "")
    BotAction.inlineKeyboardCallback(ctx, "story", storyName, undefined)
})
// bot.help((ctx) => ctx.reply('TODO...'))
bot.command('list', (ctx) => {
    const storyList: string[] = StoryUtil.listStory()
    const replyContent: string = "List of Storys: \n" + storyList.map(story => `[${story}](https://t.me/nice_if_bot?start=${story})`).join("\n")
    ctx.replyWithMarkdown(replyContent)
})
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
