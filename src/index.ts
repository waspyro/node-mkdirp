import fs from 'fs'
import {dirname} from 'path'
import {promisify} from "util";

interface ICallback<result> {
    (err: undefined|null, result: result): void;
    (err: Error, result?: undefined|null): void;
}

class ENotDir extends Error {
    constructor(public dir: string) {
        super(`${dir} is not a directory`)
    }
}

export const mkdirp = (dir: string, cb: ICallback<boolean>) => {
    fs.stat(dir, (err, stats) => {
        if (!err) stats.isDirectory()
            ? cb(null, false)
            : cb(new ENotDir(dir))
        else if (err.code === 'ENOENT') mkdirp(dirname(dir), (err) => err
            ? cb(err)
            : fs.mkdir(dir, (err) => err ?
                cb(err) :
                cb(null, true))
        )
        else err.code === 'ENOTDIR'
            ? cb(new ENotDir(dir))
            : cb(err)
    })
}

export default promisify(mkdirp)