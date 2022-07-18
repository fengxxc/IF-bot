import { Context, Telegraf } from 'telegraf'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { Story as RuntimeStory } from 'inkjs/engine/Story'
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import 'dotenv/config' 
import LocalSession from 'telegraf-session-local'
import StoryUtil from './StoryUtil'

interface SessionData {
    storys: { [key: string]: string }
}
interface StoryContext extends Context {
    session: SessionData
}

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

// Login widget events
bot.on('connected_website', (ctx) => ctx.reply('Website connected'))

// Telegram passport events
bot.on('passport_data', (ctx) => ctx.reply('Telegram passport connected'))

// session
bot.use((new LocalSession({ database: '.story_states_db.json' })).middleware())

bot.command('start', ctx => {
    console.log(ctx.from)
    ctx.replyWithMarkdown(`Hello${ctx.from.first_name}${ctx.from.last_name}, Welcome~ 
                            \nSend [/list](${ctx.from.username}/list) to see the list of stories.
                            \nSend [/help](${ctx.from.username}/help) to see the help.
                            \nSend [/search + <storyName>](${ctx.from.username}/search) to search stories.`)
    // bot.telegram.sendMessage(ctx.chat.id, 'Hi, This is nice IF bot~')
})

const saveState = (runtimeStory: RuntimeStory, storyName: string, ctx: StoryContext) => {
    console.log('Saving state!!!!!!!!!!!!!!!!')
    // console.log(ctx.session.storys)
    const savedState: string = runtimeStory?.state.ToJson()
    if (ctx.session.storys === undefined) {
        ctx.session.storys = {}
    }
    ctx.session.storys[storyName] = savedState
}

const loadCustomStateStory = (ctx: StoryContext, storyName: string, restoreState = true): RuntimeStory|null => {
    const story = StoryUtil.loadRuntimeStory(storyName)
    if (story == null) {
        return null
    }
    const storyState = ctx.session.storys?.[storyName] 
    if (restoreState && storyState) {
        story.state.LoadJson(storyState)
    }
    return story
}

bot.action(/.+/, (ctx) => {
    const input = ctx.match[0]
    // type: story | choice | restart
    const [type, storyName, choice] = input.split(":")
    console.log(`type: ${type}, storyName: ${storyName}, choice: ${choice}`)
    if (type == "restart" && ctx.session?.storys?.storyName) {
        delete ctx.session.storys[storyName]
    }
    const runtimeStory: RuntimeStory|null = loadCustomStateStory(ctx, storyName, type != "restart")
    if (runtimeStory == null) {
        ctx.reply(`Story "${storyName}" is not exist`)
        return
    }
    console.log(`canContinue: ${runtimeStory.canContinue}`)
    console.log(`tag: ${runtimeStory.currentTags}`)
    console.log(`currentChoices.length: ${runtimeStory.currentChoices.length}`)
    if (type == "choice") {
        console.log(`choice: ${choice}`)
        const [threadIdx, choiceIdx] = choice.split("_").map(x => parseInt(x))
        // 没有选项或点了之前的选项
        if (choiceIdx >= runtimeStory.currentChoices.length
            || runtimeStory.currentChoices[choiceIdx].originalThreadIndex != threadIdx) {
            // ctx.reply(`Choice ${choiceIdx} is not exist`)
            ctx.answerCbQuery("Choice is not exist")
            return
        }
        runtimeStory.ChooseChoiceIndex(choiceIdx)
    }
    const storyText = runtimeStory.ContinueMaximally() || runtimeStory.currentText || ''
    // const storyText = runtimeStory.ContinueMaximally() || runtimeStory.BuildStringOfContainer(runtimeStory.mainContentContainer) || ''
    saveState(runtimeStory, storyName, ctx)
    console.log(`storyText: ${storyText}`)
    // 结束情况：点完最后一个选项，返回最后一段故事内容，然后没有选项了
    if (runtimeStory.currentChoices.length == 0) {
        const endText = storyText
        ctx.reply(endText + "\n - End -", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Restart this story', callback_data: `restart:${storyName}` }]
                ]
            }
        })
        return
    }
    // console.log("BuildStringOfHierarchy: " + runtimeStory.BuildStringOfHierarchy())
    const choices = StoryUtil.getChoicesInlineKeyboard(runtimeStory, storyName)
    ctx.reply(storyText, {
        reply_markup: {
            inline_keyboard: [
                choices
            ]
        }
    })
})

// bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('hipster', Telegraf.reply('λ'))
bot.command('list', (ctx) => {
    ctx.reply("List of Storys: ", {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'tests', callback_data: 'story:tests' }],
                [{ text: 'spam', callback_data: 'story:spam' }],
            ]
        }
    })
    // ctx.replyWithMarkdown('*bold* _italic_ `fixed-width`')
})
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
