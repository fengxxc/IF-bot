import { Story as RuntimeStory } from 'inkjs/engine/Story'
import { BoolValue } from 'inkjs/engine/Value'
import { Markup } from 'telegraf'
import { InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove } from 'telegraf/typings/core/types/typegram'
import StoryContext from './StoryContext'
import StoryUtil from './StoryUtil'
import Const from "./Const";

export interface Choice {
    threadIndex?: number
    index?: number
    text?: string
}

export default class BotAction {

    private static saveState(runtimeStory: RuntimeStory, storyName: string, ctx: StoryContext) {
        const savedState: string = runtimeStory?.state.ToJson()
        if (ctx.session.storys === undefined) {
            ctx.session.storys = {}
        }
        ctx.session.storys[storyName] = savedState
    }

    private static loadCustomStateStory(ctx: StoryContext, storyName: string, restoreState = true): RuntimeStory | null {
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

    static keyboardCallback(ctx: StoryContext, text: string) {
        const type = "choice"
        const storyName = ctx.session.currentStory
        const choice: Choice = { text: text}
        BotAction.inlineKeyboardCallback(ctx, type, storyName, choice)
    }

    static inlineKeyboardCallback(ctx: StoryContext, type: string, storyName: string, choice?: Choice) {
        // type: story | choice | restart
        // choice: threadIndex_choiceIndex
        if (type == "story") {
            ctx.session.currentStory = storyName
        }
        if (type == "restart" && ctx.session?.storys?.storyName) {
            delete ctx.session.storys[storyName]
        }
        const runtimeStory: RuntimeStory | null = BotAction.loadCustomStateStory(ctx, storyName, type != "restart")
        if (runtimeStory == null) {
            ctx.reply(`Story "${storyName}" is not exist`)
            return
        }
        // console.log(`canContinue: ${runtimeStory.canContinue}`)
        // console.log(`tag: ${runtimeStory.currentTags}`)
        if (type == "choice" && choice) {
            let choiceIdx = choice.index
            choiceIdx = choiceIdx || runtimeStory.currentChoices.findIndex(x => x.text == choice.text) || -1
            // console.log(`choiceIdx: ${choiceIdx}`)
            if (choiceIdx < 0 || choiceIdx >= runtimeStory.currentChoices.length) {
                ctx.answerCbQuery("Choice is not exist").catch()
                return
            }
            if (choice.threadIndex && runtimeStory.currentChoices[choiceIdx].originalThreadIndex != choice.threadIndex) {
                ctx.answerCbQuery("You was choosed this choice before")
                return 
            }
            runtimeStory.ChooseChoiceIndex(choiceIdx)
        }
        const storyText = runtimeStory.ContinueMaximally() || runtimeStory.currentText || ''
        // const storyText = runtimeStory.ContinueMaximally() || runtimeStory.BuildStringOfContainer(runtimeStory.mainContentContainer) || ''
        BotAction.saveState(runtimeStory, storyName, ctx)
        // console.log(`storyText: ${storyText}`)
        // 结束情况：点完最后一个选项，返回最后一段故事内容，然后没有选项了
        if (runtimeStory.currentChoices.length == 0) {
            const endText = storyText
            BotAction.replyEnd(ctx, storyName, endText)
            return
        }
        // console.log("BuildStringOfHierarchy: " + runtimeStory.BuildStringOfHierarchy())
        const choices = StoryUtil.getChoicesInlineKeyboard(runtimeStory, storyName)
        const inline: boolean = ((runtimeStory.variablesState.GetVariableWithName(Const.TG_CHOICE_INLINE) || true) as BoolValue).isTruthy
        BotAction.replyContentAndChoices(ctx, storyText, choices, inline)
    }

    static async replyContentAndChoices(ctx: StoryContext, text: string, choices: { text: string; callback_data: string; }[], inline = true) {
        let markup: Markup.Markup<InlineKeyboardMarkup> | Markup.Markup<ReplyKeyboardMarkup> | Markup.Markup<ReplyKeyboardRemove>
        if (inline) {
            if (ctx.session.keyboardOpen) {
                markup = Markup.removeKeyboard()
                const rm = await ctx.reply("change to inline keyboard...", Markup.removeKeyboard())
                await ctx.deleteMessage(rm.message_id)
                ctx.session.keyboardOpen = false
            }
            markup = Markup.inlineKeyboard([choices])
        } else {
            choices = choices.map(x => {x.text = "> "+x.text; return x})
            markup = Markup.keyboard(choices).oneTime().resize()
            ctx.session.keyboardOpen = true
        }
        return await ctx.replyWithMarkdown(text, {
            parse_mode: 'Markdown',
            ...markup
        })
    }

    static replyEnd(ctx: StoryContext, storyName: string, text: string) {
        BotAction.replyContentAndChoices(ctx, text + "\n - End -", [Markup.button.callback('Restart this story', `restart:${storyName}:`)])
    }
}