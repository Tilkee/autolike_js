var request = require('request');
const Nick  = require("nickjs")


class TwitterLib {

        constructor(args = [], {} = {}) {
        this.token = "e100f80afd515685b846b974b76509ea6257295c";
        //Yannick account
        //var this.token = "AQEDAQDB7LUDzVaWAAABXjiQpUUAAAFeXJ0pRU4AsJsSY2IdLUIzg13h2rt_K4pkdNYvZnk1KlPEknxsl_iRWor_3uWj1rO82ZoonWTM10EyEu_Lj0nYMaGWEDMR6ED2ZFjRA11KJ51FigSQMhTRE6u0"
        this.Nick = Nick;

        this.getRandomInt = function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min +1)) + min;
        }

        this.TwitterConnect = async (tab, nick) => {
            console.log(this.token);
            console.log('here')
            await tab.setCookie({
                name: "auth_token",
                value: "e100f80afd515685b846b974b76509ea6257295c",
                domain: ".twitter.com"
            })
            await tab.open("https://twitter.com")
            try {
                // /await tab.waitUntilVisible(".DashboardProfileCard-name", 10000)
                await tab.inject("jquery-3.2.1.min.js");
                const name = await tab.evaluate((arg, callback) => {
                    callback(null, $(".DashboardProfileCard-name").text().trim())
                })
                console.log(`Connected successfully as ${name}`)
            } catch (error) {
            console.log(error)
            console.log("Can't connect to LinkedIn with this session cookie.")
                try {
                    console.log('error')
                    //await this.getNewToken(tab, nick);
                } catch (err) {
                    throw (err);
                    nick.exit(1)
                }
            }
        }

        this.getNewToken = async (tab, nick, user) => {
            var url = "https://twitter.com/login"; // On charge la page pour récupérer le CSFR
            try {
                const [httpCode, httpStatus] = await tab.open(url);

                if (httpCode !== 200) { // Si la connexion echoue on renvoie une exeption
                  throw("Not http code 200")
                }
                var selector  = ".submit.EdgeButton.EdgeButton--primary.EdgeButtom--medium" // Rechercher le bouton submit

                try {
                    await tab.waitUntilVisible(selector, 5000)
                    await tab.inject("jquery-3.2.1.min.js");
                    const toto = await tab.evaluate((arg, callback) => {
                        $(".js-username-field").val('akoubayofamily@gmail.com');
                        $(".js-password-field").val('25594378ALlant');
                        $(".submit.EdgeButton.EdgeButton--primary.EdgeButtom--medium").click();
                        callback(null, $("body").text().trim())
                    })
                    await tab.wait(3000)
                    var cookies    = await nick.getAllCookies();
                    console.log(cookies);
                    console.log(`Connected successfully as ${name}`)
                } catch (err) {
                    console.log("Form not found:", err)
                }
            } catch(e) {

            }
        }

    this.likePost = async (tab, url) => {
        var randomInt = this.getRandomInt(1,5) * 1000;

        await tab.wait(randomInt) // On attend quelques seconde pour évité de se faire blacklist
        try {
          const [httpCode, httpStatus] = await tab.open(url);

          if (httpCode !== 200) {
                if(retry < 3) {
                    retry++; // Si la connection echoue on recommence
                    this.getLastMessage(tab);
                } else {
                  throw("Not http code 200");
                }
          }
          await tab.wait(this.getRandomInt(1,10) * 1000); // On attend quelques seconde pour évité de se faire blacklist
          try {
            await tab.waitUntilVisible('.ProfileTweet-actionButton.js-actionButton.js-actionFavorite');
            await tab.click('.ProfileTweet-actionButton.js-actionButton.js-actionFavorite');
            console.log('Ok like !')
          } catch(e) {
            throw("La page ne s'est pas chargé");
          }
        } catch(e) {
          throw("Le like n'a pas fonctionné : " + e)
        }
    }

    }
}

//https://twitter.com/emploievenement/status/905729044729221120

module.exports = TwitterLib;
