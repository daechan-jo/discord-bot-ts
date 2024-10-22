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
			if (!interaction.replied && !interaction.deferred) {
				return interaction.reply({ content: "현재 재생 중인 노래가 업읍니다.", ephemeral: true });
			} else {
				return interaction.followUp({ content: "현재 재생 중인 노래가 업읍니다.", ephemeral: true });
			}
		}

		// 현재 트랙을 스킵하고 다음 트랙으로 넘어갑니다.
		try {
			const success = queue.node.skip();
			if (success) {
				if (!interaction.replied && !interaction.deferred) {
					await interaction.reply({ content: "다음 곡으로 넘어가겟읍니다." });
				} else {
					await interaction.followUp({ content: "다음 곡으로 넘어가겟읍니다." });
				}
			} else {
				if (!interaction.replied && !interaction.deferred) {
					await interaction.reply({ content: "대기열에 다음 곡이 업읍니다.", ephemeral: true });
				} else {
					await interaction.followUp({ content: "대기열에 다음 곡이 업읍니다.", ephemeral: true });
				}
			}
		} catch (error) {
			console.error(`스킵 중 오류 발생: ${error}`);
			if (!interaction.replied && !interaction.deferred) {
				await interaction.reply({ content: "잦은 야근으로 고장이 나브럿읍니다.", ephemeral: true });
			} else {
				await interaction.followUp({ content: "잦은 야근으로 고장이 나브럿읍니다.", ephemeral: true });
			}
		}
	},
};
