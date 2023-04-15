const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const db_path = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDataBaseAndServer = async () => {
  try {
    db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDataBaseAndServer();

// API-1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT * FROM cricket_team ORDER BY player_id`;
  const playersArray = await db.all(getPlayersQuery);
  ConvertCamelToPascalCase = (player) => {
    return {
      playerId: player.player_id,
      playerName: player.player_name,
      jerseyNumber: player.jersey_number,
      role: player.role,
    };
  };
  response.send(playersArray.map((player) => ConvertCamelToPascalCase(player)));
});

//API-2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO cricket_team(player_name, jersey_number, role)
    VALUES('${playerName}', '${jerseyNumber}', '${role}')`;
  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
  console.log("Player Added to Team");
});

//API-3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerGetQuery = `
  SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
  const playerOne = await db.get(playerGetQuery);
  ConvertCamelToPascalCase = (player) => {
    return {
      playerId: player.player_id,
      playerName: player.player_name,
      jerseyNumber: player.jersey_number,
      role: player.role,
    };
  };
  response.send(ConvertCamelToPascalCase(playerOne));
});

//API-4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE cricket_team 
    SET
    player_name = '${playerName}',
    jersey_number = '${jerseyNumber}',
    role = '${role}'
    WHERE player_id = '${playerId}'`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//API-5
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM cricket_team WHERE player_id = ${playerId}`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
