import Util from '../src/Util';
import fs from "fs";
import path from 'path';

/**
 * cmd: 
 *     node  --loader ts-node/esm ./test/Util.test.ts
 */
function create() {
    fs.mkdirSync(path.join(__dirname, 'tmp'))
    fs.writeFileSync(path.join(__dirname, 'tmp', 'test.txt'), 'test')
}
function printList() {
    Util.dirDFS(path.join(__dirname, 'tmp'), (filePath/* , isDir */) => console.log(filePath))
}
function remove() {
    Util.removeDir(path.join(__dirname, 'tmp'))
}
function empty() {
    Util.emptyDir(path.join(__dirname, 'tmp'))
}
function main() {
    console.log('===== create =====')
    create()
    printList()

    console.log('===== remove =====')
    remove()
    printList()

    console.log('===== create again =====')
    create()
    printList()

    console.log('===== empty =====')
    empty()
    printList()

    console.log('===== ok remove all =====')
    remove()
    printList()
}

main()