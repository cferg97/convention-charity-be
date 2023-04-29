import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";

export const getPDFReadableStream = async (input) => {
  async function createBase64(url) {
    let base64encoded = await imageToBase64(url);
    return "data:image/jpeg;base64, " + base64encoded;
  }

  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);

  const dd = {
    content: [
      {
        text: "Item Name: " + input.itemName,
        style: "header",
      },
      {
        text: "Item Description: " + input.itemDesc,
        style: "header",
      },
      {
        text: "Submitted By: " + input.submitterName,
        style: "header",
      },
      {
        image: "item",
      },
      {
        text: "link to image: " + input.image,
      },
    ],
    images: {
      item: await createBase64(input.image),
      width: 200,
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
      },
      center: {
        alignment: "center",
        margin: [0, 10],
      },
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(dd);
  pdfReadableStream.end();
  return pdfReadableStream;
};
