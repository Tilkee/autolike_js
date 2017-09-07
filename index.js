var link = require('./linkedin_lib.js');
var twit = require('./twitter_lib.js');


linkedin = new link();
twitter  = new twit();
// var request = require('request');
// const Nick  = require("nickjs")
const nick  = new linkedin.Nick({
  loadImages: true,
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0",
  printPageErrors: false,
  printResourceErrors: false,
  printNavigation: false,
  printAborts: false,

})

const argv = require('yargs').argv

console.log(argv.email)
console.log(argv.pass)
console.log(argv.url)

// nick.newTab().then(async (tab) => {
//     try {
//         if(argv.token) {
//             // Connexion à linkedin
//             linkedin.li_at = argv.token;
//             await linkedin.linkedinConnect(tab, nick);
//         } else {
//             await linkedin.getNewToken(tab, nick, {email: argv.email, pass: argv.pass})
//         }

//         // Liker un post
//         await linkedin.likePost(tab, "https://www.linkedin.com/feed/update/urn:li:activity:6311470564892643328");

//     } catch(err) {
//       console.log('=======Error script=========')
//       console.log(err);
//     }
// })
// .then(() => {
//   nick.exit(0)
// })
// .catch((err) => {
//   console.log("An error occured:", err)
//   nick.exit(1)
// })

nick.newTab().then(async (tab) => {
    try {
        if(argv.token) {
            // Connexion à linkedin
            twitter.token = argv.token;
            //console.log(twitter);
            await twitter.TwitterConnect(tab, nick);
        } else {
            await twitter.getNewToken(tab, nick, {email: argv.email, pass: argv.pass})
            await twitter.likePost(tab, "https://twitter.com/emploievenement/status/905729044729221120");
        }
    } catch(err) {
      console.log('=======Error script=========')
      console.log(err);
    }
})
.then(() => {
  nick.exit(0)
})
.catch((err) => {
  console.log("An error occured:", err)
  nick.exit(1)
})

