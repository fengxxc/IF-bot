import { Story as RuntimeStory } from 'inkjs/engine/Story'
import StoryContext from './StoryContext'
import StoryUtil from './StoryUtil'


export default class BotAction {
    private static saveState(runtimeStory: RuntimeStory, storyName: string, ctx: StoryContext) {
        // console.log('Saving state!!!!!!!!!!!!!!!!')
        // console.log(ctx.session.storys)
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

    static inlineKeyboardCallback(ctx: StoryContext, type: string, storyName: string, choice?: string) {
        // type: story | choice | restart
        // choice: threadIndex_choiceIndex
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
        // console.log(`currentChoices.length: ${runtimeStory.currentChoices.length}`)
        if (type == "choice" && choice) {
            // console.log(`choice: ${choice}`)
            const [threadIdx, choiceIdx] = choice.split("_").map(x => parseInt(x))
            // 没有选项或点了之前的选项
            if (choiceIdx >= runtimeStory.currentChoices.length
                || runtimeStory.currentChoices[choiceIdx].originalThreadIndex != threadIdx) {
                ctx.answerCbQuery("Choice is not exist")
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
            ctx.reply(endText + "\n - End -", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Restart this story', callback_data: `restart:${storyName}:`}]
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
    }
}