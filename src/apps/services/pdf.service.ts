import { Router } from "express";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import fs from "fs";
import path from "path";

import { JSDOM, DOMWindow } from "jsdom";
import { Content, StyleDictionary, TDocumentDefinitions, TFontDictionary } from "pdfmake/interfaces";

const window: DOMWindow = new JSDOM("").window;
const fonts = {
  "Arial.ttf": fs.readFileSync(path.join(__dirname, "../../../fonts/Arial/Arial.ttf")).toString("base64"),
  "Arial-Bold.ttf": fs.readFileSync(path.join(__dirname, "../../../fonts/Arial/Arial-Bold.ttf")).toString("base64"),
  "Arial-Italic.ttf": fs.readFileSync(path.join(__dirname, "../../../fonts/Arial/Arial-Italic.ttf")).toString("base64"),
  "Arial-Bold-Italic.ttf": fs
    .readFileSync(path.join(__dirname, "../../../fonts/Arial/Arial-Bold-Italic.ttf"))
    .toString("base64"),
};
var defaultClientFonts: TFontDictionary = {
  Arial: {
    normal: "Arial.ttf",
    bold: "Arial-Bold.ttf",
    italics: "Arial-Italic.ttf",
    bolditalics: "Arial-Bold-Italic.ttf",
  },
};
const logo = `data:image/png;base64,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`;

const renderPdfGateWay = async (req, res) => {
  const { config, contentHtml } = req.body;

  const html = htmlToPdfmake(contentHtml, {
    window: window,
    defaultStyles: {
      h2: {
        fontSize: 26,
        bold: true,
        lineHeight: 1,
      },
      h3: {
        fontSize: 16,
        bold: true,
        lineHeight: 1,
      },
      li: {
        marginLeft: 12,
      },
      ol: {
        marginBottom: 15,
      },
      ul: {
        marginBottom: 15,
      },
    },
  }) as Content;

  function addTableLayout(content: any) {
    if (content.nodeName == "TABLE") {
      for (let r = 0; r < content.table.body.length; r++) {
        const tr = content.table.body[r];
        for (let c = 0; c < tr.length; c++) {
          const td = tr[c];
          if (td.stack?.length) {
            for (let s = 0; s < td.stack.length; s++) {
              const stack = td.stack[s];
              if (stack.text) {
                // div only
                const text = stack.text;
                const style = stack.style;
                delete content.table.body[r][c].stack[s].text;
                delete content.table.body[r][c].stack[s].style;
                content.table.body[r][c].stack[s].stack = [
                  {
                    text: text,
                    nodeName: "P",
                    margin: [0, 5, 0, 5],
                    alignment: "left",
                    style: ["html-p"].concat(style),
                  },
                ];
              } else if (stack.stack) {
                // div > p
                for (let i = 0; i < stack.stack.length; i++) {
                  const element = stack.stack[i];
                  if (element.nodeName == "P") {
                    element.margin = [0, 5, 0, 5];
                  }
                }
              }
            }
          }
        }
      }
      return;
    }
    if (content.nodeName == "P") {
      content.margin = [0, 0, 0, 8];
    }
    if (content.stack) {
      for (let i = 0; i < content.stack.length; i++) {
        const element = content.stack[i];
        addTableLayout(element as any);
      }
    }
    if (Array.isArray(content)) {
      for (let i = 0; i < content.length; i++) {
        addTableLayout(content[i] as any);
      }
    }
  }
  addTableLayout(html as any);
  // fs.writeFileSync("./html.json", JSON.stringify(html), { encoding: "utf-8" });
  const docDef: TDocumentDefinitions = {
    pageOrientation: "portrait",
    header: { image: logo, fit: [80, 40], alignment: "right", margin: [0, 15, 35, 0] }, //[left, top, right, bottom]
    footer: function (page, pages) {
      return {
        margin: [70, 20, 70, 0],
        columns: [
          {
            text: `${config.footer}`,
            alignment: "left",
            italics: false,
            width: "*",
            font: "Arial",
            fontSize: 10,
          },
          {
            text: `${page} / ${pages}`,
            alignment: "right",
            italics: false,
            width: "20%",
            font: "Arial",
            fontSize: 10,
          },
        ],
      };
    },
    content: html,
    pageMargins: [70, 70, 70, 70],
    pageSize: "A4",
    defaultStyle: {
      font: "Arial",
      lineHeight: 1.2,
    },

    styles: {
      // "html-h2": {
      //   fontSize: 30,
      // },
      // "html-li": {
      //   lineHeight: 1.2,
      //   marginLeft: 5,
      //   // alignment: "justify",
      // },
      // "html-ul": {
      //   lineHeight: 1.2,
      //   marginBottom: 5,
      //   color: "red",
      //   // alignment: "justify",
      // },
      "text-huge": {
        fontSize: 21.6,
      },
      "text-big": {
        fontSize: 16.7,
      },
      "text-small": {
        fontSize: 10,
      },
      "text-tiny": {
        fontSize: 8,
      },
    },
    // ...config,
  };

  const pdfDocumentGenerator = pdfMake.createPdf(docDef, undefined, defaultClientFonts, fonts);

  const result = pdfDocumentGenerator.getStream();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=file.pdf");
  result.pipe(res);
  result.end();

  return result;
};

export { renderPdfGateWay };
