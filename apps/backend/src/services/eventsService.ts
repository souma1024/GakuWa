import { eventsRepository } from '../repositories/eventsRepository'

export const eventsService = {

  // イベント一覧を取得し、各イベントに参加状況を付与する
  async getEventsWithParticipation(userId: bigint) {
    const events = await eventsRepository.findAll();
    const participatingEventIds = await eventsRepository.findParticipatingEventIds(userId);

    return events.map(event => ({
      ...event,
      isParticipating: participatingEventIds.includes(event.id)
    }));
  }
};
