import { Event } from "../Typings";
import { VoiceState } from "discord.js";
import { Player } from "discord-player";

export const event: Event = {
	name: "voiceStateUpdate",
	run: async (client, oldState: VoiceState, newState: VoiceState) => {
		const player = new Player(client);

		if (newState.member?.user.bot) return;

		const queue = player.nodes.get(newState.guild.id);

		if (!queue || !queue.connection) return;

		const channelId = queue.connection.joinConfig.channelId;
		if (!channelId) return;

		const voiceChannel = newState.guild.channels.cache.get(channelId);

		if (voiceChannel?.isVoiceBased() && voiceChannel.members.size === 1) {
			queue.connection.disconnect();
			queue.delete();
			console.log("음성 채널에 봇만 남아 있어 연결을 끊었습니다.");
		}
	},
};
