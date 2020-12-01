import fs from "fs"
import path from "path"
import YAML from "yaml"
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import hashString from 'hash-string'
import http from 'http'
import https from 'https'
import mustache from 'mustache'
import marked from 'marked'
import moment from 'moment'
import { downloadImages } from './download.js'
import { build } from './render.js'

const argv = yargs(hideBin(process.argv))
    .default('entries', 'entries.yaml')
    .default('out', 'out')
    .default('media', 'media')
    .command('download', "downloads images into media folder")
    .command('build', "builds site")
    .argv

const entries = YAML.parse(fs.readFileSync(argv.entries, 'utf-8'))

if(argv._[0] == 'download') {
    downloadImages(entries, argv)
} else if(argv._[0] == 'build') {
    build(entries, argv)
}