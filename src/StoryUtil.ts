import { Story as RuntimeStory } from 'inkjs/engine/Story'
import path from 'path'
import fs from 'fs'
import { ErrorHandler } from 'inkjs/engine/Error'
import { PosixFileHandler } from 'inkjs/compiler/FileHandler/PosixFileHandler'
import { InkParser } from 'inkjs/compiler/Parser/InkParser'
import { Story } from 'inkjs'

import Util from './Util'
import { Markup } from 'telegraf'

export default class StoryUtil {
    static INK_FIRE_BASE_DIR = path.join(__dirname, "../ink")
    static CACHE_FIRE_BASE_DIR = path.join(__dirname, "../.work/cache")

    static getChoicesInlineKeyboard(runtimeStory: RuntimeStory, storyName: string) {
        const choices = runtimeStory.currentChoices.map(choice => Markup.button.callback(choice.text, "choice:" + storyName + ":" + choice.originalThreadIndex + "_" + choice.index))
        return choices
    }

    static loadRuntimeStory(storyName: string): RuntimeStory|null {
        const originalFileName = (!storyName.endsWith('.ink')) ? storyName + '.ink' : storyName
        // original exists?
        const originalFilePath = path.join(StoryUtil.INK_FIRE_BASE_DIR, originalFileName)
        if (!fs.existsSync(originalFilePath)) {
            // No exists, remove cache
            StoryUtil.removeCache(storyName, true)
            console.error('original Story file is not exists')
            return null
        }

        // original changed?
        const originalString = fs.readFileSync(originalFilePath, "utf-8")
        const originalHash = Util.getStringHash(originalString)
        if (fs.existsSync(path.join(StoryUtil.CACHE_FIRE_BASE_DIR, storyName, originalHash + '.json'))) {
            // No changed, load cache
            const runtimeStory = StoryUtil.loadRuntimeStoryFromJsonFile(path.join(StoryUtil.CACHE_FIRE_BASE_DIR, storyName, originalHash + '.json'))
            console.log(`load from cache: ${storyName}`)
            return runtimeStory
        }
        // changed, remove cache
        StoryUtil.removeCache(storyName, false)

        const [runtimeStory, inkHash] = StoryUtil.loadRuntimeStoryFromInkFile(originalFileName)
        console.log(`load from original: ${storyName}`)
        
        if (runtimeStory && inkHash) {
            // save cache
            const json = runtimeStory.ToJson()
            if (json) {
                if (!fs.existsSync(path.join(StoryUtil.CACHE_FIRE_BASE_DIR, storyName))) {
                    fs.mkdirSync(path.join(StoryUtil.CACHE_FIRE_BASE_DIR, storyName), { recursive: true })
                }
                const cacheFilePath = path.join(StoryUtil.CACHE_FIRE_BASE_DIR, storyName, inkHash + ".json")
                console.log(`save to cache: ${cacheFilePath}`)
                fs.writeFileSync(cacheFilePath, json)
            }
        }
        return runtimeStory
    }

    static removeCache(storyName: string, removeDir: boolean): void {
        const cachePath = path.join(StoryUtil.CACHE_FIRE_BASE_DIR, storyName)
        removeDir ? Util.removeDir(cachePath) : Util.emptyDir(cachePath)
    }

    static loadCache(storyName: string): RuntimeStory|null {
        // const fileSize = fs.statSync(path.join(StoryUtil.INK_FIRE_BASE_DIR, storyName)).size
        fs.readdirSync(path.join(StoryUtil.CACHE_FIRE_BASE_DIR, storyName)).forEach(fileName => {
            if (fileName.endsWith('.json')) {
                const jsonFilePath = path.join(StoryUtil.CACHE_FIRE_BASE_DIR, storyName, fileName)
                const runtimeStory = StoryUtil.loadRuntimeStoryFromJsonFile(jsonFilePath)
                return runtimeStory
            }
        })
        return null
    }


    static loadRuntimeStoryFromInkFile(storyName: string): [RuntimeStory|null, string] {
        const filePath = path.join(StoryUtil.INK_FIRE_BASE_DIR, storyName)
        if (!fs.existsSync(filePath)) {
            console.error('original Story file is not exists')
            return [null, ""]
        }
        const inkString = fs.readFileSync(filePath, "utf-8")
        const md5 = Util.getStringHash(inkString)
        const fileHandler = new PosixFileHandler(StoryUtil.INK_FIRE_BASE_DIR)
        const onError: ErrorHandler = (message, errorType) => {
            console.error(message, errorType)
        }
        const parser = new InkParser(inkString, null, onError, null, fileHandler)
        const parsedStory = parser.ParseStory()
        const runtimeStory: RuntimeStory|null = parsedStory.ExportRuntime(onError)
        if (runtimeStory == null) {
            console.error('Story is null')
        }
        return [runtimeStory, md5]
    }

    static loadRuntimeStoryFromJsonFile(jsonFilePath: string): RuntimeStory {
        const json = fs.readFileSync(jsonFilePath, "utf-8").replace(/^\uFEFF/, '')
        // const runtimeStory = new inkjs.Story(json)
        const runtimeStory = new Story(json)
        return runtimeStory
    }
}

