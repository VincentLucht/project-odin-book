class ValidationErrors {
  invalidType() {
    return {
      errors: [
        {
          type: 'field',
          value: 'invalidType',
          msg: 'Invalid value',
          path: 'type',
          location: 'body',
        },
      ],
    };
  }

  invalidTopic(topic: string) {
    return {
      errors: [
        {
          type: 'field',
          value: [topic],
          msg: `Invalid topic detected: ${topic}`,
          path: 'topics',
          location: 'body',
        },
      ],
    };
  }

  missingCommunityId() {
    return {
      errors: [
        {
          type: 'field',
          value: '',
          msg: 'Community ID is required',
          path: 'community_id',
          location: 'body',
        },
      ],
    };
  }
}

const valErr = new ValidationErrors();
export default valErr;
