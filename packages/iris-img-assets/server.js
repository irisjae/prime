var path = require('path');

var debug = true;
var static_path = path.join(__dirname, '/static');
var uploads_path = path.join(__dirname, '/uploads');

var go = Promise.resolve();
var K = x => _ => x;

module.exports = require('koa-qs')(new (require('koa'))())
  .use(require('koa-compress')())
  .use(require('koa-cors')())
  .use((ctx, next) =>
    go.then(next).catch(err => {
      console.error(err);
      ctx.type = 'application/json';
      ctx.status = 500;
      ctx.body = { error: err.reason || err.message };
      if (debug) {
        ctx.body.stack = err.stack;
      }
    })
  )
  .use(require('koa-morgan')('combined'))
  .use(require('koa-bodyparser')({ strict: false }))
  .use(require('koa-json')())
  .use(require('koa-static')(static_path, { extensions: ['html'] }))
  .use(require('koa-static')(uploads_path))
  .use(
    require('koa-router')()
      .post(
        '/assets/upload',
        require('@koa/multer')({
          storage: require('multer').diskStorage({
            destination: (_, __, then) => then(null, 'uploads/'),
            filename: (_, { originalname }, then) => then(null, originalname),
          }) /**/,
        }).single('asset'),
        ctx => {
          ctx.body = {
            url: (process.env.PROTOCOL || 'http://') + (process.env.HOSTNAME || 'lvh.me') + ':' + (process.env.PORT || 8080) + '/' + ctx.file.filename,
          };
        }
      )
      .routes()
  );
