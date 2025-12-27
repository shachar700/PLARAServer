const { Badge, UserBadge, UserProgress, GuideRead } = require('../services/database/Schemas');
const { logMessage } = require("../utils");

const initBadges = async () => {
    const existingCount = await Badge.countDocuments();

    if (existingCount === 0) {
        await Badge.insertMany([
            {
                badge_id: 101,
                title: "Getting Started",
                title_he: "מתחילים",
                description: "Play for 5 minutes.",
                description_he: "שחק במשך 5 דקות."
            },
            {
                badge_id: 102,
                title: "Settling In",
                title_he: "נכנסים לעניינים",
                description: "Play for 10 minutes.",
                description_he: "שחק במשך 01 דקות."
            },
            {
                badge_id: 201,
                title: "Curious Mind",
                title_he: "סקרן מטבעו",
                description: "Read your first guide.",
                description_he: "קרא את המדריך הראשון שלך."
            },
            {
                badge_id: 202,
                title: "Guide Explorer",
                title_he: "חוקר מדריכים",
                description: "Read 2 guides.",
                description_he: "קרא 2 מדריכים."
            },
            {
                badge_id: 203,
                title: "Avid Reader",
                title_he: "קורא נלהב",
                description: "Read 3 guides.",
                description_he: "קרא 3 מדריכים."
            },
            {
                badge_id: 204,
                title: "Master Reader",
                title_he: "אמן הקריאה",
                description: "Read all guides.",
                description_he: "קרא את כל המדריכים."
            },
            {
                badge_id: 301,
                title: "Quiz Challenger",
                title_he: "מתמודד חידונים",
                description: "Complete a quiz.",
                description_he: "השלם חידון."
            },
            {
                badge_id: 302,
                title: "Quiz Master",
                title_he: "אמן החידונים",
                description: "Score 100% on a quiz.",
                description_he: "קבל ציון 001% בחידון."
            }

        ]);
        return 'Badges inserted into the database.';
    } else {
        return 'Badges are already in the database.';
    }
}

// resetAllUserBadges() :: clear the UserBadge table
const resetAllUserBadges = async () => {
    try {
        const result = await UserBadge.deleteMany({});
        return `Reset complete. Deleted ${result.deletedCount} user badge records.`;
    } catch (err) {
        console.error("Error resetting user badges:", err);
        return "Failed to reset user badges.";
    }
};

// resetAllUserProgress() :: clear the UserProgress table
const resetAllUserProgress = async () => {
    try {
        const result = await UserProgress.deleteMany({});
        return `Reset complete. Deleted ${result.deletedCount} user progress records.`;
    } catch (err) {
        console.error("Error resetting user progress:", err);
        return "Failed to reset user progress.";
    }
};

// resetUserBadges(username) :: clear the UserBadge records for username
const resetUserBadges = async (username) => {
    try {
        const result = await UserBadge.deleteMany({ username });
        return `Reset complete. Deleted ${result.deletedCount} badge records for user "${username}".`;
    } catch (err) {
        console.error(`Error resetting badges for user ${username}:`, err);
        return `Failed to reset badges for user "${username}".`;
    }
};

// resetUserProgress(username) :: clear the UserProgress records for username
const resetUserProgress = async (username) => {
    try {
        const cleanedUsername = username.trim();

        const progressResult = await UserProgress.deleteMany({ username: cleanedUsername });
        const guidesResult = await GuideRead.deleteMany({ username: cleanedUsername });

        return `Reset complete. Deleted ${progressResult.deletedCount} progress records and ${guidesResult.deletedCount} guide read records for user "${cleanedUsername}".`;
    } catch (err) {
        console.error(`Error resetting progress for user ${username}:`, err);
        return `Failed to reset progress for user "${username}".`;
    }
};


module.exports = { initBadges, resetAllUserBadges, resetAllUserProgress, resetUserBadges, resetUserProgress };