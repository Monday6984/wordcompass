const HEADERS = [
  ["Received (UK time)", (row, formatDate) => formatDate(row.created_at)],
  ["Parent name", (row) => row.parent_name],
  ["Email", (row) => row.email],
  ["Phone", (row) => row.phone],
  ["Child's age", (row) => row.child_age],
  ["Main challenge", (row) => row.main_challenge],
  ["Preferred call time", (row) => row.preferred_call_time],
  ["Preferred coach", (row) => row.preferred_coach],
  ["Status", (row) => row.status],
  ["Notes", (row) => row.notes],
];

function cell(value) {
  let text = value === null || value === undefined ? "" : String(value);
  // Stop spreadsheet apps treating a cell as a formula (but keep +44 phone numbers as they are).
  if (/^[=@\t\r]/.test(text) || /^[+-](?!\d)/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function downloadCsv(rows, formatDate) {
  const lines = [
    HEADERS.map(([title]) => cell(title)).join(","),
    ...rows.map((row) => HEADERS.map(([, get]) => cell(get(row, formatDate))).join(",")),
  ];
  // The BOM makes Excel read the file as UTF-8 (so £, é and curly quotes survive).
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `wordcompass-call-requests-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
