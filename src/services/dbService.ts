import Dexie, { type Table } from 'dexie';
import type { Transcript } from '../types';

class TranscriptDB extends Dexie {
  transcripts!: Table<Transcript>;

  constructor() {
    super('VoiceToTextDB');
    this.version(1).stores({
      transcripts: '++id, timestamp',
    });
  }
}

export const db = new TranscriptDB();

export const dbService = {
  async addTranscript(transcript: Omit<Transcript, 'id'>): Promise<string> {
    const id = await db.transcripts.add({
      ...transcript,
      id: crypto.randomUUID(),
    } as Transcript);
    return id as string;
  },

  async getTranscripts(limit: number = 50, offset: number = 0): Promise<Transcript[]> {
    return db.transcripts
      .orderBy('timestamp')
      .reverse()
      .offset(offset)
      .limit(limit)
      .toArray();
  },

  async searchTranscripts(query: string): Promise<Transcript[]> {
    return db.transcripts
      .where('text')
      .startsWithIgnoreCase(query)
      .toArray();
  },

  async getTranscript(id: string): Promise<Transcript | undefined> {
    return db.transcripts.get(id);
  },

  async updateTranscript(id: string, updates: Partial<Transcript>): Promise<void> {
    await db.transcripts.update(id, updates);
  },

  async deleteTranscript(id: string): Promise<void> {
    await db.transcripts.delete(id);
  },

  async deleteMultiple(ids: string[]): Promise<void> {
    await db.transcripts.bulkDelete(ids);
  },

  async clearAll(): Promise<void> {
    await db.transcripts.clear();
  },

  async getCount(): Promise<number> {
    return db.transcripts.count();
  },

  async getAllTranscripts(): Promise<Transcript[]> {
    return db.transcripts.orderBy('timestamp').reverse().toArray();
  },
};
