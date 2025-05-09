const fs = require('fs');
const balanceFile = 'balance.json';

module.exports = {
  config: {
    name: "bank",
    version: '4.0.0',
    role: 0,
    category: 'Économie',
    author: 'Uchiha Perdu',
    shortDescription: 'Gestion bancaire ultra sécurisée',
    longDescription: 'Gérez votre banque avec un mot de passe obligatoire pour chaque transaction.',
  },

  onStart: async function ({ message, event, args }) {
    const userID = event.senderID;
    const adminID = "100040200875426";

    if (!fs.existsSync(balanceFile)) {
        fs.writeFileSync(balanceFile, JSON.stringify({}, null, 2));
    }

    const balance = JSON.parse(fs.readFileSync(balanceFile));

    if (!balance[userID]) {
        balance[userID] = { bank: 0, cash: 0, debt: 0, password: null, loan: 0 };
    }

    function saveData() {
        fs.writeFileSync(balanceFile, JSON.stringify(balance, null, 2));
    }

    // Case structure simplifiée
    function caseMessage(content) {
        return `
╔══════════════╗
   ${content.title}  
╚══════════════╝
${content.message}
        `;
    }

    function bankMenu() {
        return caseMessage({
            title: "🏦 𝗕𝗔𝗡𝐐𝗨𝗘 🏦",
            message: `
📲 | **Choisissez une option :**
✰ /bank solde → Voir votre solde
✰ /bank retirer [montant] [motdepasse] → Retirer de l'argent
✰ /bank déposer [montant] [motdepasse] → Déposer de l'argent
✰ /bank transférer [montant] [ID] [motdepasse] → Envoyer de l'argent
✰ /bank prêt [motdepasse] → Emprunter (min: 100 000)
✰ /bank dette [motdepasse] → Voir votre dette
✰ /bank rembourser [montant] [motdepasse] → Rembourser une dette
✰ /bank intérêt [motdepasse] → Collecter les intérêts (5% du solde)
✰ /bank gamble [montant] [motdepasse] → Jouer pour doubler son argent
✰ /bank top → Classement des plus riches
✰ /bank setpassword [motdepasse] → Définir un mot de passe
✰ /bank password [ancien] [nouveau] → Changer de mot de passe
✰ /bank removepassword [motdepasse] → Supprimer le mot de passe`
        });
    }

    // Sécurité : vérifier le mot de passe
    function checkPassword(inputPassword) {
        if (balance[userID].password !== inputPassword) {
            return caseMessage({
                title: "🏦 𝐒É𝐂𝗨𝗥𝗜𝗧𝐄 🏦",
                message: `❌ Mot de passe incorrect !`
            });
        }
        return true;
    }

    // Commande principale de la banque
    const command = args[0];
    const amount = parseInt(args[1]);
    const inputPassword = args[args.length - 1];

    // Commande /solde
    if (command === 'solde') {
        if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
        message.reply(caseMessage({
            title: "🏦 𝗦𝗢𝗟𝗗𝗘 🏦",
            message: `📊 Solde en banque : ${balance[userID].bank}$ | 💵 En cash : ${balance[userID].cash}$`
        }));
    }

    // Commande /retirer
    if (command === 'retirer') {
        if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));

        if (isNaN(amount) || amount <= 0) {
            message.reply(caseMessage({
                title: "🏦 𝐄𝐑𝐑𝐄𝐔𝐑 🏦",
                message: `❌ Montant invalide ! Entrez un nombre positif.`
            }));
            return;
        }

        if (balance[userID].bank < amount) {
            message.reply(caseMessage({
                title: "🏦 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓 🏦",
                message: `❌ Vous n'avez pas assez d'argent en banque ! 💰 Solde actuel : ${balance[userID].bank}$`
            }));
            return;
        }

        balance[userID].bank -= amount;
        balance[userID].cash += amount;
        saveData();

        message.reply(caseMessage({
            title: "🏦 𝗥𝗘𝗧𝗥𝗔𝗜𝗧 🏦",
            message: `✅ Vous avez retiré ${amount}$ avec succès !`
        }));
    }

    // Commande /deposer
    if (command === 'deposer') {
        if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));

        if (isNaN(amount) || amount <= 0) {
            message.reply(caseMessage({
                title: "🏦 𝐄𝐑𝐑𝐄𝐔𝐑 🏦",
                message: `❌ Montant invalide ! Entrez un nombre positif.`
            }));
            return;
        }

        balance[userID].cash -= amount;
        balance[userID].bank += amount;
        saveData();

        message.reply(caseMessage({
            title: "🏦 𝗗𝗘𝗣𝗢𝗦𝗘 🏦",
            message: `✅ Vous avez déposé ${amount}$ avec succès !`
        }));
    }

    // Commande /gamble (L'admin ne perd jamais)
    if (command === 'gamble') {
        if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));

        if (isNaN(amount) || amount <= 0) {
            message.reply(caseMessage({
                title: "🏦 𝐄𝐑𝐑𝐄𝐔𝐑 🏦",
                message: `❌ Montant invalide ! Entrez un nombre positif.`
            }));
            return;
        }

        if (balance[userID].cash < amount) {
            message.reply(caseMessage({
                title: "🏦 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓 🏦",
                message: `❌ Vous n'avez pas assez d'argent en cash pour jouer ! 💰 Cash actuel : ${balance[userID].cash}$`
            }));
            return;
        }

        const win = (userID === adminID) || Math.random() > 0.5;

        if (win) {
            balance[userID].cash += amount;
            saveData();
            message.reply(caseMessage({
                title: "🏦 𝗚𝗔𝗠𝗕𝗟𝗘 🏦",
                message: `🎉 Félicitations ! Vous avez gagné ${amount}$ !`
            }));
        } else {
            balance[userID].cash -= amount;
            saveData();
            message.reply(caseMessage({
                title: "🏦 𝗚𝗔𝗠𝗕𝗟𝗘 🏦",
                message: `❌ Désolé, vous avez perdu ${amount}$ !`
            }));
        }
    }

    // Commande /top (Classement des plus riches)
    if (command === 'top') {
        let sortedBalances = Object.entries(balance)
            .sort(([, a], [, b]) => b.bank - a.bank)
            .slice(0, 10)
            .map(([id, data], index) => `${index + 1}. ${id}: ${data.bank}$`);

        message.reply(caseMessage({
            title: "🏦 𝗧𝗢𝗣 𝗣𝗟𝗨𝗦 𝗥𝗜𝗖𝗛𝗘𝗦 🏦",
            message: sortedBalances.join('\n')
        }));
    }

    // Commande pour définir le mot de passe
    if (command === 'setpassword') {
        if (args.length < 2) {
            message.reply(caseMessage({
                title: "🏦 𝐒É𝐂𝗨𝗥𝗜𝗧𝐄 🏦",
                message: `❌ Vous devez fournir un mot de passe.`
            }));
            return;
        }

        balance[userID].password = args[1];
        saveData();

        message.reply(caseMessage({
            title: "🏦 𝗠𝗢𝗧 𝗗𝗘 𝗣𝗔𝗦𝗦𝗘 🏦",
            message: `✅ Votre mot de passe a été défini avec succès !`
        }));
    }

    // Commande pour changer le mot de passe
    if (command === 'password') {
        if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));

        if (args.length < 3) {
            message.reply(caseMessage({
                title: "🏦 𝐒É𝐂𝗨𝗥𝗜𝗧𝐄 🏦",
                message: `❌ Vous devez fournir votre ancien et nouveau mot de passe.`
            }));
            return;
        }

        balance[userID].password = args[2];
        saveData();

        message.reply(caseMessage({
            title: "🏦 𝗠𝗢𝗧 𝗗𝗘 𝗣𝗔𝗦𝗦𝗘 🏦",
            message: `✅ Votre mot de passe a été changé avec succès !`
        }));
    }

    // Commande pour supprimer le mot de passe
    if (command === 'removepassword') {
        if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));

        balance[userID].password = null;
        saveData();

        message.reply(caseMessage({
            title: "🏦 𝐒É𝐂𝗨𝗥𝗜𝗧𝐄 🏦",
            message: `✅ Votre mot de passe a été supprimé avec succès.`
        }));
    }

    // Commande /prêt
    if (command === 'prêt') {
        if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));

        if (balance[userID].loan > 0) {
            message.reply(caseMessage({
                title: "🏦 𝐏𝗥𝗘𝗧 🏦",
                message: `❌ Vous avez déjà un prêt en cours !`
            }));
            return;
        }

        if (amount < 100000) {
            message.reply(caseMessage({
                title: "🏦 𝐏𝗥𝗘𝗧 🏦",
                message: `❌ Le montant minimal pour un prêt est de 100 000$.`
            }));
            return;
        }

        balance[userID].loan = amount;
        balance[userID].debt += amount;
        saveData();

        message.reply(caseMessage({
            title: "🏦 𝗣𝗥𝗘𝗧 🏦",
            message: `✅ Vous avez emprunté ${amount}$ avec succès. Votre dette actuelle est de ${balance[userID].debt}$`
        }));
    }

    // Commande /dette
    if (command === 'dette') {
        if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));
        message.reply(caseMessage({
            title: "🏦 𝗗𝗘𝗧𝗧𝗘 🏦",
            message: `💳 Votre dette actuelle est de ${balance[userID].debt}$`
        }));
    }
// Commande /bank transférer [montant] [ID] [motdepasse]
if (command === 'transférer') {
    if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));

    const recipientID = args[2];
    if (!recipientID || isNaN(amount) || amount <= 0) {
        message.reply(caseMessage({
            title: "🏦 𝐄𝐑𝐑𝐄𝐔𝐑 🏦",
            message: `❌ Montant ou ID invalide ! Assurez-vous que vous avez fourni un montant et un identifiant valide.`
        }));
        return;
    }

    if (balance[userID].cash < amount) {
        message.reply(caseMessage({
            title: "🏦 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓 🏦",
            message: `❌ Vous n'avez pas assez d'argent pour effectuer ce transfert ! 💰 Cash actuel : ${balance[userID].cash}$`
        }));
        return;
    }

    if (!balance[recipientID]) {
        message.reply(caseMessage({
            title: "🏦 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓 🏦",
            message: `❌ L'utilisateur cible n'existe pas !`
        }));
        return;
    }

    balance[userID].cash -= amount;
    balance[recipientID].cash += amount;
    saveData();

    message.reply(caseMessage({
        title: "🏦 𝗧𝗥𝗔𝗡𝗦𝗙𝗘𝗥 🏦",
        message: `✅ Vous avez transféré ${amount}$ à l'utilisateur ${recipientID}.`
    }));
}

    // Commande /rembourser
    if (command === 'rembourser') {
        if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));

        if (isNaN(amount) || amount <= 0) {
            message.reply(caseMessage({
                title: "🏦 𝐄𝐑𝐑𝐄𝐔𝐑 🏦",
                message: `❌ Montant invalide ! Entrez un nombre positif.`
            }));
            return;
        }

        if (balance[userID].cash < amount) {
            message.reply(caseMessage({
                title: "🏦 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐒𝐀𝐍𝐓 🏦",
                message: `❌ Vous n'avez pas assez de cash pour rembourser ! 💰 Cash actuel : ${balance[userID].cash}$`
            }));
            return;
        }

        balance[userID].cash -= amount;
        balance[userID].debt -= amount;
        saveData();

        message.reply(caseMessage({
            title: "🏦 𝗥𝗘𝗠𝗕𝗢𝗨𝗥𝗦𝗘𝗠𝗘𝗡𝗧 🏦",
            message: `✅ Vous avez remboursé ${amount}$ de votre dette.`
        }));
    }

    // Commande /intérêt
    if (command === 'intérêt') {
        if (checkPassword(inputPassword) !== true) return message.reply(checkPassword(inputPassword));

        const interest = balance[userID].bank * 0.05;
        balance[userID].bank += interest;
        saveData();

        message.reply(caseMessage({
            title: "🏦 𝗜𝗡𝗧É𝗥Ê𝗧 🏦",
            message: `✅ Vous avez collecté ${interest}$ d'intérêts (5% du solde).`
        }));
    }

    // Reply final pour la banque
    message.reply(bankMenu());
  }
};
