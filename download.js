import fs from 'fs'
import path from 'path'
import http from 'http'
import https from 'https'
import { hashHref, guessExtension } from './common.js'

function downloadImage(href, fileName, dir) {
    const url = new URL(href)
    const proto = url.protocol == 'http' ? http : https;
    const finalPath = path.join(dir, fileName)
    const file = fs.createWriteStream(finalPath);
    proto.get(url.toString(), response => {
        response.pipe(file);
        console.log(`${href} -> ${finalPath}`);
    }).end()
}

export function downloadImages(entries, options) {
    for (const entry of entries) {
        if (entry.image.startsWith("/")) continue;
        let extension = entry.extension || guessExtension(entry.image)
        let hashedName = `${hashHref(entry.image)}.${extension}`
    
        if (!fs.existsSync(path.join(options.media, hashedName)))
            downloadImage(entry.image, hashedName, options.media)
    }
}