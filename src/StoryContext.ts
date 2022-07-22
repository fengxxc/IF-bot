import { Context } from "telegraf"

interface SessionData {
    storys: { [key: string]: string }
    currentStory: string
}

export default interface StoryContext extends Context {
    session: SessionData
}