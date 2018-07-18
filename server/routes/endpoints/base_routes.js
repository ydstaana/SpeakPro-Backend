const express = require('express');
const router = express.Router();
const cors = require('cors')

router.use(cors());

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

module.exports = router;
