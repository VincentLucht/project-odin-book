class Assert {
  exp(res: any, status: number, message: string) {
    expect(res.status).toBe(status);
    expect(res.body.message).toBe(message);
  }

  dbError(res: any) {
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Database error');
  }

  user = {
    found: (res: any) => {
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('User already exists');
    },
    notFound: (res: any) => {
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User does not exist');
    },
  };

  community = {
    notFound: (res: any) => {
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Community does not exist');
    },
  };

  userCommunity = {
    isMember: (res: any) => {
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('You already joined that community');
    },
    isNotMember: (res: any) => {
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('You are not part of this community');
    },
  };
}

const assert = new Assert();
export default assert;
