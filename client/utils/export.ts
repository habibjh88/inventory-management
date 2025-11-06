export function exportToCsv(filename: string, rows: (string | number)[][]) {
  const processRow = (row: (string | number)[]) =>
    row
      .map((val) => {
        let inner = String(val ?? "");
        if (inner.includes("\"")) inner = inner.replace(/\"/g, '""');
        if (/[",\n]/.test(inner)) inner = `"${inner}"`;
        return inner;
      })
      .join(",");
  const csvContent = rows.map(processRow).join("\n");
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
