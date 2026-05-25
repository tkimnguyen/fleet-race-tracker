function parseICS(text) {
  return text.split("BEGIN:VEVENT").slice(1).map(e => {
    const summary = e.match(/SUMMARY:(.*)/)?.[1];
    const dt = e.match(/DTSTART(?:;TZID=.*?)?:(.*)/)?.[1];

    let date;
    if (dt.endsWith("Z")) {
      date = new Date(dt);
    } else {
      date = new Date(
        dt.substring(0,4),
        dt.substring(4,6)-1,
        dt.substring(6,8),
        dt.substring(9,11),
        dt.substring(11,13)
      );
    }

    return {summary, date};
  });
}
