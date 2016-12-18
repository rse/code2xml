#!/usr/bin/env node
/*!
**  Copyright (c) 2015-2016 Ralf S. Engelschall (http://engelschall.com/)
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  internal requirements  */
const fs       = require("fs")
const path     = require("path")

/*  external requirements  */
const Syntax   = require("syntax")
const Tokenizr = require("tokenizr")
const yargs    = require("yargs")

/*  load my own information  */
const my = require(path.join(__dirname, "package.json"))

/*  parse command-line arguments  */
const argv = yargs
    .usage("Usage: $0 [-h] [-V] [-v] [-l <language>] [-o <outout-file>] -f <input-file>]")
    .help("h").alias("h", "help").default("h", false)
        .describe("h", "show usage help")
    .boolean("V").alias("V", "version").default("V", false)
        .describe("V", "show program version information")
    .string("l").nargs("l", 1).alias("l", "language").default("l", "auto")
        .describe("l", "force particular language ()")
    .string("o").nargs("o", 1).alias("o", "output").default("o", "-")
        .describe("o", "write XML output to given file")
    .string("i").nargs("i", 1).alias("i", "input").default("i", "-")
        .describe("i", "read source code input from given file")
    .strict()
    .showHelpOnFail(true)
    .demand(0)
    .parse(process.argv.slice(2))

/*  short-circuit processing of "-V" command-line option  */
if (argv.version) {
    process.stderr.write(my.name + " " + my.version + " <" + my.homepage + ">\n")
    process.stderr.write(my.description + "\n")
    process.stderr.write("Copyright (c) 2016 " + my.author.name + " <" + my.author.url + ">\n")
    process.stderr.write("Licensed under " + my.license + " <http://spdx.org/licenses/" + my.license + ".html>\n")
    process.exit(0)
}

/*  read input file  */
let input = ""
if (argv.input === "-") {
    process.stdin.setEncoding("utf-8")
    let BUFSIZE = 256
    let buf = new Buffer(BUFSIZE)
    while (true) {
        bytesRead = 0
        try {
            bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE)
        } catch (ex) {
            if (ex.code === "EAGAIN")
                continue
            else if (ex.code === "EOF")
                break
            else
                throw ex
        }
        if (bytesRead === 0)
            break
        input += buf.toString(null, 0, bytesRead)
    }
}
else {
    if (!fs.existsSync(argv.input))
        throw new Error(`cannot find input file "${argv.input}"`)
    input = fs.readFileSync(argv.input, { encoding: "utf8" })
}

/*  create a new syntax highlighting context  */
let syntax = new Syntax({ language: argv.language, cssPrefix: "" })

/*  parse input  */
syntax.richtext(input)

/*  generate XML output  */
let xml = "<syntax-root>" + syntax.html() + "</syntax-root>"
let lexer = new Tokenizr()
lexer.rule(/<span\s+class="(.+?)">/, (ctx, match) => { ctx.accept("tag-open", match[1]) })
lexer.rule(/<\/span>/,               (ctx, match) => { ctx.accept("tag-close")          })
lexer.rule(/(?:.|\r?\n)/,            (ctx, match) => { ctx.accept("char")               })
lexer.input(xml)

/*  convert XML output to tag-only variant  */
let output = ""
let stack = []
lexer.tokens().forEach((token) => {
    if (token.type === "tag-open") {
        let value = token.value
        let m
        if ((m = value.match(/^anchor\s+anchor-(\d+)$/)) !== null)
            value = `anchor-${m[1]}`
        output += `<syntax-${value}>`
        stack.push(value)
    }
    else if (token.type === "tag-close") {
        let value = stack.pop()
        output += `</syntax-${value}>`
    }
    else
        output += token.text
})

/*  write output  */
if (argv.output === "-")
    process.stdout.write(output)
else
    fs.writeFileSync(argv.output, output, { encoding: "utf8" })

/*  die gracefully  */
process.exit(0)

