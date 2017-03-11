#!/usr/bin/env node
/*!
**  Copyright (c) 2016-2017 Ralf S. Engelschall (http://engelschall.com/)
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
    .usage("Usage: $0 [options]")
    .help("h").alias("h", "help").default("h", false)
        .describe("h", "show usage help")
    .boolean("V").alias("V", "version").default("V", false)
        .describe("V", "show program version information")
    .string("l").nargs("l", 1).alias("l", "language").default("l", "auto")
        .describe("l", "force particular language ()")
    .string("i").nargs("i", 1).alias("i", "id").default("i", "")
        .describe("i", "use enclosing <xxx-block-XXX> instead of just <xxx-block>")
    .string("p").nargs("p", 1).alias("p", "prefix").default("p", "syntax-")
        .describe("p", "use prefix on all XML tags")
    .boolean("without-declaration").default("without-declaration", false)
        .describe("without-declaration", "do not emit XML declaration")
    .boolean("without-root").default("without-root", false)
        .describe("without-root", "do not emit root element <xxx-root>")
    .boolean("without-file").default("without-file", false)
        .describe("without-file", "do not emit file element <xxx-file[-XXX]>")
    .boolean("without-block").default("without-block", false)
        .describe("without-block", "do not emit block element <xxx-block>")
    .string("tab-replace").nargs("tab-replace", 1).default("tab-replace", "    ")
        .describe("tab-replace", "replace TAB characters with this string")
    .string("newline-replace").nargs("newline-replace").default("newline-replace", "\n")
        .describe("newline-replace", "replace [CR+]LF characters with this string")
    .string("regex-anchor-open").nargs("regex-anchor-open", 1).default("regex-anchor-open", "=\\(")
        .describe("regex-anchor-open", "use this regular expression for anchor opening constructs")
    .string("regex-anchor-close").nargs("regex-anchor-close", 1).default("regex-anchor-close", "\\)=")
        .describe("regex-anchor-close", "use this regular expression for anchor closing constructs")
    .string("regex-marker-open").nargs("regex-marker-open", 1).default("regex-marker-open", "=\\{")
        .describe("regex-marker-open", "use this regular expression for marker opening constructs")
    .string("regex-marker-close").nargs("regex-marker-close", 1).default("regex-marker-close", "\\}=")
        .describe("regex-marker-close", "use this regular expression for marker closing constructs")
    .string("o").nargs("o", 1).alias("o", "output").default("o", "-")
        .describe("o", "write XML output to given file")
    .string("f").nargs("f", 1).alias("f", "input").default("f", "-")
        .describe("f", "read source code input from given file")
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
let syntax = new Syntax({
    cssPrefix:         "",
    language:          argv.language,
    tabReplace:        argv.tabReplace,
    newlineReplace:    argv.newlineReplace,
    regexAnchorOpen:   argv.regexAnchorOpen,
    regexAnchorClose:  argv.regexAnchorClose,
    regexMarkerOpen:   argv.regexMarkerOpen,
    regexMarkerClose:  argv.regexMarkerClose
})

/*  parse input  */
syntax.richtext(input)

/*  generate XML output  */
let xml = syntax.html()
if (!argv.withoutBlock)
    xml = `<${argv.prefix}block>${xml}</${argv.prefix}block>`
if (!argv.withoutFile) {
    if (argv.id !== "")
        xml = `<${argv.prefix}file-${argv.id}>${xml}</${argv.prefix}file-${argv.id}>`
    else
        xml = `<${argv.prefix}file>${xml}</${argv.prefix}file>`
}
if (!argv.withoutRoot)
    xml = `<${argv.prefix}root>${xml}</${argv.prefix}root>`
if (!argv.withoutDeclaration)
    xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n${xml}`
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
        output += `<${argv.prefix}${value}>`
        stack.push(value)
    }
    else if (token.type === "tag-close") {
        let value = stack.pop()
        output += `</${argv.prefix}${value}>`
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

