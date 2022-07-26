import fs from "fs";
import path from "path";
import crypto from "crypto";

export default class Util {
    static dirDFS(rootPath: string, fileCallback: (filePath: string, isDir: boolean) => void): void {
        if (fs.existsSync(rootPath)) {
            const files = fs.readdirSync(rootPath)
            files.forEach((file) => {
                const filePath = path.join(rootPath, file)
                const states = fs.statSync(filePath)
                if (states.isDirectory()) {
                    Util.dirDFS(filePath, fileCallback)
                } else {
                    fileCallback(filePath, false)
                }
            })
            fileCallback(rootPath, true)
        }
    }

    static emptyDir(rootPath: string) {
        Util.dirDFS(rootPath, (filePath, isDir) => !isDir ? fs.unlinkSync(filePath) : (filePath !== rootPath)? fs.rmdirSync(filePath) : null)
    }

    static removeDir(rootPath: string) {
        Util.dirDFS(rootPath, (filePath, isDir) => isDir ? fs.rmdirSync(filePath) : fs.unlinkSync(filePath))
    }

    static getStringHash(str: string): string {
        return crypto.createHash('md5').update(str, "utf-8").digest("hex")
    }
}