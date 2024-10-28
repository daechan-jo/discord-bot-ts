import { Player } from "discord-player";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../Typings";
import { SoundCloudExtractor } from "@discord-player/extractor";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { Track } from "discord-player";

let player: Player | null = null;

export const initPlayer = (client: any) => {
	if (!player) {
		player = new Player(client);

		// YouTube와 SoundCloud 추출기 등록
		player.extractors.register(YoutubeiExtractor, {});
		player.extractors.register(SoundCloudExtractor, {});

		player.on("error", (error) => {
			console.error(`Player error: ${error.message}`);
		});
	}
};

export const slash: Command = {
	name: "노지재생",
	description: "노래재생",
	voiceChannel: true,
	options: [
		{
			name: "노래",
			description: "재생하고 싶은 노래",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	run: async ({ client, interaction }) => {
		initPlayer(client);

		const embed = new EmbedBuilder();
		const query = interaction.options.get("노래")?.value as string;

		try {
			const searchResult = await player!.search(query, {
				requestedBy: interaction.member,
			});

			if (!searchResult || !searchResult.tracks.length) {
				console.error(`쿼리에 대한 트랙을 찾을 수 없습니다: ${query}`);
				return interaction.editReply({
					content: `Track **${query}** not found!`,
				});
			}

			const track = searchResult.tracks[0];
			let queue = player!.nodes.get(interaction.guildId!);

			if (!queue) {
				queue = player!.nodes.create(interaction.guild!, {
					metadata: {
						channel: interaction.channel,
						requestedBy: interaction.member,
					},
					leaveOnEnd: true,
					leaveOnEmpty: true,
					leaveOnStop: true,
					volume: 60,
				});
			}

			try {
				if (!queue.connection) await queue.connect(interaction.member.voice.channel!);

				const voiceChannel = interaction.member.voice.channel;
				if (voiceChannel && voiceChannel.isVoiceBased()) {
					await voiceChannel.setBitrate(32000);
				}
			} catch (error) {
				console.error(`음성 채널에 연결하지 못했습니다: ${error}`);
				player!.nodes.delete(interaction.guildId!);
				return interaction.editReply({
					content: `음성채널에 입장해주세요.`,
				});
			}

			queue.addTrack(track);

			embed
				.setDescription(
					`Search: ${query}\n` +
					`Requested by: ${interaction.member}\n` +
					`Playing: ${track.title}`
				)
				.setColor("DarkVividPink")
				.setImage(track.thumbnail)
				.setTitle(track.title)
				.setURL(track.url);

			await interaction.followUp({ embeds: [embed] });

			if (!queue.node.isPlaying()) await queue.node.play();

			setTimeout(async () => {
				try {
					await interaction.deleteReply();
				} catch (error) {
					console.error("메시지를 삭제하는 동안 오류가 발생했습니다:", error);
				}
			}, 5000);

			setInterval(async () => {
				if (queue.connection) {
					const ping = queue.connection.ping.ws; // ws 핑 값을 확인

					if (ping && ping > 250) { // ws 핑 값이 250ms 이상일 경우
						console.warn(`핑이 높습니다: ${ping}ms. 연결을 재설정합니다.`);

						// 현재 대기열의 트랙을 배열로 변환하여 임시로 저장
						const currentTracks = queue.tracks.toArray() as Track[]; // 배열로 변환
						const currentTrack = queue.currentTrack as Track | null;

						// 현재 연결을 끊고 다시 연결 시도
						queue.connection.disconnect();
						try {
							await queue.connect(interaction.member.voice.channel!);
							console.log("재연결에 성공했습니다.");

							// 대기열 복원
							if (currentTrack) queue.addTrack(currentTrack); // 현재 재생 중인 트랙 추가
							for (const track of currentTracks) {
								queue.addTrack(track); // 남은 대기열 트랙들을 개별적으로 추가
							}

							// 재생 시작
							if (!queue.node.isPlaying()) await queue.node.play();
						} catch (error) {
							console.error("재연결에 실패했습니다:", error);
						}
					}
				}
			}, 60000); // 60초마다 핑 체크


		} catch (error) {
			console.error(`재생 명령을 처리하는 동안 오류가 발생했습니다: ${error}`);
			return interaction.editReply({
				content: `월급이 밀려서 노래를 부를수가 엄습니다.`,
			});
		}
	},
};
