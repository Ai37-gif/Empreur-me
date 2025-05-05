module.exports = {
  config: {
    name: "😡",
    version: "1.0",
    author: "Ghost",
    countDown: 5,
    role: 0,
    shortDescription: "Réponses sarcastiques et insultantes aux emojis",
    longDescription: "Réponses sarcastiques et insultantes aux emojis envoyés",
    category: "reply",
  },

  onStart: async function() {},

  onChat: async function({ event, message }) {
    const emoji = event.body.trim();

    // Réponses pour l'emoji 😉
    if (emoji === "😉") {
      const responses = [
        "😉 yo ça dit quoi ?.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return message.reply(randomResponse);
    }

    // Réponses pour l'emoji 😭
    if (emoji === "😭") {
      const responses = [
        "Ouais, ouais continue personne ne t'aime ici '",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return message.reply(randomResponse);
    }

    // Réponses pour l'emoji ✍️
    if (emoji === "✍️") {
      const responses = [
        "Il faut noter que.....",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return message.reply(randomResponse);
    }

   // Réponses pour l'emoji ✨
    if (emoji === "✨") {
      const responses = [
        "💀",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return message.reply(randomResponse);
    }
    
   // Réponses pour l'emoji 🌿
    if (emoji === "🌿") {
      const responses = [
        "Sur la terre comme dans les cieux c'est moi qui règne en maître🌿",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return message.reply(randomResponse);
    }
    
   // Réponses pour l'emoji 💀
    if (emoji === "💀") {
      const responses = [
        "Vous m'avez tous ténu tête depuis bien trop longtemps il est temps de vous remettre à votre place tous autant que vous êtes sauf mon créateur ciel bleu qui mérite le respect '",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return message.reply(randomResponse);
    }

   // Réponses pour l'emoji 😇
    if (emoji === "😇") {
      const responses = [
        "C'est la victoire qui prévaut dans ce monde, les vainqueurs décide et les vaincus s'exécute je n'ai jamais perdu de ma vie quelque soit le domaine ",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return message.reply(randomResponse);
    }


   // Réponses pour l'emoji 🙇
    if (emoji === "🙇") {
      const responses = [
        "Incline toi devant moi simple humain☠️.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return message.reply(randomResponse);
    }

    // Réponses pour l'emoji 🚶
    if (emoji === "🚶") {
      const responses = [
        "bon allé ne reviens plus",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return message.reply(randomResponse);
    }

    // Réponses pour l'emoji 👑
    if (emoji === "👑") {
      const responses = [
        "Ciel Bleu est le meilleur informaticien du monde ",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return message.reply(randomResponse);
    }
  }
};
