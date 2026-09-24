# Grade 5 Word Puzzle Game - Complete Design Document

## Game Title: **WordQuest Adventure**

### Overview
An educational word puzzle game designed for Grade 5 students (ages 10-11) that builds vocabulary, spelling, logical thinking, and pattern recognition through engaging gameplay with progressive difficulty.

---

## Core Game Mechanics

### Primary Gameplay
- **Drag-and-drop letter tiles** to form words
- **Tap-to-select** alternative input method
- **Visual feedback** with animations for correct/incorrect attempts
- **Progressive tutorial** system for new mechanics

### Helper Tools
| Tool | Effect | Cost |
|------|--------|------|
| Shuffle | Rearranges letter positions | Free (1 use per level) |
| Hint | Reveals one correct letter position | 3 coins |
| Skip Level | Skip to next level | 5 coins + no star rating |

### Scoring System
| Factor | Points |
|--------|--------|
| Base completion | 100 points |
| Time bonus | Up to 50 points (faster = more) |
| No hints used | +25 bonus |
| First try | +50 bonus |
| Streak multiplier | x1.5 (3+ correct), x2 (5+ correct), x3 (10+ correct) |
| Combo multiplier | x1.25 for consecutive quick solves |

### Timer System
| Level Range | Time Limit |
|-------------|------------|
| 1-20 | 60 seconds |
| 21-50 | 55 seconds |
| 51-100 | 50 seconds |
| 101-150 | 45 seconds |
| 151-300 | 40 seconds |

---

## Word Information Display

After completing each level, players see:

```
┌─────────────────────────────────────┐
│  🎉 Great Job!                      │
│                                     │
│  Word: FOREST                       │
│  Pronunciation: /ˈfɔːrɪst/          │
│  Part of Speech: Noun               │
│                                     │
│  Meaning:                           │
│  A large area covered with trees.   │
│                                     │
│  Example:                           │
│  We went hiking in the forest.      │
│                                     │
│  Fun Fact:                          │
│  Forests cover about 31% of Earth!  │
│                                     │
│  ⭐⭐⭐ Score: 175                  │
│  🪙 Coins: +15                      │
└─────────────────────────────────────┘
```

---

## Special Level Types

### Bonus Coin Challenge (Every 10th Level)
- Solve the word to earn triple coins
- Gold-themed background
- Special coin rain animation

### Speed Challenge (Every 20th Level)
- Timer reduced to 30 seconds
- Bonus multiplier for fast completion
- Lightning bolt visual effects

### Mystery Word (Every 30th Level)
- Hint reveals only category, not letters
- Extra reward for completion
- Mystery box reveal animation

### Boss Challenge (Every 50th Level)
- Solve 3 words consecutively
- No hints allowed
- Limited total time (90 seconds for all 3)
- Epic boss defeat animation
- Special badge reward

---

## Reward System

### Currency
- **Coins**: Earned per level, used for hints/skips
- **Stars**: 1-3 per level based on performance
- **XP**: Cumulative experience for profile progression

### Star Rating
| Stars | Criteria |
|-------|----------|
| ⭐ | Complete the level |
| ⭐⭐ | Complete with no hints |
| ⭐⭐⭐ | Complete with no hints, first try, under 50% time |

### Unlockables
| Item | Unlock Condition |
|------|------------------|
| Forest Theme | Level 10 |
| Ocean Theme | Level 25 |
| Space Theme | Level 50 |
| Jungle Theme | Level 75 |
| Winter Theme | Level 100 |
| Desert Theme | Level 150 |
| Fantasy Theme | Level 200 |
| Galaxy Theme | Level 250 |
| Rainbow Theme | Level 300 |

### Avatars
- Collect through achievements
- 12 different character options
- Customizable colors

### Badges
| Badge | Requirement |
|-------|-------------|
| First Steps | Complete Level 1 |
| Word Warrior | Complete Level 50 |
| Vocabulary Master | Complete Level 150 |
| Word Champion | Complete Level 300 |
| Speed Demon | Complete 10 Speed Challenges |
| Hint Free | Complete 50 levels without hints |
| Streak Master | Get a 20-win streak |
| Coin Collector | Earn 5000 coins |
| Perfect Score | Get 3 stars on 100 levels |

---

## Achievement Trophies
| Trophy | Requirement |
|--------|-------------|
| 🥉 Bronze | Complete 50 levels |
| 🥈 Silver | Complete 150 levels |
| 🥇 Gold | Complete 300 levels |
| 💎 Diamond | Get 3 stars on all levels |

---

## Daily Rewards
| Day | Reward |
|-----|--------|
| Day 1 | 5 coins |
| Day 2 | 10 coins |
| Day 3 | 15 coins |
| Day 4 | 20 coins |
| Day 5 | 25 coins |
| Day 6 | 30 coins |
| Day 7 | 50 coins + Mystery Box |

---

## Encouragement Messages

### On Completion
- "Great Job!"
- "Excellent Work!"
- "You're Amazing!"
- "Keep It Up!"
- "Fantastic!"
- "Brilliant!"
- "Well Done!"
- "Super Star!"

### On Near Miss
- "Almost There!"
- "So Close!"
- "Try Again!"
- "You Can Do It!"
- "Keep Trying!"
- "Don't Give Up!"

### On Struggle
- "Learning Takes Time!"
- "Every Try Makes You Better!"
- "You're Improving!"
- "Practice Makes Perfect!"
- "Stay Positive!"

---

## Difficulty Scaling Factors

| Factor | How It Increases |
|--------|------------------|
| Word Length | 4 → 5 → 6 → 7 letters |
| Vocabulary | Common → Academic → Specialized |
| Timer | 60s → 55s → 50s → 45s → 40s |
| Similar Letters | Fewer → More confusing combinations |
| Categories | General → Specific topics |
| Hints | Unlimited → Limited → None |

---

## Categories by Difficulty

### Beginner (Levels 1-20)
- Animals, Colors, Family, Food, Body Parts, School, Home, Nature

### Easy (Levels 21-50)
- Weather, Sports, Clothing, Furniture, Vehicles, Plants, Tools, Music

### Intermediate (Levels 51-100)
- Science, Geography, History, Literature, Math, Art, Technology, Health

### Advanced (Levels 101-150)
- Ecosystems, Countries, Occupations, Emotions, Materials, Structures, Systems, Processes

### Expert (Levels 151-300)
- Complex Concepts, Abstract Ideas, Advanced Science, World History, Literature, Culture, Innovation, Environment
