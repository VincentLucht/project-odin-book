class Assert {
  exp(res: any, status: number, message: string) {
    expect(res.status).toBe(status);
    expect(res.body.message).toBe(message);
  }

  dbError(res: any) {
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('DB error');
  }

  user = {
    found: (res: any) => {
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('User already exists');
    },
    notFound: (res: any) => {
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    },
  };

  community = {
    notFound: (res: any) => {
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Community not found');
    },
  };

  userCommunity = {
    isMember: (res: any) => {
      expect(res.status).toBe(409);
      expect(res.body.message).toBe(
        'You already are a member of this community',
      );
    },
    isNotMember: (res: any) => {
      expect(res.status).toBe(403);
      expect(res.body.message).toBe('You are not part of this community');
    },
  };

  communityModerator = {
    notAdmin: (res: any) => {
      expect(res.status).toBe(403);
      expect(res.body.message).toBe(
        'You are not a moderator in this community',
      );
    },
  };
}

const assert = new Assert();
export default assert;
