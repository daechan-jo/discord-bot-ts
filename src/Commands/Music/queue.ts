import { Command } from "../../Typings";
import { EmbedBuilder } from "discord.js";
import { Player } from "discord-player";

export const slash: Command = {
	name: "노지대기열",
	description: "현재 대기열을 보여줍니다",
	voiceChannel: false,
	run: async ({ client, interaction }) => {
		const player = new Player(client);

		const queue = player.nodes.get(interaction.guild!);

		if (!queue || !queue.tracks.size) {
			const messageContent = "현재 재생 중인 트랙이나 대기열이 업읍니다.";
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

		const embed = new EmbedBuilder()
			.setTitle("현재 대기열")
			.setDescription(
				queue.tracks
					.map((track, index) => `${index + 1}. **${track.title}** - ${track.author}`)
					.join("\n")
			)
			.setColor("DarkVividPink")
			.setFooter({ text: `총 ${queue.tracks.size}개의 트랙` });

		 !interaction.replied && !interaction.deferred
			? await interaction.reply({ embeds: [embed], fetchReply: true })
			: await interaction.followUp({ embeds: [embed], fetchReply: true });
	},
};
