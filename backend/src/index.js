const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_req, res) => res.json({status: 'ok'}));

// JWT wall for everything below
app.use(require('./middleware/auth'));

// routers
app.use('/v1', require('./routes/patients'));
app.use('/v1', require('./routes/sessions'));
app.use('/v1', require('./routes/storage'));
app.use('/v1', require('./routes/templates'));
app.use('/users', require('./routes/users'));

// must be last
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 8080;

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`API on :${PORT}`));
}

module.exports = app;
