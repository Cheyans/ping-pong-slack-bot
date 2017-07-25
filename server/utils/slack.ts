export function formatUserMention(userId: string, userName: string) {
  return `<@${userId}|${userName}>`;
}

export function parseUserMention(text: string): SlackUser {
  const result = text.split(/<@(U\w+)\|/);

  return {
    userId: result[1],
    userName: result[2]
  };
}

export interface SlackUser {
  userId: string;
  userName: string;
}

export interface SlackUserScore {
  userName: string;
  score: number;
}
