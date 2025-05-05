module.exports = {
	config: {
		name: "out",
		version: "1.0",
		author: "XyryllPanget",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "",
			fr: "vos désirs sont des ordre🙇"
		},
		longDescription: {
			vi: "",
			fr: "au revoir👋🏼 "
		},
		category: "owner",
		guide: {
			vi: "",
			en: "just write غادر"
		}
 },
	onStart: async function ({ api, args, message, event }) {

			if (!args[0]) return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
				if (!isNaN(args[0])) return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
	}
}
