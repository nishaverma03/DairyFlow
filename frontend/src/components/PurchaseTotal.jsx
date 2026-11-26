import { customerPurchases } from "../data/customerPurchases.js";

export default function PurchaseTotal({ customer, calendarAttendance }) {
  const { days, amount } = customerPurchases(customer, calendarAttendance);
  return (
    <section className="mt-5 rounded-xl bg-green-100 p-5 text-green-950">
      <h3 className="font-semibold">Total milk purchased</h3>
      <p className="mt-1 text-2xl font-bold">₹{amount.toFixed(2)}</p>
      <p className="mt-1 text-sm">{days} recorded {days === 1 ? "delivery" : "deliveries"} · {customer.milk} L per delivery at ₹{customer.rate}/L</p>
    </section>
  );
}
