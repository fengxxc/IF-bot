import fs from "fs";
import path from "path";
import crypto from "crypto";

export default class Util {
    static emptyDir(rootPath: string) {
        if (fs.existsSync(rootPath)) {
            const files = fs.readdirSync(rootPath)
            files.forEach((file) => {
                const filePath = path.join(rootPath, file)
                const states = fs.statSync(filePath)
                if (states.isDirectory()) {
                    Util.removeDir(filePath)
                } else {
                    fs.unlinkSync(filePath)
                }
            })
        }
    }

    static removeDir(rootPath: string) {
        if (fs.existsSync(rootPath)) {
            const files = fs.readdirSync(rootPath)
            files.forEach((file) => {
                const filePath = path.join(rootPath, file)
                const states = fs.statSync(filePath)
                if (states.isDirectory()) {
                    Util.removeDir(filePath)
                } else {
                    fs.unlinkSync(filePath)
                }
            })
            fs.rmdirSync(rootPath)
        }
    }

    static getStringHash(str: string): string {
        return crypto.createHash('md5').update(str, "utf-8").digest("hex")
    }
}