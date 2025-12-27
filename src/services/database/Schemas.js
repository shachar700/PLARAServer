
// Badge schema based on struct Badge, PK: badge_id
 
// UserBadge schema based on struct UserBadge, PKs: username + badge_id

// check if there is a need for User table, beside just for the username - UserBadge covers it.

// QuizResult based on the struct, PK: quizResult_id

// AnswerResult based on the struct, PKs: answerResult_id + quizResult_id

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// MongoDB uses _id as the primary key by default, badge_id as unique for logical clarity
const BadgeSchema = new Schema({
  badge_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  title_he: { type: String, required: true },
  description: { type: String, required: true },
  description_he: { type: String, required: true }
});

const UserBadgeSchema = new Schema({
    username: { type: String, required: true },
    badge_id: { type: Number, ref: 'Badge', required: true },
    dateEarned: { type: Date, default: Date.now }
});

// AnswerResult schema
const AnswerResultSchema = new Schema({
      question_id: { type: Number, required: true },
      quizResult_id: { type: Number, ref: 'QuizResult', required: true },
      selectedAnswer: { type: Number, required: true },
      correctAnswer: { type: Number, required: true },
      durationSec: { type: Number, required: true }
});

// QuizResult schema
const QuizResultSchema = new Schema({
  quizResult_id: { type: Number, unique: true },
  username: { type: String, required: true },
  groupNumber: { type: Number, required: true },
  totalDurationSec: { type: Number, required: true },
  timestamp: { type: Date, default: new Date() },
});

// QuizResult schema
const UserProgressSchema = new Schema({
    username: { type: String, required: true, unique: true },
    playDurationMin: { type: Number, default: 0 }
});

const GuideReadSchema = new Schema({
    GR_id: {type: String, required: true, unique: true},
    username: { type: String, required: true },
    guideId: { type: Number, required: true },
})

// Models
const Badge = model("Badge", BadgeSchema);
const UserBadge = model("UserBadge", UserBadgeSchema);
const QuizResult = model("QuizResult", QuizResultSchema);
const AnswerResult = model("AnswerResult", AnswerResultSchema);
const UserProgress = model("UserProgress", UserProgressSchema);
const GuideRead = model("GuideRead", GuideReadSchema);

module.exports = { Badge, UserBadge, QuizResult, AnswerResult, UserProgress, GuideRead };


