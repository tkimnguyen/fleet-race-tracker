module.exports = async function(req, res) {
  const race = loadRace(req.body.race);

  race.poll_close = new Date().toISOString();

  saveRace(race);

  res.send("Poll closed");
};
