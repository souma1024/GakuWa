import { participateRepository } from '../repositories/participateRepository';
import { teamsRepository } from '../repositories/teamsRepository';
import { teamMembersRepository } from '../repositories/teamMembersRepository';
import { ApiError } from '../errors/apiError';

export const participateService = {
  // 参加登録（チーム自動割り当て付き）
  async participate(userId: bigint, eventId: bigint) {
    // 既に参加済みかチェック
    const existing = await participateRepository.findByUserAndEvent(userId, eventId);
    if (existing) {
      throw new ApiError("duplicate_error", "既にこのイベントに参加しています");
    }

    // event_participantsに登録
    await participateRepository.create(userId, eventId);

    // 空きチームを探す
    const existingTeam = await teamsRepository.findTeamWithAvailableSlot(eventId);
    let teamId: bigint;
    let teamName: string;
    let role: 'leader' | 'member';

    if (existingTeam && existingTeam._count.members > 0) {
      // 空きチームがあり、既にメンバーがいる → メンバーとして追加
      teamId = existingTeam.id;
      teamName = existingTeam.name;
      role = 'member';
    } else {
      // 空きチームがない、または0人のチーム → 新しいチームを作成
      if (existingTeam && existingTeam._count.members === 0) {
        // 0人のチームは削除
        await teamsRepository.delete(existingTeam.id);
      }
      const teamCount = await teamsRepository.countByEventId(eventId);
      teamName = `チーム${teamCount + 1}`;
      const newTeam = await teamsRepository.create(eventId, teamName);
      teamId = newTeam.id;
      role = 'leader';  // 最初のメンバーはリーダー
    }

    // チームにメンバーを追加
    await teamMembersRepository.create(teamId, userId, role);

    return {
      teamId: String(teamId),
      teamName,
      role
    };
  },

  // 参加取り消し
  async cancelParticipate(userId: bigint, eventId: bigint) {
    // 参加しているかチェック
    const existing = await participateRepository.findByUserAndEvent(userId, eventId);
    if (!existing) {
      throw new ApiError("validation_error", "このイベントに参加していません");
    }

    // チームメンバーから削除
    const teamMember = await teamMembersRepository.findByUserAndEvent(userId, eventId);
    if (teamMember) {
      const teamId = teamMember.teamId;
      await teamMembersRepository.delete(teamId, userId);

      // 残りのメンバーを確認
      const remainingMembers = await teamMembersRepository.findByTeamId(teamId);
      
      if (remainingMembers.length === 0) {
        // メンバーが0人になったらチームを削除
        await teamsRepository.delete(teamId);
      } else if (teamMember.role === 'leader') {
        // リーダーが抜けた場合、別のメンバーをリーダーに昇格
        await teamMembersRepository.updateRole(
          teamId,
          remainingMembers[0].userId,
          'leader'
        );
      }
    }

    // event_participantsから削除
    await participateRepository.delete(userId, eventId);
  }
};
