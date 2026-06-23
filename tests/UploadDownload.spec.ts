import { expect, test } from '@playwright/test';
import * as ExcelJS from 'exceljs';

async function writeExcelFile(searchvalue: string, filePath: string, change: { rowChange: number; colChange: number }, replacevalue: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    if (!worksheet) return;
    const output = readExcelFile(searchvalue, worksheet);
    console.log(output);
    //From the output, we can get the row and column of the cell that contains the search value. We can then use this information to update the cell with the new value.
    //eg: I want to update price of the product "Apple" to 10. I will search for "Apple" in the worksheet, get the row and column of the cell that contains "Apple", and then update the cell that is 1 row below and 1 column to the right of the cell that contains "Apple" with the value 10.
    const cell = worksheet.getCell(output.row + change.rowChange, output.column + change.colChange);
    console.log(cell.value);
    cell.value = replacevalue;
    console.log(cell.value);
    await workbook.xlsx.writeFile(filePath);
}

function readExcelFile(searchValue: string, worksheet: ExcelJS.Worksheet) {
    const output = { row: -1, column: -1 };
    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
            if (cell.value === searchValue) {
                output.row = rowNumber;
                output.column = colNumber;
            }
        });
    });
    return output;
}

test('@UI - Upload and Download', async ({ page }) => {
    const textSearch = "Apple";
    const updateValue = "50";

    page.goto("https://rahulshettyacademy.com/upload-download-test/index.html")
    await page.waitForLoadState('networkidle');
    const downloadPromise = page.waitForEvent('download');
    await page.click("#downloadButton");
    const download = await downloadPromise;
    const filePath = '/Users/hoangtronglong/Documents/download.xlsx';
    await download.saveAs(filePath);
    await writeExcelFile(textSearch, filePath, { rowChange: 0, colChange: 2 }, updateValue);
    await page.locator("#fileinput").setInputFiles(filePath);

    const desiredRow = await page.getByRole('row').filter({ has: page.getByText(textSearch) });
    await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);


})
