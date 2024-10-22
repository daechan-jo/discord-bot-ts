import { Player } from "discord-player";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../Typings";
import { SoundCloudExtractor } from "@discord-player/extractor";
import { YoutubeiExtractor } from "discord-player-youtubei";

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
		const player = new Player(client);

		// YouTube와 SoundCloud 추출기 등록
		await player.extractors.register(YoutubeiExtractor, {});
		await player.extractors.register(SoundCloudExtractor, {});

		player.on("error", (error) => {
			console.error(`Player error: ${error.message}`);
		});

		const embed = new EmbedBuilder();
		const query = interaction.options.get("노래")?.value as string;

		try {
			const searchResult = await player.search(query, {
				requestedBy: interaction.member,
			});

			if (!searchResult || !searchResult.tracks.length) {
				console.error(`쿼리에 대한 트랙을 찾을 수 없습니다: ${query}`);
				return interaction.editReply({
					content: `Track **${query}** not found!`,
				});
			}

			const track = searchResult.tracks[0];
			let queue = player.nodes.create(interaction.guild!, {
				metadata: {
					channel: interaction.channel,
					requestedBy: interaction.member,
				},
				leaveOnEnd: true,
				leaveOnEmpty: true,
				leaveOnStop: true,
				volume: 60,
			});

			try {
				if (!queue.connection) await queue.connect(interaction.member.voice.channel!);
			} catch (error) {
				console.error(`음성 채널에 연결하지 못했습니다: ${error}`);
				player.nodes.delete(interaction.guildId!);
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
		} catch (error) {
			console.error(`재생 명령을 처리하는 동안 오류가 발생했습니다: ${error}`);
			return interaction.editReply({
				content: `월급이 밀려서 노래를 부를수가 엄습니다.`,
			});
		}
	},
};
