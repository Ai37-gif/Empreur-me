module.exports = {
  config: {
    name: "pari",
    version: "1.0",
    author: "Evariste",
    role: 0,
    shortDescription: "Parier de l'argent pour tenter de gagner ×10 !",
    longDescription: "Parier un montant avec 40% de chance de gagner ×10.",
    category: "economy",
    guide: {
      fr: "{pn} [montant] → Tentez de multiplier votre mise par 10 !"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const userID = event.senderID;
    const montantPari = parseInt(args[0]);

    // Vérifie si le montant est valide
    if (isNaN(montantPari) || montantPari <= 0) {
      return message.reply("❌ **Montant invalide !**\nUtilisation : `!pari [montant]`");
    }

    const solde = await usersData.get(userID, "money") || 0;

    // Vérifie si l'utilisateur a assez d'argent
    if (montantPari > solde) {
      return message.reply("❌ **Solde insuffisant !**");
    }

    // Tire au sort (40% de chance de gagner)
    const aGagne = Math.random() < 0.4;

    if (aGagne) {
      const gain = montantPari * 10;
      await usersData.set(userID, solde + gain, "money");
      return message.reply(
        `🎉 **Félicitations !** 🎉\n` +
        `Vous avez gagné **×10** votre mise !\n` +
        `💰 **${gain} $** ont été ajoutés à votre solde.`
      );
    } else {
      await usersData.set(userID, solde - montantPari, "money");
      return message.reply(
        `😢 **Dommage !**\n` +
        `Vous avez perdu votre pari de **${montantPari} $**.\n` +
        `Encore un peu de chance la prochaine fois !`
      );
    }
  }
};
