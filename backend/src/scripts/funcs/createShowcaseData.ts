import { PrismaClient } from '@prisma/client/default';
import { faker } from '@faker-js/faker';

export async function createDeCommunity(prisma: PrismaClient) {
  const deId = `${new Date().toISOString()}`;

  // Create the community
  await prisma.community.create({
    data: {
      id: deId,
      name: 'de',
      type: 'PUBLIC',
      owner_id: '1',
      profile_picture_url:
        'https://styles.redditmedia.com/t5_22i0/styles/communityIcon_iohlccw565a81.png?width=128&frame=1&auto=webp&s=4b2ba176b23c9a1d3eed0b0ede869110b804859f',
      banner_url_desktop:
        'https://styles.redditmedia.com/t5_22i0/styles/bannerBackgroundImage_icijbfh2yane1.jpeg?format=pjpg&s=a7315ebcbd5e72037851bb6cab5f14fe9cf2c3af',
      total_members: 3100000,
      description:
        'Das Sammelbecken für alle Deutschsprechenden, hauptsächlich auf Deutsch, manchmal auch auf Englisch. Für Deutschland, Österreich, Schweiz, Liechtenstein, Luxemburg und die zwei Belgier.',
      created_at: new Date('2006-02-20T00:00:00.000Z'),
    },
  });

  await Promise.all([
    prisma.communityModerator.create({
      data: {
        community_id: deId,
        user_id: '1',
      },
    }),
    prisma.userCommunity.create({
      data: {
        community_id: deId,
        user_id: '1',
        role: 'CONTRIBUTOR',
      },
    }),
    // Guest user
    prisma.userCommunity.create({
      data: {
        community_id: deId,
        user_id: '3',
        role: 'CONTRIBUTOR',
      },
    }),
    // Admin user
    prisma.userCommunity.create({
      data: {
        community_id: deId,
        user_id: '4',
        role: 'CONTRIBUTOR',
      },
    }),
  ]);

  const postsDe = [
    {
      title: 'Bald Urlaub in die Alpen – Tipps?',
      body: 'Ich plane nächsten Monat...',
      commentCount: 28,
    },
    {
      title: 'Neuer Netflix-Dokus über deutsche Geschichte – Empfehlungen?',
      body: 'Gibt es spannende Dokus...',
      commentCount: 19,
    },
    {
      title: 'VW ID.4 in echt – wie ist die Reichweite?',
      body: 'Überlege ein Elektroauto anzuschaffen...',
      commentCount: 24,
    },
    {
      title: 'Arbeitsvertrag unterschreiben – was beachten?',
      body: 'Ich hab ein Jobangebot erhalten...',
      commentCount: 32,
    },
    {
      title: 'Wohnung kündigen – Kündigungsfrist bei 3 Monaten Mietdauer?',
      body: 'Bin seit Kurzem in einer neuen Stadt...',
      commentCount: 17,
    },
    {
      title: 'Lieblingsdiscounter neben Aldi & Lidl?',
      body: 'Kennt ihr regionale Discounter...',
      commentCount: 22,
    },
    {
      title: 'BahnCard 100 lohnt sich das?',
      body: 'Pendle viel in Deutschland...',
      commentCount: 29,
    },
    {
      title: 'Streamingfreiheit in Deutschland – was ist legal?',
      body: 'Ich hab von VPNs gehört...',
      commentCount: 15,
    },
    {
      title: 'Wohnzimmertauglicher Kaminofen gesucht',
      body: 'Würde gern einen Holzofen installieren...',
      commentCount: 14,
    },
    {
      title: 'Fahrradhelm Pflicht – in welcher Situation?',
      body: 'Ist der Helm Pflicht oder Empfehlung?',
      commentCount: 21,
    },
    {
      title: 'Infektionsschutz im Enztal – Tipps für Wanderung?',
      body: 'Gibt’s dort Zecken oder Mücken?',
      commentCount: 18,
    },
    {
      title: 'Co-Working-Spaces in Nürnberg',
      body: 'Wer kennt gute mit Tagespass?',
      commentCount: 25,
    },
    {
      title: "Letzte Folgen von 'Dark' – hat's der Twist gebracht?",
      body: 'Finale Staffel gesehen...',
      commentCount: 34,
    },
    {
      title: 'Günstige Unterkunft in Berlin-Mitte',
      body: 'Such ein Zimmer unter 50€/Nacht',
      commentCount: 31,
    },
    {
      title: 'IT-Job ohne Abschluss – wie sah’s bei euch aus?',
      body: 'Quereinstieg möglich?',
      commentCount: 27,
    },
    {
      title: 'ÖPNV in Köln nachts – sicher?',
      body: 'Wie ist die Lage mit Taxen/Nachtbus?',
      commentCount: 20,
    },
    {
      title: 'Lieblings-Skiregion in Deutschland?',
      body: 'Wo ist’s am Schönsten?',
      commentCount: 23,
    },
    {
      title: 'Corona-Impfung Booster – dringend nötig?',
      body: 'Nach 6 Monaten – ja oder nein?',
      commentCount: 26,
    },
    {
      title: 'Führerschein in Berlin – Chaos oder smooth?',
      body: 'Eure Erfahrungen?',
      commentCount: 16,
    },
    {
      title: 'Steuernachzahlung beim Nebenjob – was beachten?',
      body: 'Fehler vermeiden?',
      commentCount: 18,
    },
    {
      title: 'Weihnachtsmärkte – habt ihr Favoriten?',
      body: 'Welche lohnen sich?',
      commentCount: 21,
    },
    {
      title: 'Vegane Currywurst in München – ja oder nein?',
      body: 'Wer hat probiert?',
      commentCount: 14,
    },
    {
      title: 'Handwerker-Pleite – was tun?',
      body: 'Bezahlt, aber mies gearbeitet.',
      commentCount: 19,
    },
    {
      title: 'Referendariat vs. Direkteinstieg – was nehmt ihr?',
      body: 'Lehrer:innen unter euch?',
      commentCount: 20,
    },
    {
      title: 'Mocktail statt Alkohol – gute Ideen?',
      body: 'Rezepttipps gesucht!',
      commentCount: 17,
    },
    {
      title: 'Wohnungsputz-Tipps vor Übergabe',
      body: 'Kaution sichern!',
      commentCount: 25,
    },
    {
      title: 'Stromanbieter wechseln – hat sich gelohnt?',
      body: 'Ökostrom oder billig?',
      commentCount: 22,
    },
    {
      title: 'Familienurlaub an der Ostsee',
      body: 'Hotel-Tipps?',
      commentCount: 28,
    },
    {
      title: 'Steuererklärung via Smartsteuer oder ELSTER?',
      body: 'Was nutzt ihr?',
      commentCount: 23,
    },
    {
      title: 'Sprachreise Spanisch – welche Anbieter?',
      body: 'Wer war in Spanien?',
      commentCount: 24,
    },
  ];

  const posts = [];
  const baseCreatedAt = new Date();

  // Helper function to create nested comments
  const createNestedComments = async (
    postId: string,
    parentId: string | null,
    depth: number,
    maxDepth: number,
  ) => {
    if (depth >= maxDepth) {
      return;
    }

    const numberOfReplies = faker.number.int({ min: 0, max: 3 }); // Number of replies at this level

    for (let i = 0; i < numberOfReplies; i++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          post_id: postId,
          user_id: faker.helpers.arrayElement(['1', '2']), // Use different users for replies
          parent_comment_id: parentId,
          created_at: faker.date.recent({ days: 3 }), // More recent than original comment
        },
      });
      // Recursively call to create deeper nested comments
      await createNestedComments(postId, comment.id, depth + 1, maxDepth);
    }
  };

  // Create manually defined posts first
  for (let i = 0; i < postsDe.length; i++) {
    const createdAt = new Date(baseCreatedAt);
    createdAt.setMinutes(createdAt.getMinutes() - i);

    const post = await prisma.post.create({
      data: {
        community_id: deId,
        poster_id: '1',
        title: postsDe[i].title,
        body: postsDe[i].body,
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
        total_comment_score: faker.number.int({ min: 0, max: 300 }),
        total_vote_score: faker.number.int({ min: 0, max: 5000 }),
        created_at: createdAt,
      },
    });

    posts.push(post);

    const commentCount = postsDe[i].commentCount;
    for (let j = 0; j < commentCount; j++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          post_id: post.id,
          user_id: faker.helpers.arrayElement(['1', '2']), // Varying user IDs
          created_at: faker.date.recent({ days: 7 }),
        },
      });

      // Call the recursive function to create nested comments
      const maxNestingDepth = faker.number.int({ min: 1, max: 4 }); // Random depth between 1 and 4 for each root comment
      await createNestedComments(post.id, comment.id, 1, maxNestingDepth);
    }
  }

  // Create random posts after the manual ones
  const totalPosts = 200;
  for (let i = 1; i <= totalPosts; i++) {
    const createdAt = new Date(baseCreatedAt);
    createdAt.setHours(createdAt.getHours() - (i + postsDe.length));

    const post = await prisma.post.create({
      data: {
        community_id: deId,
        poster_id: faker.helpers.arrayElement(['1', '2']), // Varying user IDs for random posts
        title: `Post ${i}`,
        body: faker.lorem.paragraph(),
        is_spoiler: Math.random() < 0.2,
        is_mature: Math.random() < 0.1,
        post_type: 'BASIC',
        total_comment_score: faker.number.int({ min: 0, max: 500 }),
        total_vote_score: faker.number.int({ min: 0, max: 5000 }),
        created_at: createdAt,
      },
    });

    posts.push(post);
  }

  // Create comments for random posts
  for (const post of posts.slice(postsDe.length)) {
    const totalComments = faker.number.int({ min: 0, max: 20 });

    for (let j = 0; j < totalComments; j++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          post_id: post.id,
          user_id: faker.helpers.arrayElement(['1', '2']), // Varying user IDs
          created_at: faker.date.recent({ days: 7 }),
        },
      });

      // Call the recursive function to create nested comments
      const maxNestingDepth = faker.number.int({ min: 1, max: 3 }); // Random depth between 1 and 3 for random post comments
      await createNestedComments(post.id, comment.id, 1, maxNestingDepth);
    }
  }

  console.log('Successfully created posts and comments for r/de');
}

export async function createFinanceCommunity(prisma: PrismaClient) {
  const financeId = `${new Date().toISOString()}---;--${new Date().toISOString()}`;

  // Create the community
  await prisma.community.create({
    data: {
      id: financeId,
      name: 'finance',
      type: 'PUBLIC',
      owner_id: '1',
      profile_picture_url:
        'https://styles.redditmedia.com/t5_2qhfj/styles/communityIcon_1i72g3so4wi61.png?width=128&frame=1&auto=webp&s=a4454aa0baf8ad7d051f2d631d3d4734b2cf3ce8',
      banner_url_desktop:
        'https://styles.redditmedia.com/t5_2qhfj/styles/bannerBackgroundImage_fe62eszd9wi61.png',
      total_members: 2000000,
      description:
        'A community for discussing all things finance: personal finance, investing, financial news, and more.',
      created_at: new Date('2008-06-15T00:00:00.000Z'),
    },
  });

  await Promise.all([
    prisma.communityModerator.create({
      data: {
        community_id: financeId,
        user_id: '1',
      },
    }),
    prisma.userCommunity.create({
      data: {
        community_id: financeId,
        user_id: '1',
        role: 'CONTRIBUTOR',
      },
    }),
    // Guest user
    prisma.userCommunity.create({
      data: {
        community_id: financeId,
        user_id: '3',
        role: 'CONTRIBUTOR',
      },
    }),
    // Admin user
    prisma.userCommunity.create({
      data: {
        community_id: financeId,
        user_id: '4',
        role: 'CONTRIBUTOR',
      },
    }),
  ]);

  const postsFinance = [
    {
      title: 'Should I invest in an S&P 500 index fund or individual stocks?',
      body: 'I am new to investing and trying to decide...',
      commentCount: 45,
    },
    {
      title: 'Best high-yield savings accounts for 2025?',
      body: 'Looking for recommendations on where to park my emergency fund...',
      commentCount: 38,
    },
    {
      title: 'Navigating student loan repayment strategies',
      body: 'With new interest rates, what is the best approach for paying off loans?',
      commentCount: 52,
    },
    {
      title: 'Thoughts on the current real estate market bubble?',
      body: 'Is it a good time to buy, or should I wait?',
      commentCount: 65,
    },
    {
      title: 'How to create a realistic budget for a family of four?',
      body: 'Struggling to track expenses and save effectively...',
      commentCount: 30,
    },
    {
      title: 'Understanding Roth IRA vs. Traditional IRA',
      body: 'Which one makes more sense for my income bracket?',
      commentCount: 40,
    },
    {
      title: 'Beginner’s guide to cryptocurrency investing',
      body: 'What are the risks and potential rewards?',
      commentCount: 55,
    },
    {
      title: 'Dealing with unexpected medical debt – what are my options?',
      body: 'Received a huge bill and not sure how to proceed...',
      commentCount: 28,
    },
    {
      title: 'Pros and cons of becoming a landlord',
      body: 'Considering buying a rental property...',
      commentCount: 33,
    },
    {
      title: 'What are the most tax-efficient ways to invest?',
      body: 'Looking to minimize my tax burden...',
      commentCount: 48,
    },
    {
      title: 'Is now a good time to refinance my mortgage?',
      body: 'Interest rates seem to be fluctuating...',
      commentCount: 36,
    },
    {
      title: 'Financial planning for early retirement – tips and strategies?',
      body: 'Aiming to retire by 50, what should I be doing now?',
      commentCount: 60,
    },
    {
      title: 'How to diversify a small investment portfolio?',
      body: 'Only have a few thousand to start with...',
      commentCount: 25,
    },
    {
      title: 'Understanding capital gains tax – simplified explanation?',
      body: 'Confused about short-term vs. long-term...',
      commentCount: 39,
    },
    {
      title: 'Best credit cards for travel rewards in 2025?',
      body: 'Planning a big trip and want to maximize points...',
      commentCount: 32,
    },
    {
      title: 'Setting up a college savings plan for my child',
      body: '529 plans or other options?',
      commentCount: 27,
    },
    {
      title: 'What are the common pitfalls to avoid in day trading?',
      body: 'Thinking about trying it, but nervous...',
      commentCount: 42,
    },
    {
      title: 'Is whole life insurance ever a good idea?',
      body: 'Conflicting advice from advisors...',
      commentCount: 50,
    },
    {
      title: 'Strategies for paying off high-interest credit card debt',
      body: 'Feeling overwhelmed by the balances...',
      commentCount: 35,
    },
    {
      title: 'How to choose a reliable financial advisor?',
      body: 'What questions should I ask?',
      commentCount: 44,
    },
    {
      title: 'Impact of inflation on retirement savings',
      body: 'How should I adjust my strategy?',
      commentCount: 58,
    },
    {
      title: 'Understanding ESG investing – truly impactful?',
      body: 'Is it just marketing, or does it make a difference?',
      commentCount: 29,
    },
    {
      title: 'Best online platforms for self-directed investing?',
      body: 'Looking for low fees and good tools...',
      commentCount: 37,
    },
    {
      title: 'What are derivatives and how do they work?',
      body: 'Heard about them but don’t really get it...',
      commentCount: 26,
    },
    {
      title: 'Tips for negotiating a higher salary in a new job',
      body: 'How much should I ask for?',
      commentCount: 41,
    },
    {
      title: 'Budgeting for a wedding – realistic expectations?',
      body: 'Getting married next year and trying to plan finances...',
      commentCount: 31,
    },
    {
      title: 'How to build an emergency fund from scratch?',
      body: 'Just started my first job and want to be prepared...',
      commentCount: 24,
    },
    {
      title: 'Understanding bond yields and their impact on portfolios',
      body: 'Confused by the recent market movements...',
      commentCount: 43,
    },
    {
      title: 'Is financial independence, retire early (FIRE) achievable?',
      body: 'What are the main principles and challenges?',
      commentCount: 56,
    },
    {
      title: 'Tax deductions I might be missing as a freelancer',
      body: 'New to self-employment and want to maximize deductions...',
      commentCount: 34,
    },
  ];

  const posts = [];
  const baseCreatedAt = new Date();

  // Helper function to create nested comments
  const createNestedComments = async (
    postId: string,
    parentId: string | null,
    depth: number,
    maxDepth: number,
  ) => {
    if (depth >= maxDepth) {
      return;
    }

    const numberOfReplies = faker.number.int({ min: 0, max: 4 });

    for (let i = 0; i < numberOfReplies; i++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          post_id: postId,
          user_id: faker.helpers.arrayElement(['1', '2', '3', '4']),
          created_at: faker.date.recent({
            days: faker.number.int({ min: 1, max: 7 }),
          }),
        },
      });
      // Recursively call to create deeper nested comments
      await createNestedComments(postId, comment.id, depth + 1, maxDepth);
    }
  };

  // Create manually defined posts first
  for (let i = 0; i < postsFinance.length; i++) {
    const createdAt = new Date(baseCreatedAt);
    createdAt.setMinutes(createdAt.getMinutes() - i * 2);

    const post = await prisma.post.create({
      data: {
        community_id: financeId,
        poster_id: faker.helpers.arrayElement(['1', '2', '3']),
        title: postsFinance[i].title,
        body: postsFinance[i].body,
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
        total_comment_score: faker.number.int({ min: 10, max: 800 }),
        total_vote_score: faker.number.int({ min: 100, max: 10000 }),
        created_at: createdAt,
      },
    });

    posts.push(post);

    const commentCount = postsFinance[i].commentCount;
    for (let j = 0; j < commentCount; j++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          post_id: post.id,
          user_id: faker.helpers.arrayElement(['1', '2', '3', '4']),
          created_at: faker.date.recent({
            days: faker.number.int({ min: 7, max: 20 }),
          }),
        },
      });

      // Call the recursive function to create nested comments
      const maxNestingDepth = faker.number.int({ min: 1, max: 5 });
      await createNestedComments(post.id, comment.id, 1, maxNestingDepth);
    }
  }

  // Create random posts after the manual ones
  const totalPosts = 300;
  for (let i = 1; i <= totalPosts; i++) {
    const createdAt = new Date(baseCreatedAt);
    createdAt.setHours(createdAt.getHours() - (i + postsFinance.length) * 0.5);

    const post = await prisma.post.create({
      data: {
        community_id: financeId,
        poster_id: faker.helpers.arrayElement(['1', '2', '3', '4']),
        title: faker.lorem.sentence({ min: 5, max: 10 }) + ' on Finance',
        body: faker.lorem.paragraphs(2),
        is_spoiler: Math.random() < 0.05,
        is_mature: Math.random() < 0.02,
        post_type: 'BASIC',
        total_comment_score: faker.number.int({ min: 0, max: 600 }),
        total_vote_score: faker.number.int({ min: 0, max: 8000 }),
        created_at: createdAt,
      },
    });

    posts.push(post);
  }

  // Create comments for random posts
  for (const post of posts.slice(postsFinance.length)) {
    const totalComments = faker.number.int({ min: 0, max: 30 });

    for (let j = 0; j < totalComments; j++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          post_id: post.id,
          user_id: faker.helpers.arrayElement(['1', '2', '3', '4']),
          created_at: faker.date.recent({
            days: faker.number.int({ min: 5, max: 15 }),
          }),
        },
      });

      const maxNestingDepth = faker.number.int({ min: 1, max: 4 });
      await createNestedComments(post.id, comment.id, 1, maxNestingDepth);
    }
  }

  console.log('Successfully created posts and comments for r/finance ');
}

export async function createMHWildsCommunity(prisma: PrismaClient) {
  const wildsId = `${new Date().toISOString()}asdfasdkfj${new Date().toLocaleDateString()}`;

  // Create the community
  await prisma.community.create({
    data: {
      id: wildsId,
      name: 'MHWilds',
      type: 'PUBLIC',
      owner_id: '1',
      profile_picture_url:
        'https://styles.redditmedia.com/t5_aash9o/styles/communityIcon_mlox25dnry4c1.png?width=128&frame=1&auto=webp&s=2b08cf55d04add819b7e77fdded6b4e7534ec443',
      banner_url_desktop:
        'https://styles.redditmedia.com/t5_aash9o/styles/bannerBackgroundImage_xg21xqneiy4c1.png',
      total_members: 750000,
      description:
        'Monster Hunter Wilds is an action RPG game about hunting large and dangerous monsters',
      created_at: new Date('2023-12-13T00:00:00.000Z'),
    },
  });

  await Promise.all([
    prisma.communityModerator.create({
      data: {
        community_id: wildsId,
        user_id: '1',
      },
    }),
    prisma.userCommunity.create({
      data: {
        community_id: wildsId,
        user_id: '1',
        role: 'CONTRIBUTOR',
      },
    }),
    // Guest user
    prisma.userCommunity.create({
      data: {
        community_id: wildsId,
        user_id: '3',
        role: 'CONTRIBUTOR',
      },
    }),
    // Admin user
    prisma.userCommunity.create({
      data: {
        community_id: wildsId,
        user_id: '4',
        role: 'CONTRIBUTOR',
      },
    }),
  ]);

  const postsMHW = [
    {
      title: 'What new monster types are you hoping for in Wilds?',
      body: "With the desert/savanna theme, I'm really hoping for some sand-dwelling leviathans!",
      commentCount: 55,
    },
    {
      title: 'Thoughts on the seamless open world revealed?',
      body: 'This is a huge game changer, no more loading zones between areas!',
      commentCount: 72,
    },
    {
      title: 'Which weapon are you starting with in MH Wilds?',
      body: "I'm torn between my trusty Long Sword or trying out something new like Hunting Horn.",
      commentCount: 60,
    },
    {
      title: 'Any theories on the new "Riding Creature" shown?',
      body: 'Could it be a customizable companion like a Palico, but rideable?',
      commentCount: 48,
    },
    {
      title: 'What QoL changes are a must-have for Wilds?',
      body: 'Please, CAPCOM, let us sort our item box better!',
      commentCount: 68,
    },
    {
      title: 'The weather system looks incredible - imagine sandstorms!',
      body: 'This adds so much to the hunting environment and monster behavior.',
      commentCount: 42,
    },
    {
      title: 'Will there be underwater combat return?',
      body: 'It was divisive in Tri, but with new mechanics, could it work?',
      commentCount: 35,
    },
    {
      title: 'Favorite returning monster you want to see in Wilds?',
      body: "I really miss Lagiacrus. He'd fit perfectly in a new ecosystem!",
      commentCount: 78,
    },
    {
      title: 'Discussion: Monster ecology and interactions in Wilds',
      body: 'They showed some intriguing interactions, how deep will it go?',
      commentCount: 50,
    },
    {
      title: 'Prowler mode for Felynes/Palicos - yay or nay?',
      body: 'It was fun in Generations, would love to see it refined.',
      commentCount: 30,
    },
    {
      title: 'Armor skills wishlist for MH Wilds?',
      body: 'I hope they bring back Critical Eye +7!',
      commentCount: 40,
    },
    {
      title: 'How much harder do you think Elder Dragons will be?',
      body: "With open zones, maybe they'll have more varied attack patterns.",
      commentCount: 47,
    },
    {
      title: 'Potential new hub city ideas for Wilds?',
      body: 'A nomadic camp that moves with the story would be cool.',
      commentCount: 33,
    },
    {
      title: 'What kind of endemic life are you excited to see?',
      body: 'Imagine giant desert scorpions or quick-burrowing creatures!',
      commentCount: 28,
    },
    {
      title: 'Will cross-platform play be supported at launch?',
      body: 'Hoping to hunt with friends on different consoles.',
      commentCount: 62,
    },
    {
      title: 'The new hunter movement seems much faster – thoughts?',
      body: 'Looks like we can traverse terrains with more agility.',
      commentCount: 58,
    },
    {
      title: 'Theory: The new "storm" mechanic and its impact on hunts?',
      body: 'Could it restrict visibility or empower certain monsters?',
      commentCount: 41,
    },
    {
      title: 'Best fan art or concept art for MH Wilds monsters so far?',
      body: 'I saw one for a massive burrowing dragon that looked amazing!',
      commentCount: 25,
    },
    {
      title: 'What kind of post-launch content do you expect?',
      body: 'Free title updates like MHW and MHRise?',
      commentCount: 39,
    },
    {
      title: 'How will verticality play a role in this open world?',
      body: 'Are we climbing cliffs or using wirebugs equivalent?',
      commentCount: 46,
    },
    {
      title: 'Your dream collaboration for MH Wilds?',
      body: 'Imagine fighting something from Elden Ring!',
      commentCount: 70,
    },
    {
      title: "What's the most underrated weapon you want buffed in Wilds?",
      body: 'Give Gunlance some love!',
      commentCount: 32,
    },
    {
      title: 'The sound design in the trailer was incredible – expectations?',
      body: 'The monster roars and environmental sounds were next level.',
      commentCount: 29,
    },
    {
      title: 'Will there be a character creation overhaul?',
      body: 'Hoping for more customization options!',
      commentCount: 36,
    },
    {
      title:
        'Are we getting new monster categories besides Leviathans, Fanged Beasts?',
      body: 'Maybe something desert-specific?',
      commentCount: 31,
    },
    {
      title: 'The Palico in the trailer looked different – new features?',
      body: 'Could they have more active roles in combat?',
      commentCount: 27,
    },
    {
      title: 'How will gear progression work with an open world?',
      body: 'More freedom to choose hunt paths?',
      commentCount: 44,
    },
    {
      title: 'What are your hopes for the story in Wilds?',
      body: 'A more engaging narrative like MHW?',
      commentCount: 51,
    },
    {
      title: 'Favorite moment from the reveal trailer?',
      body: 'The massive stampede was breathtaking!',
      commentCount: 66,
    },
    {
      title: 'Speculation on release date – early 2025 or late?',
      body: 'Hoping for Q1 2025!',
      commentCount: 49,
    },
  ];

  const posts = [];
  const baseCreatedAt = new Date();

  // Helper function to create nested comments
  const createNestedComments = async (
    postId: string,
    parentId: string | null,
    depth: number,
    maxDepth: number,
  ) => {
    if (depth >= maxDepth) {
      return;
    }

    const numberOfReplies = faker.number.int({ min: 0, max: 4 });

    for (let i = 0; i < numberOfReplies; i++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          post_id: postId,
          user_id: faker.helpers.arrayElement(['1', '2', '3', '4']),
          created_at: faker.date.recent({
            days: faker.number.int({ min: 1, max: 7 }),
          }),
        },
      });
      await createNestedComments(postId, comment.id, depth + 1, maxDepth);
    }
  };

  // Create manually defined posts first
  for (let i = 0; i < postsMHW.length; i++) {
    const createdAt = new Date(baseCreatedAt);
    createdAt.setMinutes(createdAt.getMinutes() - i * 2);

    const post = await prisma.post.create({
      data: {
        community_id: wildsId,
        poster_id: faker.helpers.arrayElement(['1', '2', '3']),
        title: postsMHW[i].title,
        body: postsMHW[i].body,
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
        total_comment_score: faker.number.int({ min: 20, max: 1200 }), // Higher scores for a hyped game
        total_vote_score: faker.number.int({ min: 200, max: 15000 }), // Higher votes for a hyped game
        created_at: createdAt,
      },
    });

    posts.push(post);

    const commentCount = postsMHW[i].commentCount;
    for (let j = 0; j < commentCount; j++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          post_id: post.id,
          user_id: faker.helpers.arrayElement(['1', '2', '3', '4']),
          created_at: faker.date.recent({
            days: faker.number.int({ min: 7, max: 20 }),
          }),
        },
      });

      const maxNestingDepth = faker.number.int({ min: 1, max: 5 });
      await createNestedComments(post.id, comment.id, 1, maxNestingDepth);
    }
  }

  // Create random posts after the manual ones
  const totalPosts = 250; // Slightly fewer random posts, more focus on curated for a game
  for (let i = 1; i <= totalPosts; i++) {
    const createdAt = new Date(baseCreatedAt);
    createdAt.setHours(createdAt.getHours() - (i + postsMHW.length) * 0.75); // Slower generation for random posts

    const post = await prisma.post.create({
      data: {
        community_id: wildsId,
        poster_id: faker.helpers.arrayElement(['1', '2', '3', '4']),
        title: faker.lorem.sentence({ min: 5, max: 12 }) + ' about MH Wilds',
        body: faker.lorem.paragraphs(2),
        is_spoiler: Math.random() < 0.1, // Some potential spoilers
        is_mature: Math.random() < 0.01, // Very rarely mature
        post_type: 'BASIC',
        total_comment_score: faker.number.int({ min: 0, max: 700 }),
        total_vote_score: faker.number.int({ min: 0, max: 9000 }),
        created_at: createdAt,
      },
    });

    posts.push(post);
  }

  // Create comments for random posts
  for (const post of posts.slice(postsMHW.length)) {
    const totalComments = faker.number.int({ min: 0, max: 25 });

    for (let j = 0; j < totalComments; j++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          post_id: post.id,
          user_id: faker.helpers.arrayElement(['1', '2', '3', '4']),
          created_at: faker.date.recent({
            days: faker.number.int({ min: 5, max: 15 }),
          }),
        },
      });

      const maxNestingDepth = faker.number.int({ min: 1, max: 4 });
      await createNestedComments(post.id, comment.id, 1, maxNestingDepth);
    }
  }

  console.log('Successfully created posts and comments for r/MHWilds ');
}
