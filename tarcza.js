var CyberTarczaMailer = {
    url: 'https://cert.orange.pl/cybertarcza',

    email: {
        subject: 'Cyber Tarcza',
        from: 'Cyber Tarcza <mojlogin@gmail.com>',
        to: 'mojlogin@gmail.com', // login
        passwd: 'qwerty', // haslo
        host: 'smtp.gmail.com',
        port: 465,
        secure: true
    },
    
    init: function () {
        var request = require('sync-request'),
            result = request('GET', this.url),
            response = result.body.toString();
    
        if(response !== '') {
            var messageFound = this.parse( response );
            
            if(messageFound) {
                this.mail();
            }
        } else {
            console.log('Nie moge pobrac danych!');
        }
    },
    parse: function (data) {
        var cheerio = require('cheerio'),
            $ = cheerio.load(data),
            $selector = $('.orange-box h3'),
            message = "" + ($selector.text()).trim();

        if (message !== '') {
            this.message = message;
            this.message += "\n--\n"+this.url
            
            console.log(this.message);
            
            return true;
        } else {
            console.log('Brak komunikatow')
            
            return false;
        }
    },
    mail: function () {
        if(this.message !== '') {
            var nodemailer = require('nodemailer'),
                mailSettings = {
                    host: this.email.host,
                    port: this.email.port,
                    secure: this.email.secure, // use SSL
                    auth: {
                        user: this.email.to,
                        pass: this.email.passwd
                    }
                },
                mailOptions = {
                    from: this.email.from, // sender address
                    to: this.email.to, // list of receivers
                    subject: this.email.subject, // Subject line
                    text: this.message // plaintext body
                },
                mailer = nodemailer.createTransport(mailSettings);

            mailer.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Wiadomosc wyslana: ' + info.response);
            });
        }
    }
};
CyberTarczaMailer.init();
