import fs from 'fs'
import {dirname} from 'path'
import {promisify} from "util";

interface ICallback<result> {
    (err: undefined|null, result: result): void;
    (err: Error, result?: undefined|null): void;
}

export const mkdirp = (dir: string, cb: ICallback<boolean>) => {
    const notadir = (dir: string) => new Error(dir + ' is not a directory')
    fs.stat(dir, (err, stats) => {
        if (!err) stats.isDirectory()
            ? cb(null, false)
            : cb(notadir(dir))
        else if (err.code === 'ENOENT') mkdirp(dirname(dir), (err, data) => err
            ? cb(err)
            : fs.mkdir(dir, (err) => err ?
                cb(err) :
                cb(null, true)
            ))
        else err.code === 'ENOTDIR'
            ? cb(notadir(dir))
            : cb(err)
    })
}

export default promisify(mkdirp)