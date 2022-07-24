import { Context } from "telegraf"

interface SessionData {
    storys: { [key: string]: string }
    currentStory: string,
    keyboardOpen: boolean
}

export default interface StoryContext extends Context {
    session: SessionData
}