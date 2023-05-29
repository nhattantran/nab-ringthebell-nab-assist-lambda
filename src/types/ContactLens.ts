export type ContactLensResponse = {
    Version: string,
    Channel: string,
    AccountId: string,
    InstanceId: string,
    ContactId: string,
    LanguageCode: string,
    EventType: string,
    Segments?: Segment[],
}

export type Segment = { Transcript?: Transcript; Utterance?: Utterance };

export type Utterance = {
    ParticipantId: string,
    ParticipantRole: string,
    BeginOffsetMillis: number,
    EndOffsetMillis: number,
    Id: string,
    TranscriptId: string,
    PartialContent: string,
};

export type Transcript = Omit<Utterance, "TranscriptId" | "PartialContent" > & {
    Sentiment: string,
    Content: string,
    IssuesDetected: unknown[],
}
