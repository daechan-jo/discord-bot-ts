import { Command } from "../../Typings";
import { Player } from "discord-player";

export const slash: Command = {
	name: "노지퇴근",
	description: "봇의 음성 채널 연결을 끊습니다",
	voiceChannel: true,
	run: async ({ client, interaction }) => {
		const player = new Player(client);
		const queue = player.nodes.get(interaction.guild!);

		if (!queue || !queue.connection) {
			if (!interaction.replied && !interaction.deferred) {
				return interaction.reply({ content: "으걈ㄴ럄재디알ㅁ나램ㄴㄷ릩퇴에에에에그그그그ㅡ근!!! 아무도 나를 막을 수 없스셈", ephemeral: true });
			} else {
				return interaction.followUp({ content: "으걈ㄴ럄재디알ㅁ나램ㄴㄷ릩퇴에에에에그그그그ㅡ근!!! 아무도 나를 막을 수 없스셈", ephemeral: true });
			}
		}

		if (queue.connection) {
			queue.connection.disconnect();
			queue.delete();
		} else {
			queue.delete();
		}

		if (!interaction.replied && !interaction.deferred) {
			await interaction.reply({ content: "봇의 연결이 끊어졌습니다." });
		} else {
			await interaction.followUp({ content: "봇의 연결이 끊어졌습니다." });
		}
	},
};
