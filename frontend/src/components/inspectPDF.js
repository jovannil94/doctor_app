const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const pdfPath = path.resolve(__dirname, '../formTemplates/CA.pdf');

const inspectPdfFields = async () => {
    try {
        const existingPdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const form = pdfDoc.getForm();
        const fields = form.getFields();

        fields.forEach(field => {
            console.log(`Field Name: ${field.getName()}`);
        });

    } catch (error) {
        console.error('Error inspecting PDF fields:', error);
    }
};

inspectPdfFields();
