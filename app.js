const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbpath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
let db = null;
const initializeDb = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (err) {
    console.log(`DB error: ${err.message}`);
    process.exit(1);
  }
};
initializeDb();

app.get("/players/", async (request, response) => {
  const getplayersquerry = `
    SELECT * from  
    cricket_team;`;
  const players = await db.all(getplayersquerry);
  response.send(players);
});

//POST API
app.post("/players", async (request, response) => {
  const playerDetail = request.body;
  console.log(playerDetail);
  const { playerName, jerseyNumber, role } = playerDetail;
  createPlayerquery = `
    INSERT INTO cricket_team(player_name,jersey_number,role)
    values
    (
       ' ${playerName}',
        ${jerseyNumber},
       ' ${role}'
        );`;
  const dbresponse = await db.run(createPlayerquery);
  console.log(dbresponse);
  response.send("Player Added to Team");
});

//GET API3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  query = `SELECT * FROM 
    cricket_team 
    WHERE player_id = ${playerId}`;
  const player = await db.get(query);
  response.send(player);
});

//PUT API4
app.put("/players/:playerId/", async (request, response) => {
  const playerDetail = request.body;
  const { playerName, jerseyNumber, role } = playerDetail;
  updatePlayerQuery = `
   UPDATE 
   cricket_team 
   SET 
   player_name = '${playerName}',
   jersey_number = ${jerseyNumber},
   role = '${role}';`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});
//DELETE API5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  deletequery = `
    DELETE FROM 
    cricket_team 
    WHERE 
    player_id = ${playerId};`;
  await db.run(deletequery);
  response.send("Player Removed");
});
module.exports = app;
