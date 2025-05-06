
// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const cors = require('cors');

// const app = express();
// const PORT = 5000;

// // CORS Setup
// const corsOptions = {
//   origin: '*',  // You can restrict this in production
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type'],
// };
// app.use(cors(corsOptions));

// // Connect to SQLite database
// const db = new sqlite3.Database('./chess_course.db', sqlite3.OPEN_READONLY, (err) => {
//   if (err) {
//     console.error('❌ Could not connect to database', err);
//   } else {
//     console.log('✅ Connected to SQLite database');
//   }
// });

// // ------------------ Stories ------------------

// app.get('/stories', (req, res) => {
//   db.all('SELECT * FROM story', [], (err, rows) => {
//     if (err) return res.status(500).send(err.message);
//     res.json(rows);
//   });
// });

// app.get('/stories/:storyId', (req, res) => {
//   const storyId = req.params.storyId;
//   db.get('SELECT * FROM story WHERE story_id = ?', [storyId], (err, row) => {
//     if (err) return res.status(500).send(err.message);
//     res.json(row);
//   });
// });

// // ------------------ Principle ------------------

// app.get('/principle/:principleId', (req, res) => {
//   const principleId = req.params.principleId;
//   db.get('SELECT * FROM principle_position WHERE principle_id = ?', [principleId], (err, row) => {
//     if (err) return res.status(500).send(err.message);
//     res.json(row);
//   });
// });

// // ------------------ Story Mapping ------------------

// app.get('/story-mappings/:storyId', (req, res) => {
//   const storyId = req.params.storyId;
//   db.all('SELECT * FROM story_mapping WHERE story_id = ?', [storyId], (err, rows) => {
//     if (err) return res.status(500).send(err.message);
//     res.json(rows);
//   });
// });

// // ------------------ Puzzle ------------------

// app.get('/puzzles/:puzzleId', (req, res) => {
//   const puzzleId = req.params.puzzleId;
//   db.get('SELECT * FROM chess_puzzle WHERE chess_puzzle_id = ?', [puzzleId], (err, row) => {
//     if (err) return res.status(500).send(err.message);
//     if (!row) return res.status(404).send(`Puzzle with ID ${puzzleId} not found.`);
//     res.json(row);
//   });
// });

// // ------------------ Module ------------------

// app.get('/modules', (req, res) => {
//   db.all('SELECT * FROM module', [], (err, rows) => {
//     if (err) return res.status(500).send(err.message);
//     res.json(rows);
//   });
// });

// app.get('/modules/:moduleId/chapters', (req, res) => {
//   const moduleId = req.params.moduleId;
//   db.get('SELECT chapter_ids FROM module WHERE module_id = ?', [moduleId], (err, row) => {
//     if (err) return res.status(500).send(err.message);
//     if (!row) return res.status(404).send(`Module with ID ${moduleId} not found.`);

//     const chapterIds = (row.chapter_ids || '')
//       .replace(/[\[\]']/g, '')
//       .split(',')
//       .map(id => id.trim())
//       .filter(id => id.length > 0);

//     if (chapterIds.length === 0) return res.json([]);

//     const placeholders = chapterIds.map(() => '?').join(',');
//     db.all(`SELECT * FROM chapter WHERE chapter_id IN (${placeholders})`, chapterIds, (err, chapters) => {
//       if (err) return res.status(500).send(err.message);
//       res.json(chapters);
//     });
//   });
// });

// // ------------------ Chapters -> Stories ------------------

// app.get('/chapters/:chapterId/stories', (req, res) => {
//   const chapterId = req.params.chapterId;
//   db.get('SELECT story_ids FROM chapter WHERE chapter_id = ?', [chapterId], (err, row) => {
//     if (err) return res.status(500).send(err.message);
//     if (!row) return res.status(404).send(`Chapter with ID ${chapterId} not found.`);

//     const storyIds = (row.story_ids || '')
//       .replace(/[\[\]']/g, '')
//       .split(',')
//       .map(id => id.trim())
//       .filter(id => id.length > 0);

//     if (storyIds.length === 0) return res.json([]);

//     const placeholders = storyIds.map(() => '?').join(',');
//     db.all(`SELECT * FROM story WHERE story_id IN (${placeholders})`, storyIds, (err, stories) => {
//       if (err) return res.status(500).send(err.message);
//       res.json(stories);
//     });
//   });
// });
// // Get only the puzzle answer by puzzleId
// app.get('/puzzle-answer/:puzzleId', (req, res) => {
//   const puzzleId = req.params.puzzleId;

//   db.get('SELECT answer FROM chess_puzzle WHERE chess_puzzle_id = ?', [puzzleId], (err, row) => {
//     if (err) {
//       console.error(`Error fetching puzzle answer for ${puzzleId}:`, err.message);
//       res.status(500).send(`Error fetching puzzle answer: ${err.message}`);
//       return;
//     }

//     if (!row) {
//       res.status(404).send(`Puzzle with ID ${puzzleId} not found.`);
//       return;
//     }

//     res.json({ puzzleId, answer: row.answer });
//   });
// });


// // ------------------ Start server ------------------

// app.listen(PORT, () => {
//   console.log(`🚀 Backend server running on http://localhost:${PORT}`);
// });


const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Setup
app.use(cors({
  origin: '*', // Allow all (you can restrict in production)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Connect to SQLite database
const db = new sqlite3.Database('./chess_course.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Could not connect to database', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// ------------------ API ROUTES ------------------

// ---- Stories ----
app.get('/stories', (req, res) => {
  db.all('SELECT * FROM story', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.get('/stories/:storyId', (req, res) => {
  const storyId = req.params.storyId;
  db.get('SELECT * FROM story WHERE story_id = ?', [storyId], (err, row) => {
    if (err) return res.status(500).send(err.message);
    res.json(row);
  });
});

// ---- Principles ----
app.get('/principle/:principleId', (req, res) => {
  const principleId = req.params.principleId;
  db.get('SELECT * FROM principle_position WHERE principle_id = ?', [principleId], (err, row) => {
    if (err) return res.status(500).send(err.message);
    res.json(row);
  });
});

// ---- Story Mappings ----
app.get('/story-mappings/:storyId', (req, res) => {
  const storyId = req.params.storyId;
  db.all('SELECT * FROM story_mapping WHERE story_id = ?', [storyId], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// ---- Puzzles ----
app.get('/puzzles/:puzzleId', (req, res) => {
  const puzzleId = req.params.puzzleId;
  db.get('SELECT * FROM chess_puzzle WHERE chess_puzzle_id = ?', [puzzleId], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send(`Puzzle with ID ${puzzleId} not found.`);
    res.json(row);
  });
});

// Get Puzzle Answer Only
app.get('/puzzle-answer/:puzzleId', (req, res) => {
  const puzzleId = req.params.puzzleId;
  db.get('SELECT answer FROM chess_puzzle WHERE chess_puzzle_id = ?', [puzzleId], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send(`Puzzle with ID ${puzzleId} not found.`);
    res.json({ puzzleId, answer: row.answer });
  });
});

// ---- Modules ----
app.get('/modules', (req, res) => {
  db.all('SELECT * FROM module', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.get('/modules/:moduleId/chapters', (req, res) => {
  const moduleId = req.params.moduleId;
  db.get('SELECT chapter_ids FROM module WHERE module_id = ?', [moduleId], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send(`Module with ID ${moduleId} not found.`);

    const chapterIds = (row.chapter_ids || '').replace(/[\[\]']/g, '').split(',').map(id => id.trim()).filter(id => id);
    if (chapterIds.length === 0) return res.json([]);

    const placeholders = chapterIds.map(() => '?').join(',');
    db.all(`SELECT * FROM chapter WHERE chapter_id IN (${placeholders})`, chapterIds, (err, chapters) => {
      if (err) return res.status(500).send(err.message);
      res.json(chapters);
    });
  });
});

// ---- Chapters -> Stories ----
app.get('/chapters/:chapterId/stories', (req, res) => {
  const chapterId = req.params.chapterId;
  db.get('SELECT story_ids FROM chapter WHERE chapter_id = ?', [chapterId], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send(`Chapter with ID ${chapterId} not found.`);

    const storyIds = (row.story_ids || '').replace(/[\[\]']/g, '').split(',').map(id => id.trim()).filter(id => id);
    if (storyIds.length === 0) return res.json([]);

    const placeholders = storyIds.map(() => '?').join(',');
    db.all(`SELECT * FROM story WHERE story_id IN (${placeholders})`, storyIds, (err, stories) => {
      if (err) return res.status(500).send(err.message);
      res.json(stories);
    });
  });
});

// ------------------ Serve Frontend ------------------

// Serve static frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// ------------------ Start server ------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
