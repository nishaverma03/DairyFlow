import { useState } from "react";

export default function ExcelDownload({
  customers,
  getAttendanceRecords,
  calendarAttendance,
  filename,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setBusy(true);
    setError("");

    try {
      const { default: ExcelJS } = await import("exceljs");

      const book = new ExcelJS.Workbook();

      // Main customer report
      const sheet = book.addWorksheet("Customer report");

      sheet.addRow([
        "Customer",
        "Phone",
        "Daily milk (L)",
        "Rate (INR/L)",
        "Present in report",
        "Absent in report",
        "Total purchased (INR)",
      ]);

      // Calendar attendance sheet
      const marks = book.addWorksheet("Calendar entries");

      marks.addRow([
        "Customer",
        "Phone",
        "Calendar date",
        "Attendance",
      ]);

      for (const customer of customers) {
        const records = getAttendanceRecords(customer.id);

        const present = records.filter(
          (status) => status === "Present"
        ).length;

        const absent = records.filter(
          (status) => status === "Absent"
        ).length;

        // Calculate the customer's payable amount
        const amount =
          Number(customer.milk || 0) *
          Number(customer.rate || 0) *
          present;

        const row = sheet.addRow([
          customer.name,
          String(customer.phone),
          Number(customer.milk || 0),
          Number(customer.rate || 0),
          present,
          absent,
          null,
        ]);

        // Total amount = Daily milk × Rate × Present days
        row.getCell(7).value = {
          formula: `ROUND(C${row.number}*D${row.number}*E${row.number},2)`,
          result: amount,
        };

        // Add calendar attendance records
        for (
          const [day, status] of Object.entries(
            calendarAttendance[customer.id] || {}
          ).sort()
        ) {
          marks.addRow([
            customer.name,
            String(customer.phone),
            day,
            status,
          ]);
        }
      }

      // Formatting
      const sheets = [
        [sheet, [28, 18, 18, 18, 20, 20, 26]],
        [marks, [28, 18, 20, 18]],
      ];

      for (const [tab, widths] of sheets) {
        widths.forEach((width, index) => {
          tab.getColumn(index + 1).width = width;
        });

        tab.views = [{ state: "frozen", ySplit: 1 }];

        tab.getRow(1).height = 25;

        tab.getRow(1).eachCell((cell) => {
          cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
          };

          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF166044" },
          };
        });
      }

      // Number formatting
      sheet.getColumn(3).numFmt = "0.##";
      sheet.getColumn(4).numFmt = "#,##0.00";
      sheet.getColumn(7).numFmt = "#,##0.00";

      // Generate Excel file
      const data = await book.xlsx.writeBuffer();

      const url = URL.createObjectURL(
        new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      document.body.append(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.error("Excel report error:", err);
      setError("The report could not be downloaded. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="my-4">
      <button
        type="button"
        onClick={download}
        disabled={busy}
        className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
      >
        {busy ? "Preparing report…" : "Download Excel report"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}