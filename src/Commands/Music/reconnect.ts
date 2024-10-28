import { CommandInteraction, GuildMember } from "discord.js";
import { Command } from "../../Typings";
import { Track, Player } from "discord-player";

export const slash: Command = {
	name: "노지재연결",
	description: "음성 연결을 재설정합니다.",
	voiceChannel: true,
	run: async ({ client, interaction }: { client: any; interaction: CommandInteraction }) => {
		if (!client.player) {
			client.player = new Player(client);
		}

		const player = client.player;
		let queue = player.nodes.get(interaction.guildId!);

		if (!queue || !queue.connection) {
			return interaction.reply({
				content: "현재 활성화된 음성 연결이 없습니다.",
				ephemeral: true,
			});
		}

		try {
			const currentTracks = queue.tracks.toArray() as Track[];
			const currentTrack = queue.currentTrack as Track | null;

			// 대기열 비우기 및 연결 해제
			queue.clear();
			queue.connection.disconnect();

			// 새로운 대기열 생성
			queue = player.nodes.create(interaction.guild!, {
				metadata: {
					channel: interaction.channel,
					requestedBy: interaction.member,
				},
				leaveOnEnd: true,
				leaveOnEmpty: true,
				leaveOnStop: true,
				volume: 60,
			});

			const member = interaction.member as GuildMember;

			try {
				await queue.connect(member.voice.channel!);
				console.log("재연결에 성공했습니다.");

				// 대기열 복원
				if (currentTrack) queue.addTrack(currentTrack);
				for (const track of currentTracks) {
					queue.addTrack(track);
				}

				// 재생 시작
				if (!queue.node.isPlaying()) await queue.node.play();

				if (!interaction.replied && !interaction.deferred) {
					await interaction.reply("재연결이 완료되었습니다.");
				}
			} catch (error) {
				console.error("재연결 시도 중 오류 발생:", error);

				// 다시 확인하여 중복 응답 방지
				if (!interaction.replied && !interaction.deferred) {
					await interaction.reply({
						content: "재연결에 실패했습니다. 다시 시도해주세요.",
						ephemeral: true,
					});
				}
			}
		} catch (error) {
			console.error("재연결에 실패했습니다:", error);

			// 응답 여부 확인 후 오류 메시지 전송
			if (!interaction.replied && !interaction.deferred) {
				await interaction.reply("재연결에 실패했습니다. 다시 시도해주세요.");
			}
		}
	},
};
