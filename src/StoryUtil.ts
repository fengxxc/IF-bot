import { Story as RuntimeStory } from 'inkjs/engine/Story'
import path from 'path'
import fs from 'fs'
import { ErrorHandler } from 'inkjs/engine/Error'
import { PosixFileHandler } from 'inkjs/compiler/FileHandler/PosixFileHandler'
import { InkParser } from 'inkjs/compiler/Parser/InkParser'

export default class StoryUtil {
    static getChoicesInlineKeyboard(runtimeStory: RuntimeStory, storyName: string) {
        const choices = runtimeStory.currentChoices.map(choice => ({
            text: choice.text,
            callback_data: "choice:" + storyName + ":" + choice.index
        }))
        // console.log(choices)
        return choices
    }

    static loadRuntimeStory(storyName: string): RuntimeStory|null {
        const inkFireBaseDir = path.join(__dirname, "../ink")
        // storyName "tests.ink"
        if (!storyName.endsWith('.ink')) {
            storyName += '.ink'
        }
        console.log(path.join(inkFireBaseDir, storyName))
        const filePath = path.join(inkFireBaseDir, storyName)
        if (!fs.existsSync(filePath)) {
            console.error('Story file is not exists')
            return null
        }
        const inkString = fs.readFileSync(filePath, "utf-8");
        const onError: ErrorHandler = (message, errorType) => {
            console.log(message, errorType)
        }
        const fileHandler = new PosixFileHandler(inkFireBaseDir)
        const parser = new InkParser(inkString, null, onError, null, fileHandler)
        const parsedStory = parser.ParseStory()
        const runtimeStory: RuntimeStory|null = parsedStory.ExportRuntime(onError)
        if (runtimeStory == null) {
            console.error('Story is null')
        }
        return runtimeStory
    }
}