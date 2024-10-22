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
			const messageContent = "으걈ㄴ럄재디알ㅁ나램ㄴㄷ릩퇴에에에에그그그그ㅡ근!!! 아무도 나를 막을 수 없스셈";
			const message = !interaction.replied && !interaction.deferred
				? await interaction.reply({ content: messageContent, fetchReply: true })
				: await interaction.followUp({ content: messageContent, fetchReply: true });

			setTimeout(async () => {
				try {
					await message.delete();
				} catch (error) {
					console.error("메시지를 삭제하는 동안 오류가 발생했습니다:", error);
				}
			}, 5000);
			return;
		}

		if (queue.connection) {
			queue.connection.disconnect();
			queue.delete();
		} else {
			queue.delete();
		}

		const messageContent = "으걈ㄴ럄재디알ㅁ나램ㄴㄷ릩퇴에에에에그그그그ㅡ근!!! 아무도 나를 막을 수 없스셈";
		const message = !interaction.replied && !interaction.deferred
			? await interaction.reply({ content: messageContent, fetchReply: true })
			: await interaction.followUp({ content: messageContent, fetchReply: true });

		setTimeout(async () => {
			try {
				await message.delete();
			} catch (error) {
				console.error("메시지를 삭제하는 동안 오류가 발생했습니다:", error);
			}
		}, 5000);
	},
};
