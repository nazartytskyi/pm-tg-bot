const axios = require('axios');

let lastUpdate = 0;

const getGameResultsOptimized = (gameID, chatId, lastGameID = null) => {
    axios.get('https://parimatch.betgamestv.ru/web/v2/games/results/parimatch/en/3/0/8/')
        .then(response => {
            const game = new BetGameResults(response.data.items.results[0]);
            console.log('Received game');
            
            if (lastGameID !== game.getID()) {
                lastGameID = game.getID();
                bot.sendMessage(chatId, game.pretyPrint()); 
                
                console.log('new result')
                
             
                if (lastUpdate) {
                    console.log('timeouted')
                    setTimeout(() => {
                        getGameResults(8, chatId, game.getID());
                    }, 50 * 1000);

                    firstCall = false
                    
                } else {
                    console.log('first call')
                    getGameResults(8, chatId, game.getID());
                }

                lastUpdate = new Date();
            } else {
                getGameResults(8, chatId, game.getID());

            } 
            
        })
        .catch(error => {
            console.log(error)
        });
}


const getGameResults = (gameID, chatId, lastGameID = null) => {
    axios.get('https://parimatch.betgamestv.ru/web/v2/games/results/parimatch/en/3/0/8/')
        .then(response => {
            const game = new BetGameResults(response.data.items.results[0]);
            
            if (lastGameID !== game.getID()) {
                lastGameID = game.getID();
                bot.sendMessage(chatId, game.pretyPrint());                   

                lastUpdate = new Date();    
            } 
            
            getGameResults(8, chatId, game.getID());
        })
        .catch(error => {
            console.log(error)
        });
}


var TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot("1198429986:AAHp5pCkYDAIHX-njYEdp6tjfBTigLK9WU0", { polling: true });

bot.on("text", message => {
    getGameResults(8, message.chat.id);
});


class BetGameResults { //array item
    constructor(gameResponse) {
        this.gameID = gameResponse.id;
        this.winner = gameResponse.results.winner;
        this.playerCard = { 
            suit: gameResponse.results.card_player.suit,
            value: gameResponse.results.card_player.value
        };
        this.dealerCard = { 
            suit: gameResponse.results.card_dealer.suit,
            value: gameResponse.results.card_dealer.value
        };
    }

    getID() {
        return this.gameID
    }

    pretyPrint() {
        return (
            `Winner: ${LOCALIZATION['RU'][this.winner]}`
        );
    }
}



const LOCALIZATION = {
    'RU': {
        'war': 'Ничья',
        'player': 'Игрок',
        'dealer': 'Дилер',
    }
}