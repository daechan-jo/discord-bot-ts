import { Command } from "../../Typings";
import { EmbedBuilder } from "discord.js";

export const slash: Command = {
	name: "노지도움",
	description: "🗒️ 도움말을 보여줍니다.",
	run: async ({ interaction }) => {
		const embed = new EmbedBuilder()
			.setTitle("노지봇 도움말")
			.setDescription("아래는 노지봇에서 사용할 수 있는 명령어 목록입니다:")
			.addFields(
				{ name: "🎵 /노지재생 <키워드 또는 주소>", value: "노래를 재생하거나 대기열에 추가합니다.", inline: false },
				{ name: "📜 /노지대기열", value: "현재 대기열을 보여줍니다.", inline: false },
				{ name: "⏭️ /노지스킵", value: "현재 재생 중인 노래를 건너뜁니다.", inline: false },
				{ name: "🚪 /노지퇴근", value: "봇의 음성 채널 연결을 해제합니다.", inline: false }
			)
			.setColor("DarkVividPink")
			.setFooter({ text: "노지봇과 함께 즐거운 음악 감상하세요! 🎶" })
			.setTimestamp();

		await interaction.followUp({ embeds: [embed] });
	},
};
