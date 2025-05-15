const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "ghibli",
    version: "1.0.0",
    author: "Ciel Bleu",
    role: 0,
    countDown: 10,
    shortDescription: {
      en: "Transform an image into Ghibli-style"
    },
    longDescription: {
      en: "Reply 'Ghibli' to a photo and the bot will transform it into Studio Ghibli style"
    },
    category: "image",
    guide: {
      en: "Reply to an image with 'Ghibli'"
    }
  },

  onStart: async function () {},

  onReply: async function ({ api, event }) {
    if (event.body?.toLowerCase() !== "ghibli") return;

    const attachments = event.messageReply?.attachments;
    if (!attachments || attachments.length === 0 || attachments[0].type !== "photo") {
      return api.sendMessage("Veuillez répondre à une image avec le mot 'Ghibli'.", event.threadID, event.messageID);
    }

    const imageURL = attachments[0].url;
    const imgPath = path.join(__dirname, "cache", `original.jpg`);
    const outputPath = path.join(__dirname, "cache", `ghibli_output.jpg`);

    try {
      // Téléchargement de l'image
      const response = await axios.get(imageURL, { responseType: "arraybuffer" });
      await fs.outputFile(imgPath, response.data);

      // Convertir l’image en base64
      const imageBase64 = fs.readFileSync(imgPath, { encoding: "base64" });

      // Appel à l'API Hugging Face
      const replicateRes = await axios.post(
        "https://api-inference.huggingface.co/models/Yntec/GhibliDiffusion",
        {
          inputs: {
            image: `data:image/jpeg;base64,${imageBase64}`,
            style: "ghibli"
          }
        },
        {
          headers: {
            Authorization: `Bearer TON_API_KEY_HUGGINGFACE`,
            "Content-Type": "application/json"
          }
        }
      );

      // Attente du résultat
      const getResult = async (predictionURL) => {
        let result;
        while (true) {
          const statusRes = await axios.get(predictionURL, {
            headers: { Authorization: `Bearer TON_API_KEY_HUGGINGFACE` }
          });
          result = statusRes.data;
          if (result.status === "succeeded" || result.status === "failed") break;
          await new Promise(r => setTimeout(r, 2000));
        }
        return result;
      };

      const prediction = await getResult(replicateRes.data.urls.get);

      if (prediction.status !== "succeeded") {
        return api.sendMessage("Échec de la génération d'image. Réessaye plus tard.", event.threadID, event.messageID);
      }

      // Téléchargement de l’image générée
      const outputImg = await axios.get(prediction.output[0], { responseType: "arraybuffer" });
      await fs.outputFile(outputPath, outputImg.data);

      await api.sendMessage({
        body: "Voici ton image en style Ghibli :",
        attachment: fs.createReadStream(outputPath)
      }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, "cache"));

    } catch (err) {
      console.error("Erreur Hugging Face :", err.message);
      return api.sendMessage("Une erreur est survenue avec Hugging Face. Vérifie ta clé API ou réessaye plus tard.", event.threadID, event.messageID);
    }
  }
};
