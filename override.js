module.exports = async function(req, res) {
  const { phone, status, comment, race } = req.body;

  const data = loadRace(race.summary);

  const idx = data.responses.findIndex(r => r.phone === phone);

  if (idx >= 0) {
    data.responses[idx].status = status;
    data.responses[idx].comment = comment;
    data.responses[idx].override = true;
  }

  saveRace(data);

  res.send("Override done");
};
