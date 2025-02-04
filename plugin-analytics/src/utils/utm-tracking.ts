interface UTM {
  campaign: string;
  source: string;
  medium: string;
  term: string;
  content: string;
}

export class UTMTracking {
  static keyToUTM(key: string): UTM | null {
    try {
      const [campaign, source, medium, term, content] = key.split("-");
      return { campaign, source, medium, term, content } as UTM;
    } catch (error) {
      return null;
    }
  }

  static utmToKey(utm?: UTM) {
    if (!utm || Object.values(utm).every((value) => !value)) {
      return null;
    }

    return `${utm.campaign}-${utm.source}-${utm.medium}-${utm.term}-${utm.content}`;
  }
}
