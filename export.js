function exportCSV(data) {
  const header = ["Boat","Skipper","Status","Comment","Timestamp"];

  return [header, ...data.map(r =>
    [r.boat, r.skipper, r.status, r.comment, r.timestamp]
  )].map(r => r.join(",")).join("\n");
}