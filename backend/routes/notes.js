const router = require('express').Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM notes ORDER BY updatedAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get(
    'SELECT * FROM notes WHERE id=?',
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json(err);
      if (!row) return res.status(404).json({ message: 'Note not found' });
      res.json(row);
    }
  );
});

router.post('/', (req, res) => {
  const { title, content, tags } = req.body;

  db.run(
    'INSERT INTO notes(title,content,tags) VALUES(?,?,?)',
    [title, content, JSON.stringify(tags || [])],
    function (err) {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        id: this.lastID,
        title,
        content,
        tags
      });
    }
  );
});

router.put('/:id', (req, res) => {
  const { title, content, tags } = req.body;

  db.run(
    'UPDATE notes SET title=?, content=?, tags=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?',
    [title, content, JSON.stringify(tags || []), req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        id: req.params.id,
        title,
        content,
        tags
      });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run(
    'DELETE FROM notes WHERE id=?',
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({ message: 'Note deleted successfully' });
    }
  );
});

module.exports = router;
