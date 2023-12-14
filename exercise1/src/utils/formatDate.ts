export function getCurrentDate() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  let month = (currentDate.getMonth() + 1).toString(); // Months are zero-indexed
  let day = currentDate.getDate().toString();
  const completeDate = `${year}-${month}-${day}`;
  console.log(completeDate);
  return completeDate;
}
