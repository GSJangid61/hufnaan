
const mongoose = require('mongoose');
module.exports = ()=> {
  const url = 'mongodb+srv://gs:gs@cluster0.hxvp3.mongodb.net/hufnaan?retryWrites=true&w=majority';
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };
  mongoose.set('debug', true);
  mongoose.connect(url, options)
  .then(()=> console.log(`connected to mongodb`))
  .catch(err => Sentry.captureException(err));
}