import { Command } from "../../Typings";
import { Player } from "discord-player";

export const slash: Command = {
	name: "노지스킵",
	description: "현재 재생 중인 노래를 건너뛰고 다음 곡으로 넘어갑니다",
	voiceChannel: true,
	run: async ({ client, interaction }) => {
		const player = new Player(client);
		const queue = player.nodes.get(interaction.guild!);

		if (!queue || !queue.node.isPlaying()) {
			const messageContent = "현재 재생 중인 노래가 업읍니다.";
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

		try {
			const success = queue.node.skip();
			const replyContent = success ? "다음 곡으로 넘어가겟읍니다." : "대기열에 다음 곡이 업읍니다.";
			const message = !interaction.replied && !interaction.deferred
				? await interaction.reply({ content: replyContent, fetchReply: true })
				: await interaction.followUp({ content: replyContent, fetchReply: true });

			setTimeout(async () => {
				try {
					await message.delete();
				} catch (error) {
					console.error("메시지를 삭제하는 동안 오류가 발생했습니다:", error);
				}
			}, 5000);

		} catch (error) {
			console.error(`스킵 중 오류 발생: ${error}`);
			const errorMessage = "잦은 야근으로 고장이 나브럿읍니다.";
			const message = !interaction.replied && !interaction.deferred
				? await interaction.reply({ content: errorMessage, fetchReply: true })
				: await interaction.followUp({ content: errorMessage, fetchReply: true });

			setTimeout(async () => {
				try {
					await message.delete();
				} catch (error) {
					console.error("메시지를 삭제하는 동안 오류가 발생했습니다:", error);
				}
			}, 5000);
		}
	},
};
