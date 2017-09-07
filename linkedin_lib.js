var request = require('request');
const Nick  = require("nickjs")


class LinkedinLib {

  // Damien account
  constructor(args = [], {} = {}) {
    this.li_at = "AQV07A2bcnCLfCD25AhnTfxdxugBGfZCBFwvG34IDVWb7m2Ynabh3sPrPNcVd-M09MYMWv7qXrMCngUiQDUjNlpRaTvT-ekwU97afjfxLT2sUVIKWTXiiuyy4D8134n6dojotbEfoQH17VqX9Gebvmp06XtsFQ5CVMXypvVAQWh8MrNkQac";
    //Yannick account
    //var this.li_at = "AQEDAQDB7LUDzVaWAAABXjiQpUUAAAFeXJ0pRU4AsJsSY2IdLUIzg13h2rt_K4pkdNYvZnk1KlPEknxsl_iRWor_3uWj1rO82ZoonWTM10EyEu_Lj0nYMaGWEDMR6ED2ZFjRA11KJ51FigSQMhTRE6u0"
    this.Nick = Nick;

    this.getRandomInt = function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min +1)) + min;
    }

    this.getFirstName = (arg, callback) => {
      let name = document.querySelector(".pv-top-card-section__image").alt
      const hasAccount = document.querySelector(".pv-member-badge.ember-view .visually-hidden").textContent
      let i = 0
      while (i === 0) {
        if (name.length > 0) {
          name = name.split(" ")
          name.pop()
          name = name.join(" ")
          if (hasAccount.indexOf(name) >= 0) {
            i = 1
          }
        } else {
          i = 1
        }
      }
      if (name.length > 0)
        callback(null, name)
      else
        callback(null, document.querySelector(".pv-top-card-section__image").alt)
    }


    this.linkedinConnect = async (tab, nick) => {
      console.log(this.li_at);
      console.log('here')
      await tab.setCookie({
        name: "li_at",
        value: this.li_at,
        domain: ".www.linkedin.com"
      })
      await tab.open("https://www.linkedin.com")
      try {
        await tab.waitUntilVisible("#extended-nav", 10000)
        const name = await tab.evaluate((arg, callback) => {
          callback(null, document.querySelector(".nav-item__profile-member-photo.nav-item__icon").alt)
        })
        console.log(`Connected successfully as ${name}`)
      } catch (error) {
        console.log("Can't connect to LinkedIn with this session cookie.")
        try {
            await this.getNewToken(tab, nick);
        } catch (err) {
            throw (err);
            nick.exit(1)
        }
      }
    }
    this.message = `Hey #firstName#,

    I checked your profile and I'd like to be part of your network.

    Nice to connect!

    Best regards`

    this.connectTo = async (selector, tab) => {
      const firstName = await tab.evaluate(this.getFirstName)
      await tab.click(selector)
      await tab.waitUntilVisible(".send-invite__actions > button:nth-child(1)")
      await tab.click(".send-invite__actions > button:nth-child(1)")
      await tab.waitUntilVisible("#custom-message")
      await tab.evaluate((arg, callback) => {
        document.getElementById("custom-message").value = arg.message
        callback()
      }, {message: this.message.replace("#firstName#", firstName)})
      await tab.sendKeys("#custom-message", "") // Trigger the event of textarea
      await tab.click(".send-invite__actions > button:nth-child(2)")
      try {
        await tab.waitUntilVisible([".mn-invite-alert__svg-icon--success", ".mn-heathrow-toast__icon--success"], 10000, "or")
      } catch (error) {
        console.log("Button clicked but could not verify if the user was added.")
      }
    }


    /***
    *    Fonction pour ajouter de nouvelles connexions.
    *    Param :
    *        - name => uri qui pointe vers la connexion
    *        - agentO
    ***/
    this.addLinkedinFriend = async (name, tab) => {
        const url = "https://www.linkedin.com/in/" + name
        try {
            const [httpCode, httpStatus] = await tab.open(url)

            if (httpCode !== 200) { // Renvoie une exeption en cas d'erreur.
              throw("Not http code 200")
            }
            await tab.waitUntilVisible("#profile-wrapper", 10000)
        } catch (error) {
            if ((await tab.getUrl()) === "https://www.linkedin.com/in/unavailable/") {
                throw(`${url} is not a valid URL.`)
            } else {
              throw(`Error while loading ${url}:\n${error}`)
            }
        }
        const selectors = ["button.connect.primary", "span.send-in-mail.primary", "button.accept.primary", "button.message.primary", "button.follow.primary", ".pv-top-card-section__invitation-pending"]
        try {
            var selector = await tab.waitUntilVisible(selectors, 10000, "or")
        } catch (error) {
            throw(`${url} didn't load correctly.`)
        }
        if (selector === selectors[0]) {
            await this.connectTo(selector, tab)
            console.log(`+ Added ${url}.`)
        } else if (selector === selectors[1]) {
            await tab.click(".pv-top-card-overflow__trigger.button-tertiary-medium-round-inverse")
            await tab.waitUntilVisible("li.connect")
            await this.connectTo("li.connect", tab)
            console.log(`+ Added ${url}.`)
        } else if (selector === selectors[2]) {
            await tab.click(selector)
            console.log(`+ ${url} accepted.`)
        } else if (selector === selectors[3]) {
            console.log(`x ${url} seems to already be in your network (only message button visible).`)
        } else if (selector === selectors[4]) {
            console.log(`x Can't connect to ${url} (only follow button visible)`)
        } else if (selector === selectors[5]) {
            console.log(`~ ${url} seems to be invited already and the in pending status.`)
        }
    }


    /***
    *    Fonction pour récupérer toutes les connexions en attente
    *        Parama : Un tab pour appeler la page.
    ***/
    this.linkedinWaitingConnexion = async (tab) => {
      var url = "https://www.linkedin.com/mynetwork/invitation-manager/sent/"
      try {
        const [httpCode, httpStatus] = await tab.open(url)
        if (httpCode !== 200) {
          throw("Not http code 200")
        }

        await tab.waitUntilVisible(".visually-hidden", 10000);
      } catch(error) {
        console.log(error);
      }
      const x = 0
      const y = 0
      try {
        await tab.scroll(x, y)
        // You are now at the bottom of the page
      } catch (err) {
        console.log("An error occured during the scroll to bottom:", err)
      }
      try {
        await tab.waitUntilVisible(".mn-person-info__name", 5000);
        console.log('ok')
        await tab.inject("jquery-3.2.1.min.js");
        var test = await tab.evaluate((arg,callback)=> {

          var name = [];
          $('.mn-person-info__name').each(function(index, value) {
            name.push({
              index:index,
              name:$(value).text().trim()
            });
          })
          callback(null, name);
        })
        console.log(test);
      } catch(error) {

      }
    }

    /***
    *    Fonction pour récupérer un nouveau token
    *    Param : tab : Le tab en cours pour l'exuction
    ***/

    this.getNewToken = async (tab, nick, user) => {
        var url = "https://www.linkedin.com/"; // On charge la page pour récupérer le CSFR
        try {
            const [httpCode, httpStatus] = await tab.open(url);

            if (httpCode !== 200) { // Si la connexion echoue on renvoie une exeption
              throw("Not http code 200")
            }

            var selectors = ["#login-email", "#login-password"];

            //await tab.waitUntilVisible(selectors, 10000, "and") // on attend que les input soit chargé

            var selector  = ".login-form" // L'id du formlaire à envoyer pour la connexion
            const inputs  = { // On met les bonne valeur des inputs
              "session_key": user.email,
              "session_password": user.pass,
              'loginCsrfParam': "",

            }
            try {
                await tab.waitUntilVisible(selector, 5000)
                var csrf       = "NO";
                var strCookies = "";
                var cookies    = await nick.getAllCookies();
                // On récupère le CSRF pour la request du token dans bcookie
                cookies.map(v =>{
                    if(v.name == "bcookie") {
                        inputs.loginCsrfParam = v.value.split('"')[1].split("&")[1]; // On inject le CSFR dans les inputs pour soumettre le formulaire
                    }
                        strCookies += v.name+"="+v.value.split(";")[0] +"; "; // On crée les cookies pour envoyer avec le formulaire
                });

                // On prépare la request POST pour se connecter
                var tokenOptions = {
                    method: 'POST',
                    url: 'https://www.linkedin.com/uas/login-submit',
                    headers:
                    {
                        'cache-control': 'no-cache',
                        'cookie': strCookies, //cookies
                        'accept-language': 'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4',
                        'accept-encoding': 'gzip, deflate',
                        'referer': 'https://www.linkedin.com/',
                        'accept': '*/*',
                        'content-type': 'application/x-www-form-urlencoded',
                        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36',
                        'x-requested-with': 'XMLHttpRequest',
                        'origin': 'https://www.linkedin.com',
                        'x-isajaxform': '1'
                    },
                    'form': inputs // formualire
                };

                var new_li_at = await new Promise(function(resolve, reject){
                    request(tokenOptions, function (error, response, body) {
                        if (error) throw new Error(error); // on renvoie une exeption en cas d'erreur

                        const cookies = response.headers["set-cookie"]; // On recupère les cookies renvoyer pour récupérer le Token dans le cookies li_at
                        console.log(cookies)
                        var liAt = "";
                        for(var i = 0; i<cookies.length; i++){
                            if(/^li_at/.test(cookies[i])){
                                liAt = cookies[i];
                                break;
                            }
                        }
                        if(liAt == ""){
                            return reject("no token found");
                        }

                        liAt = liAt.split("=")[1].split(";")[0];
                        return resolve(liAt);
                    });
                });
                this.li_at = new_li_at;
                console.log('New Token : ' + this.li_at)
                await tab.setCookie({ // On set nos cookies avec le nouveau token.
                    name: "li_at",
                    value: this.li_at,
                    domain: ".www.linkedin.com"
                })
            } catch (err) {
                throw ("Error get Token: " + err);
            }
        } catch(error) {
            throw (error);
        }
    }

    /***
    *    Fonction qui permet de scroller en bas d'un élément du dom
    *    Params :
    *        element => L'élément du DOM sur lequelle on souhaite scroller
    *        wait    => les nombres de seconde à attendre pour que l'event scroll charge bien tous les
    *                   éléments
    *        tab     => On envoie le tab à manipuler
    ***/
    this.scrollBotom = async (element, wait, tab) => {
        await tab.inject("jquery-3.2.1.min.js") // On inject Jquery pour manipuler notre dom
        await tab.waitUntilVisible(".msg-conversations-container__conversations-list") // On vérifie que l'élément est bien chargé

        // Scroll with Jquery à bottom of list
        var position_el = await tab.evaluate((arg, callback) => {
            $(arg.el).animate({ // On effectue le scroll.
              scrollTop: 1000000
            }, arg.wait);
            callback(null, "");
        },{el: element, wait: wait})

        // Wait for chargement of all messages
        await tab.wait(wait + 2000)
    }

    /***
    *  Fonction pour envoyer les messages
    *  @param uri :
    *    Uri des messages du contact;
    *    message: Le message à envoyer;
    *    tab: le tab courant
    ***/
    var retry = 0;
    this.sendMessage = async (uri, message, tab) => {
        await tab.wait(3000) // On attend quelques seconde pour évité de se faire blacklist
        const url = "https://www.linkedin.com" + uri;

        try {
            const [httpCode, httpStatus] = await tab.open(url)
            if (httpCode !== 200) {
                if(retry < 3) {
                    retry++; // Si la connection echoue on recommence
                    this.sendMessage(tab);
                } else {
                  throw("Not http code 200")
                }
            }
            console.log('OKI d acc with URI => https://www.linkedin.com' + uri)
            await tab.waitUntilVisible(".msg-conversations-container", 10000);
            await tab.inject("jquery-3.2.1.min.js") // We're going to use jQuery to scrape
            await tab.wait(3000) // On attend quelques seconde pour évité de se faire blacklist
            const selector = ".msg-compose-form__form"
            const inputs   = {
              "message": message,
            }

            try {
              await tab.waitUntilVisible(selector, 5000)
              await tab.fill(selector, inputs)
              await tab.click(".msg-compose-form__send-button");
              console.log("Form sent!")
            } catch (err) {
              console.log("Form not found:", err)
            }
        } catch(err) {
            console.log(err);
        }
    }


    this.getNewMessage = async (tab) => {
      await tab.wait(3000) // On attend quelques seconde pour évité de se faire blacklist
      const url = "https://www.linkedin.com/messaging/"

      try {
        const [httpCode, httpStatus] = await tab.open(url)
        if (httpCode !== 200) {
            if(retry < 3) {
                retry++; // Si la connection echoue on recommence
                this.getNewMessage(tab);
            } else {
              throw("Not http code 200")
            }
        }
        // Attente du chargement du dom
        await tab.wait(3000) // On attend quelques seconde pour évité de se faire blacklist
        await tab.waitUntilVisible(".msg-conversations-container", 10000);
        await tab.inject("jquery-3.2.1.min.js") // We're going to use jQuery to scrape
        await this.scrollBotom(".msg-conversations-container__conversations-list", 5000, tab);
        // Recupération de tous les messages
        var messages = await tab.evaluate((arg, callback) => {
            var messages = [];
            $(".msg-conversation-listitem").each(function(index, value){
                var id          = $(value).attr("id");
                var message     = {};
                message.index   = index;
                message.new     = false;
                message.time    = $('#'+id).find('time').text().trim();
                message.name    = $('#'+id).find('h3').text().trim();
                message.link    = $('#'+id).find('.msg-conversation-listitem__link').attr('href');

                if($('#'+id).find(".msg-conversation-card__unread-count").length) {
                    message.new = true;
                }
                messages.push(message);
            })
            callback(null, messages);
        });
        retry = 0;
        await tab.wait(3000) // On attend quelques seconde pour évité de se faire blacklist
        return messages;
      } catch(error) {
        console.log(error);
      }
    }

    this.getLastMessage = async (uri,message, tab) => {

        var randomInt = this.getRandomInt(1,5) * 1000;
        const url = "https://www.linkedin.com" + uri;

        await tab.wait(randomInt) // On attend quelques seconde pour évité de se faire blacklist
        try {
            const [httpCode, httpStatus] = await tab.open(url)
            if (httpCode !== 200) {
                if(retry < 3) {
                    retry++; // Si la connection echoue on recommence
                    this.getLastMessage(tab);
                } else {
                  throw("Not http code 200")
                }
            }
            await tab.wait(this.getRandomInt(1,10) * 1000) // On attend quelques seconde pour évité de se faire blacklist
            await tab.waitUntilVisible('.msg-s-message-listitem__seen-receipts')
            var checkMessage = await tab.evaluate((arg, callback) => {
                arg.message.read = $('li.msg-s-message-list__date-group').last().find(".msg-s-message-listitem__seen-receipts").text().trim();
                arg.message.receive = $("li.msg-s-message-listitem--other").last().text().trim();
                arg.message.send = $("li.msg-s-message-listitem:not(.msg-s-message-listitem--other)").last().text().trim();
                callback(null, arg.message);
            },{message:message});
            console.log(checkMessage);
            return checkMessage;
        } catch(err) {
            console("Check message read : " + err);
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
          await tab.waitUntilVisible('.like-button');
          await tab.click('.like-button');
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


module.exports = LinkedinLib;
