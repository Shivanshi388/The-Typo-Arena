import User from "../models/User.js";

export async function getLeaderboardController(req, res) {
  try {
    const users = await User.find({})
      .sort({
        bestWpm: -1,
        bestAccuracy: -1,
      })
      .limit(20)
      .select("name gamesPlayed gamesWon bestWpm bestAccuracy");

    res.json({
      leaderboard: users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
