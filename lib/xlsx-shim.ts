// This is a shim for the xlsx package since we can't install it directly in the sandbox
// In a real project, you would install the xlsx package with npm

export const utils = {
  book_new: () => ({ SheetNames: [], Sheets: {} }),
  aoa_to_sheet: (data: any[][]) => {
    const sheet: any = { "!ref": `A1:${String.fromCharCode(65 + data[0].length - 1)}${data.length}` }
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellRef = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`
        sheet[cellRef] = { v: cell, t: typeof cell === "number" ? "n" : "s" }
      })
    })
    return sheet
  },
  book_append_sheet: (wb: any, ws: any, name: string) => {
    wb.SheetNames.push(name)
    wb.Sheets[name] = ws
  },
}

export const write = (wb: any, options: any) => {
  // This is a simplified version that just returns a buffer with the JSON stringified workbook
  // In a real implementation, this would convert the workbook to an Excel file
  const json = JSON.stringify(wb)
  return Buffer.from(json)
}
