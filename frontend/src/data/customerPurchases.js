export function customerPurchases(customer, calendarAttendance) {
  const days = Object.values(calendarAttendance[customer.id] || {})
    .filter(status => status === "Present").length;
  const dailyAmount = customer.milk * customer.rate;
  const dailyPaise = Math.round((dailyAmount + Number.EPSILON) * 100);
  return { days, amount: days * dailyPaise / 100 };
}
