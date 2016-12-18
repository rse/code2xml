
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
$ upd [-h] [-V] [-l <language>] [-o <output-file>] [-f <input-file>]
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
- `-o <output-file>`, `--output <output-file>`<br/>
  Either "-" (the default for stdout) or a path to the XML output file.
- `-f <input-file>`, `--file <input-file>`<br/>
  Either "-" (the default for stdin) or a path to the source code input file.

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

