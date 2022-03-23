// module.exports = {
//   apps : [{
//     script: 'npm',
//     args: 'run start:production',
//     env_production: {
// 	NODE_ENV: 'production'
//     },
//     watch: '.'
//   }, {
//     script: './service-worker/',
//     watch: ['./service-worker']
//   }],

//   deploy : {
//     production : {},
//     staging: {
//       user : 's212180',
//       host : 'lirase2.compute.dtu.dk',
//       ref  : 'origin/master',
//       repo: 'git@github.com:PeacefulOtter/LiRA-Map.git',
//       path : '/var/www/LiRA-Map',
//       'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
//     }
//   }
// };
require('dotenv').config();

module.exports = {
  // apps: [
  //   {
  //     name: 'LiRA-Map client',
  //     script: './index.js',
  //   },
  // ],
  // deploy: {
  //   production: {
  //     user: 's212180',
  //     host: process.env.HOST,
  //     key: process.env.KEY_PATH,
  //     ref: 'origin/ml',
  //     repo: 'git@github.com:PeacefulOtter/LiRA-Map.git',
  //     path: '/home/s212180/LiRA-Map',
  //     'post-deploy':
  //       "cp ~/LiRA-Map/client/.env ~/LiRA-Map/source/.env && npm install && pm2 startOrRestart client/ecosystem.config.js",
  //   },
  // },
};
