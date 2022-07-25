import { Story } from 'inkjs/engine/Story';
import fs from 'fs';
import { createInterface } from 'readline';
import { InkParser } from 'inkjs/compiler/Parser/InkParser';
import path from 'path';

/**
 * cmd: 
 *     node --loader ts-node/esm ./test/main.ts
 */
const INK_FIRE_BASE_DIR = path.join(__dirname, "../ink")

//start reading and writting to the console
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function continueToNextChoice(myStory: Story) {
        
    //check we haven't reached the end of the story
    if (!myStory.canContinue && myStory.currentChoices.length === 0) end();
    
    //write the story to the console until we find a choice
    while (myStory.canContinue){
        console.log(myStory.Continue());
    }
    
    //check if there are choices
    if (myStory.currentChoices.length > 0){
        for (let i = 0; i < myStory.currentChoices.length; ++i) {
            const choice = myStory.currentChoices[i];
            console.log((i + 1) + ". " + choice.text);
        }
        
        //prompt the user for a choice
        rl.question('> ', (answer) => {
            //continue with that choice
            myStory.ChooseChoiceIndex(parseInt(answer) - 1);
            continueToNextChoice(myStory);
        });
    }
    else{
        //if there are no choices, we reached the end of the story
        end();
    }
}

function end(){
    console.log('THE END');
    rl.close();
}

function main(callback: (story: Story) => void) {
    const fileList: string[] = []
    const listDfs = (rootPath: string) => {
        fs.readdirSync(rootPath).forEach(fileName => {
            const filePath = path.join(INK_FIRE_BASE_DIR, fileName)
            const states = fs.statSync(filePath)
            if (states.isDirectory()) {
                listDfs(filePath)
            } else {
                fileList.push(fileName)
            }
        })
    }
    listDfs(INK_FIRE_BASE_DIR)
    fileList.forEach((filePath, index) => console.log((index+1) + ". " + filePath))
    console.log('choose a ink file sequence number to test :) ')
    rl.question('> ', (answer) => {
        const f = path.join(INK_FIRE_BASE_DIR, fileList[parseInt(answer) - 1])
        if (fs.existsSync(f)) {
            const content = fs.readFileSync(f, 'utf-8')
            const story = f.endsWith('.ink') ? new InkParser(content).ParseStory().ExportRuntime() 
                                             : new Story(content.replace(/^\uFEFF/, ''))
            if (story == null) {
                console.error(`parse error: ${f}`)
                main(callback)
            } else {
                callback(story)
            }
        } else {
            console.log(`file not found: ${f}`)
            main(callback)
        }
    })
}

// start
main(story => continueToNextChoice(story))