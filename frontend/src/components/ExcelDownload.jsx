import { customerPurchases } from "../data/customerPurchases.js";
import { useState } from "react";

export default function ExcelDownload({ customers, getAttendanceRecords, calendarAttendance, filename }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setBusy(true);
    setError("");
    try {
      const { default: ExcelJS } = await import("exceljs");
      const book = new ExcelJS.Workbook();
      const sheet = book.addWorksheet("Customer report");
      sheet.addRow(["Customer", "Phone", "Daily milk (L)", "Rate (INR/L)", "Daily estimate (INR)", "Present in report", "Absent in report", "Recorded deliveries", "Total purchased (INR)"]);
      const marks = book.addWorksheet("Calendar entries");
      marks.addRow(["Customer", "Phone", "Calendar date", "Attendance"]);
      let totalAmount = 0;
      let purchasedPaise = 0;
      let deliveries = 0;
      let totalMilk = 0;
      let presentCount = 0;
      let absentCount = 0;
      for (const customer of customers) {
        const records = getAttendanceRecords(customer.id);
        const present = records.filter(status => status === "Present").length;
        const absent = records.filter(status => status === "Absent").length;
        const purchase = customerPurchases(customer, calendarAttendance);
        const row = sheet.addRow([customer.name, String(customer.phone), customer.milk, customer.rate, null, present, absent, purchase.days]);
        row.getCell(9).value = { formula: `ROUND(E${row.number},2)*H${row.number}`, result: purchase.amount };
        deliveries += purchase.days;
        purchasedPaise += Math.round(purchase.amount * 100);
        const amount = customer.milk * customer.rate;
        row.getCell(5).value = { formula: `C${row.number}*D${row.number}`, result: amount };
        totalMilk += customer.milk;
        totalAmount += amount;
        presentCount += present;
        absentCount += absent;
        for (const [day, status] of Object.entries(calendarAttendance[customer.id] || {}).sort()) {
          marks.addRow([customer.name, String(customer.phone), day, status]);
        }
      }
      const end = sheet.rowCount;
      const totals = sheet.addRow(["Total"]);
      for (const [column, result] of [["C", totalMilk], ["E", totalAmount], ["F", presentCount], ["G", absentCount], ["H", deliveries], ["I", purchasedPaise / 100]]) {
        totals.getCell(column).value = end === 1 ? 0 : { formula: `SUM(${column}2:${column}${end})`, result };
      }
      totals.font = { bold: true };
      for (const [tab, widths] of [[sheet, [28, 18, 18, 18, 23, 20, 20, 23, 26]], [marks, [28, 18, 18, 18]]]) {
        widths.forEach((width, i) => { tab.getColumn(i + 1).width = width; });
        tab.views = [{ state: "frozen", ySplit: 1 }];
        tab.getRow(1).height = 25;
        tab.getRow(1).eachCell(cell => {
          cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF166044" } };
        });
      }
      sheet.getColumn(4).numFmt = '#,##0.00';
      sheet.getColumn(5).numFmt = '#,##0.00';
      sheet.getColumn(9).numFmt = '#,##0.00';
      const data = await book.xlsx.writeBuffer();
      const url = URL.createObjectURL(new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      setError("The report could not be downloaded. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="my-4">
      <button type="button" onClick={download} disabled={busy} className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60">
        {busy ? "Preparing report…" : "Download Excel report"}
      </button>
      {error && <p role="alert" className="mt-2">{error}</p>}
    </div>
  );
}
