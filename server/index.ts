import big from 'big.js';
big.PE = 100;
big.NE = -100;
big.RM = 0;
import Server from './component/server';
import DB from './component/util/db';

(async () => {
  console.log(`STARTING SERVER - TEST ENV: RUN ON [${process.env.ENV}] ENV`);
  await DB.init();
  const server = new Server(process.env.PORT, process.env.LIMIT);
  server.start()
    .then(() => {
      console.log(`Node version: ${process.version}`);
    }).catch((err) => {
      console.log(err);
      process.exit(-1);
    });
})();
