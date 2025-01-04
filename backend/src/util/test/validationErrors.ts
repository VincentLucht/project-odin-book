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

  missingCommunity() {
    return {
      errors: [
        {
          type: 'field',
          value: '',
          msg: 'Name must be at least 1 characters long',
          path: 'name',
          location: 'body',
        },
        {
          type: 'field',
          msg: 'Invalid value',
          path: 'is_mature',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Invalid value',
          path: 'type',
          location: 'body',
        },
        {
          type: 'field',
          value: '',
          msg: 'Community Topics are required',
          path: 'topics',
          location: 'body',
        },
      ],
    };
  }
}

const valErr = new ValidationErrors();
export default valErr;
