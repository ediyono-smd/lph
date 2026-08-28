"use client";

export function printCertificateElement(elementId = "printable-certificate") {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Create or reuse hidden print iframe
  let iframe = document.getElementById("certificate-print-frame") as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "certificate-print-frame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Extract all styles & link tags from the page
  let stylesHtml = "";
  document.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => {
    stylesHtml += node.outerHTML;
  });

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sertifikat Halal Resmi - Cetak Dokumen</title>
        ${stylesHtml}
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            background: #ffffff !important;
            color: #0f172a !important;
            overflow: hidden !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          #printable-certificate {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 9mm 11mm !important;
            border: 8px solid #073b2d !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error("Print frame error:", e);
      window.print();
    }
  }, 350);
}
