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
			if (!interaction.replied && !interaction.deferred) {
				return interaction.reply({ content: "현재 재생 중인 트랙이나 대기열이 업읍니다.", ephemeral: true });
			} else {
				return interaction.followUp({ content: "현재 재생 중인 트랙이나 대기열이 업읍니다.", ephemeral: true });
			}
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

		if (!interaction.replied && !interaction.deferred) {
			await interaction.reply({ embeds: [embed] });
		} else {
			await interaction.followUp({ embeds: [embed] });
		}
	},
};
