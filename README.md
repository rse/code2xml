
code2xml
========

**Convert source code to syntax-annotated XML**

<p/>
<img src="https://nodei.co/npm/code2xml.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/code2xml.png" alt=""/>

Abstract
--------

This is a small command-line utility to convert source code to
syntax-annotated XML. It is intended to simplify the importing
of arbitrary source code artifacts as syntax-highlighted source code text into
[Adobe InDesign](http://www.adobe.com/products/indesign.html) with the help of its
[Import XML](https://helpx.adobe.com/indesign/using/importing-xml.html) mechanism.
Internally, *code2xml* uses the Node.js [Syntax](https://github.com/rse/syntax)
module for highlighting the source code fragments with XML tags
named `<xxx-root>` (root element), `<xxx-block[-XXX]>` (enclosure element), `<xxx-comment>`, `<xxx-keyword>`,
`<xxx-literal>`, `<xxx-marker>` and `<xxx-anchor-N>`. Use the
[Adobe InDesign](http://www.adobe.com/products/indesign.html)
[Map Tags to Styles](https://helpx.adobe.com/indesign/using/importing-xml.html#map_xml_tags_to_styles)
functionality to map those XML tags to Adobe InDesign styles.

Installation
------------

```
$ npm install -g code2xml
```

Usage
-----

```
$ code2xml [-h] [-V] [-l <language>] [-o <output-file>] [-f <input-file>]
```

- `-h`, `--help`<br/>
  Show usage help.
- `-V`, `--version`<br/>
  Show program version information.
- `-l <language>`, `--language <language>`<br/>
  Either "auto" (the default) or one of the languages understood
  by the [Syntax](https://github.com/rse/syntax) module.
- `-i <id>`, `--id <id>`<br/>
  Either "" (the default for none) or an identifier to append to the
  name of the enclosure XML element `<xxx-block>`.
- `-p <prefix>`, `--prefix <prefix>`<br/>
  Either "syntax-" (the default) or an identifier to prepend to the
  name of all XML elements.
- `--without-declaration`<br/>
  Do not emit XML declaration.
- `--without-root`<br/>
  Do not emit root element `<xxx-root>`.
- `--without-file`<br/>
  Do not emit file element `<xxx-file[-XXX]>`.
- `--without-block`<br/>
  Do not emit block element `<xxx-block>`.
- `--tab-replace <string>`<br/>
  replace TAB characters with this string.
- `--newline-replace <string>`<br/>
  replace [CR+]LF characters with this string.
- `--regex-anchor-open <regex>`<br/>
  use this regular expression for anchor opening constructs.
- `--regex-anchor-close <regex>`<br/>
  use this regular expression for anchor closing constructs.
- `--regex-marker-open <regex>`<br/>
  use this regular expression for marker opening constructs.
- `--regex-marker-close <regex>`<br/>
  use this regular expression for marker closing constructs.
- `-o <output-file>`, `--output <output-file>`<br/>
  Either "-" (the default for stdout) or a path to the XML output file.
- `-f <input-file>`, `--file <input-file>`<br/>
  Either "-" (the default for stdin) or a path to the source code input file.

Example
-------

```sh
$ cat sample.js
/* sample comment */
const foo = (arg1, arg2=(1)=, arg3) => {
    var foo  = 42
={    var bar  = "baz"    }= =(2)=
    var quux = /foo\/bar"quux"/
    return foo + bar + quux
}

$ code2xml -f sample.js
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<syntax-root><syntax-file><syntax-block><syntax-comment>/* sample comment */</syntax-comment>
<syntax-keyword>const</syntax-keyword> foo = (arg1, arg2<syntax-anchor-1></syntax-anchor-1>, arg3) =&gt; {
    <syntax-keyword>var</syntax-keyword> foo  = <syntax-literal>42</syntax-literal>
<syntax-marker>    </syntax-marker><syntax-keyword><syntax-marker>var</syntax-marker></syntax-keyword><syntax-marker> bar  = </syntax-marker><syntax-literal><syntax-marker>"baz"</syntax-marker></syntax-literal><syntax-marker>    </syntax-marker> <syntax-anchor-2></syntax-anchor-2>
    <syntax-keyword>var</syntax-keyword> quux = <syntax-literal>/foo\/bar"quux"/</syntax-literal>
    <syntax-keyword>return</syntax-keyword> foo + bar + quux
}
</syntax-block></syntax-file></syntax-root>
```

License
-------

Copyright (c) 2016 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

