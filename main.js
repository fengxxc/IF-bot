const {Telegraf} = require('telegraf')
// const SocksAgent = require('socks5-https-client/lib/Agent')
const HttpsProxyAgent = require('https-proxy-agent')
const { InkParser } = require('inkjs/compiler/Parser/InkParser')
const { PosixFileHandler } = require('inkjs/compiler/FileHandler/PosixFileHandler')
const path = require('path')
const fs = require('fs')

/* const socksAgent = new SocksAgent({
    socksHost: 'localhost',
    socksPort: 1070,
  }); */

const bot = new Telegraf('5402637709:AAEpND6B7JPK23Qz6j5oL7oVxwzMklmPWec', {
    telegram: { 
        // agent: socksAgent 
        agent: new HttpsProxyAgent('http://127.0.0.1:1071')
    }
})

bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Hi, This is nice IF bot~', [])
})
bot.hears('if', ctx => {
    const filePath = path.join(__dirname, "ink/tests.ink")
    const inkString = fs.readFileSync(filePath, "utf-8");
    const onError = (message, errorType) => {
        console.log(message, errorType)
    }
    const fileHandler = new PosixFileHandler(path.join(__dirname, "ink"))
    const parser = new InkParser(inkString, null, onError, null, fileHandler, null)
    const parsedStory = parser.ParseStory()
    const runtimeStory = parsedStory.ExportRuntime(onError)
    const storyText = runtimeStory.ContinueMaximally()
    console.log(storyText)
    ctx.reply(storyText)
})
bot.hears('animals', ctx => {
    console.log(ctx.from)
    let animalMessage = `great, here are pictures of animals you would love`;
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, animalMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                        text: "dog",
                        callback_data: 'dog'
                    },
                    {
                        text: "cat",
                        callback_data: 'cat'
                    }
                ],

            ]
        }
    })
})
bot.action('dog', ctx => {
    bot.telegram.sendPhoto(ctx.chat.id, {
        source: "res/dog.jpeg"
    })
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
