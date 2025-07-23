import { PrismaClient } from '@prisma/client/default';
import { faker } from '@faker-js/faker';

export default async function createPosts(prisma: PrismaClient) {
  const latestCreatedAt = new Date();
  latestCreatedAt.setHours(latestCreatedAt.getHours() - 10);

  // Posts for populating search results
  for (let i = 0; i < 300; i++) {
    const isMature = Math.random() < 0.1;
    const isSpoiler = Math.random() < 0.1;

    // Increment by 1 min for each iteration
    latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);

    const randomNumber = Math.random();

    await prisma.post.create({
      data: {
        id: `${i + 5}`,
        community_id: '1',
        poster_id: '1',
        title: `test ${i + 1}`,
        body: `${faker.lorem.paragraph({ min: 7, max: 25 })}`,
        is_mature: isMature,
        is_spoiler: isSpoiler,
        post_type: 'BASIC',
        total_vote_score: i * randomNumber,
        upvote_count: i * randomNumber,
        created_at: new Date(latestCreatedAt),
        times_reported: i,
      },
    });
  }

  latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);

  // Filler posts for comments
  await Promise.all([
    prisma.post.create({
      data: {
        id: '1',
        community_id: '1',
        poster_id: '1',
        title: 'Test Post',
        body: 'Hiii! This is a test post! Really good right?',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
        total_comment_score: 3284,
        total_vote_score: 10783,
        created_at: new Date(latestCreatedAt),
      },
    }),

    prisma.post.create({
      data: {
        id: '2',
        community_id: '1',
        poster_id: '1',
        title: 'Test SPOILER Post',
        body: 'Hiii! This is a SPOILER post! OMG wow I spoiled everything?',
        is_spoiler: true,
        is_mature: true,
        post_type: 'BASIC',
        total_comment_score: 50,
        total_vote_score: 0,
        created_at: new Date(latestCreatedAt),
      },
    }),
  ]);

  // Odin Project community posts
  const odinPosts = [
    {
      title: "Just finished Foundations - what's next?",
      body: "I've completed the Foundations course and I'm feeling pretty confident with HTML, CSS, and basic JavaScript. Should I jump into Full Stack JavaScript or Ruby on Rails? What would you recommend for someone looking to get hired quickly?",
      commentCount: 23,
    },
    {
      title: 'Struggling with the Calculator project',
      body: "I'm stuck on the calculator project in Foundations. I can't figure out how to chain operations properly. When I press = after doing 5 + 3 = 8, then try to add 2, it doesn't work as expected. Any hints?",
      commentCount: 15,
    },
    {
      title: 'Finally deployed my first project!',
      body: "After weeks of struggling, I finally got my Rock Paper Scissors project deployed on GitHub Pages! It's not perfect but seeing it live on the internet feels amazing. Thanks to everyone who helped me debug the JavaScript issues.",
      commentCount: 8,
    },
    {
      title: 'CSS Grid vs Flexbox - when to use which?',
      body: "I'm working through the CSS exercises and I'm confused about when to use CSS Grid vs Flexbox. The lessons explain both but I'm not sure which one to reach for in different situations. Any practical advice?",
      commentCount: 31,
    },
    {
      title: 'Etch-a-Sketch project tips?',
      body: "About to start the Etch-a-Sketch project and I'm a bit intimidated. Any tips or common pitfalls I should watch out for? I'm comfortable with the DOM manipulation basics but this seems like a big step up.",
      commentCount: 19,
    },
    {
      title: 'How long did Foundations take you?',
      body: "I'm about 6 weeks into Foundations and feeling like I'm moving slowly. How long did it take others to complete? Should I be worried about my pace? I'm working about 15-20 hours a week on it.",
      commentCount: 47,
    },
    {
      title: 'Best resources for JavaScript practice?',
      body: "The TOP JavaScript lessons are great but I want more practice problems. What are some good external resources that complement the curriculum? I've heard good things about Codewars but want other suggestions too.",
      commentCount: 34,
    },
    {
      title: 'Git workflow confusion',
      body: "I think I messed up my git workflow on the restaurant page project. I have commits all over the place and I'm not sure how to clean it up. Should I start over or is there a way to fix this mess?",
      commentCount: 12,
    },
    {
      title: 'Landing page project feedback needed',
      body: "I just finished my first landing page project and I'd love some feedback! I know the design isn't perfect but I'm proud of what I've accomplished. Link in comments. What should I improve for next time?",
      commentCount: 6,
    },
    {
      title: 'JavaScript objects and arrays clicking!',
      body: "Something just clicked for me with JavaScript objects and arrays today! The way everything connects with methods and properties finally makes sense. Anyone else have that 'aha' moment during this section?",
      commentCount: 28,
    },
    {
      title: 'Recommended VS Code extensions?',
      body: "I'm using VS Code for TOP and wondering what extensions you all recommend? I have Live Server and Prettier installed but I'm sure there are others that would make my life easier.",
      commentCount: 41,
    },
    {
      title: 'Balancing TOP with a full-time job',
      body: "How do you all manage studying TOP while working full-time? I'm finding it hard to stay consistent with my practice. Some days I'm too tired to code effectively. Any tips for maintaining momentum?",
      commentCount: 56,
    },
    {
      title: 'Should I learn TypeScript alongside JavaScript?',
      body: "I keep seeing TypeScript mentioned in job postings. Should I learn it alongside JavaScript in TOP, or wait until I finish the main curriculum? Don't want to get overwhelmed but also don't want to miss out.",
      commentCount: 18,
    },
    {
      title: 'Library project seems overwhelming',
      body: "I'm looking at the Library project requirements and it seems like a huge jump from the previous projects. Objects, constructors, and now I need to create a full app? Any advice on how to approach this systematically?",
      commentCount: 22,
    },
    {
      title: 'My first job application success!',
      body: "Just wanted to share that I got my first interview after applying to 50+ jobs! I'm halfway through the Full Stack JavaScript path. The portfolio projects from TOP definitely helped me stand out. Don't give up!",
      commentCount: 39,
    },
    {
      title: 'Debugging strategies that actually work',
      body: "After months of console.log debugging, I finally learned to use the browser debugger properly. Game changer! What debugging techniques do you wish you'd learned earlier in your TOP journey?",
      commentCount: 33,
    },
    {
      title: 'Node.js feels like a different language',
      body: "I was feeling confident with frontend JavaScript but Node.js in the backend sections feels completely different. File systems, modules, npm packages - it's overwhelming. Does this get easier or am I missing something fundamental?",
      commentCount: 26,
    },
    {
      title: 'Testing with Jest - why is this so hard?',
      body: "I'm in the testing section and Jest is kicking my butt. I understand the concept of testing but writing actual tests is much harder than I expected. The syntax feels foreign and I keep getting weird errors.",
      commentCount: 17,
    },
    {
      title: 'React vs Vanilla JS - the transition',
      body: 'Just started the React section after doing everything in vanilla JavaScript. The component-based thinking is really different. How long did it take you to feel comfortable with React after learning vanilla JS?',
      commentCount: 29,
    },
    {
      title: 'MongoDB or PostgreSQL for projects?',
      body: "I'm choosing between the database options for my final projects. I see MongoDB is covered in the curriculum but PostgreSQL seems more popular in job postings. Which path did you take and why?",
      commentCount: 21,
    },
    {
      title: 'Impostor syndrome hitting hard',
      body: "I'm 80% through the Full Stack JavaScript path but I still feel like I don't know anything. Looking at other people's projects makes me feel like I'm way behind. Is this normal? When does the confidence start to build?",
      commentCount: 64,
    },
    {
      title: 'Best practices for project organization?',
      body: "My project folders are getting messy and I'm not sure how to structure them properly. What's the best way to organize files for the larger TOP projects? Any folder structure conventions I should follow?",
      commentCount: 13,
    },
    {
      title: 'Networking tips for self-taught developers?',
      body: "I don't have a CS degree and I'm doing TOP to change careers. How do you network and find opportunities as a self-taught developer? LinkedIn seems intimidating and I don't know where to start.",
      commentCount: 37,
    },
    {
      title: 'API integration giving me headaches',
      body: 'Working on the Weather App project and APIs are confusing me. I can get the data but handling errors, loading states, and async operations properly is tricky. Any good resources for understanding APIs better?',
      commentCount: 25,
    },
    {
      title: 'Should I contribute to open source?',
      body: "I keep hearing about contributing to open source projects but I don't feel ready. How do you know when you're good enough to contribute? And how do you find beginner-friendly projects to contribute to?",
      commentCount: 16,
    },
    {
      title: 'CSS is harder than JavaScript?',
      body: 'Am I crazy for thinking CSS is harder than JavaScript? I can write functions and loops just fine but making things look good and responsive is driving me insane. How do you approach CSS systematically?',
      commentCount: 52,
    },
    {
      title: 'Memorization vs understanding',
      body: "I find myself constantly looking up syntax and methods. Should I be memorizing more or is it okay to rely on documentation and Stack Overflow? What's the balance between memorization and understanding concepts?",
      commentCount: 43,
    },
    {
      title: 'Full Stack JavaScript vs Ruby path?',
      body: "I'm finishing Foundations and torn between the two paths. I've heard Ruby is more beginner-friendly but JavaScript seems more in-demand. What factors should I consider when choosing? Can I switch later if needed?",
      commentCount: 35,
    },
    {
      title: 'Time management for larger projects',
      body: 'The Restaurant Page project is taking me forever to complete. I keep getting stuck on small details and losing sight of the bigger picture. How do you manage time and stay focused on larger projects?',
      commentCount: 14,
    },
    {
      title: 'Celebrating small wins in TOP',
      body: "Just got my first green checkmark on a CSS exercise after 2 hours of debugging. It's not much but it feels like a victory! Remember to celebrate the small wins in this journey - they add up to something big.",
      commentCount: 11,
    },
    {
      title: 'Admin Panel project - data modeling help?',
      body: "I'm working on the Admin Panel project and I'm struggling with how to model the relationships between users, posts, and comments. Should I use separate tables or embed documents? This database design is confusing me.",
      commentCount: 9,
    },
    {
      title: 'Deployment nightmares with Railway',
      body: "Trying to deploy my Express app to Railway and I keep getting build errors. The same code works perfectly on my local machine but fails in production. Environment variables seem to be the issue but I can't figure out what's wrong.",
      commentCount: 7,
    },
    {
      title: 'CORS errors are driving me insane',
      body: "Every time I try to connect my React frontend to my Express backend, I get CORS errors. I've tried every solution on Stack Overflow but nothing works. How do you properly handle CORS in development vs production?",
      commentCount: 20,
    },
    {
      title: 'Webpack configuration is black magic',
      body: 'I thought I understood JavaScript pretty well until I had to configure Webpack from scratch. The documentation is overwhelming and there are so many plugins and loaders. Any beginner-friendly resources for Webpack?',
      commentCount: 24,
    },
    {
      title: 'Authentication with Passport.js confusion',
      body: 'Working through the authentication lessons and Passport.js is confusing me. Local strategy, sessions, serialization - there are so many moving parts. Has anyone found a good way to understand how all these pieces fit together?',
      commentCount: 18,
    },
    {
      title: "SQL vs NoSQL - still don't get it",
      body: "I've done both the MongoDB and PostgreSQL sections but I still don't understand when to use SQL vs NoSQL. Everyone says 'it depends' but what does it actually depend on? Can someone explain with real examples?",
      commentCount: 32,
    },
    {
      title: 'React hooks broke my brain',
      body: 'I was getting comfortable with class components and then hooks came along. useEffect, useState, useContext - when do I use what? The dependency array in useEffect is particularly confusing. Any mental models that help?',
      commentCount: 27,
    },
    {
      title: 'Code review feedback - how to improve?',
      body: "I posted my Shopping Cart project for feedback and got torn apart. Variable names, function structure, component organization - apparently I'm doing everything wrong. How do you develop good coding habits and style?",
      commentCount: 15,
    },
    {
      title: 'Algorithm practice alongside TOP?',
      body: "Should I be doing LeetCode problems while working through TOP? I see job postings mentioning data structures and algorithms but TOP doesn't cover them much. How important are algorithms for getting hired?",
      commentCount: 38,
    },
    {
      title: 'Responsive design is harder than I thought',
      body: "I can make websites that look good on desktop but mobile responsiveness is kicking my butt. Media queries, flexible layouts, touch interactions - there's so much to consider. Any systematic approach to responsive design?",
      commentCount: 22,
    },
    {
      title: 'Getting overwhelmed by the JavaScript ecosystem',
      body: 'Babel, ESLint, Prettier, TypeScript, React, Redux, Next.js - there are so many tools and frameworks. How do you keep up with everything? Should I learn all of them or focus on the basics first?',
      commentCount: 45,
    },
    {
      title: 'First technical interview disaster',
      body: 'Had my first technical interview and it was a disaster. I froze up on a simple array problem that I could solve easily at home. How do you practice for technical interviews? The pressure is overwhelming.',
      commentCount: 31,
    },
    {
      title: 'Ruby on Rails magic vs explicit JavaScript',
      body: "I switched from the JavaScript path to Ruby and Rails feels like magic compared to Express. So much is hidden behind conventions. Is this good or bad? I feel like I understand less about what's happening.",
      commentCount: 19,
    },
    {
      title: 'Portfolio project ideas beyond TOP?',
      body: "I've finished most of the required projects but I want to build something unique for my portfolio. What are some interesting project ideas that aren't overdone? I want to stand out from other TOP graduates.",
      commentCount: 29,
    },
    {
      title: 'Vim vs VS Code - am I missing out?',
      body: "Everyone talks about Vim like it's the holy grail of text editors but VS Code is so much easier. Am I missing out on something important by not learning Vim? Is it worth the learning curve for web development?",
      commentCount: 41,
    },
    {
      title: 'Contributing to TOP curriculum',
      body: "I found some typos and outdated information in the TOP curriculum. How do you contribute fixes back to the project? I'd like to help improve the lessons for future students but I'm not sure about the process.",
      commentCount: 8,
    },
    {
      title: 'Pair programming experiences?',
      body: "The curriculum mentions pair programming but I've never done it. How do you find someone to pair with? Is it awkward coding with someone watching? Any tips for making pair programming productive?",
      commentCount: 12,
    },
    {
      title: 'Side projects vs curriculum - balance?',
      body: "I keep getting distracted by side project ideas while working through TOP. Should I stick to the curriculum or is it okay to explore other projects? I'm worried about not finishing but the side projects are more motivating.",
      commentCount: 26,
    },
    {
      title: 'Junior developer salary expectations',
      body: "What are realistic salary expectations for a TOP graduate with no CS degree? I see huge ranges online and I don't want to undersell myself but also don't want to be unrealistic. Location: mid-size city, not Silicon Valley.",
      commentCount: 53,
    },
    {
      title: 'Docker and containerization necessary?',
      body: "I keep seeing Docker mentioned in job postings but it's not covered in TOP. Should I learn Docker and containerization? How important is DevOps knowledge for frontend/fullstack developers?",
      commentCount: 17,
    },
    {
      title: 'Code organization and architecture',
      body: "My projects are getting larger and my code is becoming a mess. How do you organize code in larger applications? MVC, clean architecture, domain-driven design - there are so many patterns. What's a good starting point?",
      commentCount: 21,
    },
    {
      title: 'Open source contributions feel intimidating',
      body: 'I want to contribute to open source but every project I look at seems way above my level. How do you find your first contribution? What if I break something important? The codebase reviews seem so strict.',
      commentCount: 16,
    },
    {
      title: 'Mental health and coding burnout',
      body: "I've been pushing hard to finish TOP quickly but I'm starting to feel burned out. Code isn't fun anymore and I'm making stupid mistakes. How do you maintain mental health while learning to code intensively?",
      commentCount: 34,
    },
    {
      title: 'Building a professional network',
      body: "I'm introverted and the networking aspect of job searching terrifies me. How do you build professional relationships in tech? Meetups, conferences, online communities - what actually works for getting connected?",
      commentCount: 28,
    },
    {
      title: 'Web accessibility - am I ignoring it?',
      body: "I just learned about web accessibility and realized my projects probably aren't accessible at all. Screen readers, keyboard navigation, color contrast - there's so much to consider. Should I go back and fix all my projects?",
      commentCount: 13,
    },
    {
      title: 'Performance optimization rabbit hole',
      body: 'I started optimizing my React app and went down a rabbit hole of bundle splitting, lazy loading, memoization, and performance metrics. How much should junior developers worry about performance? When is optimization premature?',
      commentCount: 23,
    },
    {
      title: 'Freelancing vs full-time employment',
      body: "I'm considering freelancing instead of looking for full-time employment. The flexibility appeals to me but I'm worried about finding clients and handling business aspects. Any TOP graduates gone the freelancing route?",
      commentCount: 25,
    },
    {
      title: 'Learning multiple languages simultaneously',
      body: "I started with JavaScript but I'm curious about Python and Go. Is it okay to learn multiple programming languages at once or should I master JavaScript first? I don't want to confuse myself with different syntax.",
      commentCount: 30,
    },
    {
      title: 'Code comments - too many or too few?',
      body: "I got feedback that my code has too many comments and that good code should be self-documenting. But without comments, I forget what I was thinking. What's the right balance? When should you comment and when shouldn't you?",
      commentCount: 18,
    },
    {
      title: 'Version control beyond basic Git',
      body: "I can commit, push, and pull but I'm confused about rebasing, squashing, and advanced Git workflows. How much Git knowledge do you need as a junior developer? Are there concepts I should prioritize learning?",
      commentCount: 20,
    },
    {
      title: 'Job search strategies that actually work',
      body: "I've been applying to jobs for 3 months with no luck. Cold applications aren't working. What strategies have actually worked for TOP graduates? Referrals, networking, recruiters, or something else?",
      commentCount: 47,
    },
  ];

  // Create Odin Project posts
  const currentTime = new Date();
  await Promise.all(
    odinPosts.map((post, index) => {
      const postTime = new Date(currentTime);
      postTime.setMinutes(postTime.getMinutes() + index); // Spread posts over time

      return prisma.post.create({
        data: {
          id: `${305 + index}`, // Start after the existing posts
          community_id: '1',
          poster_id: '1',
          title: post.title,
          body: post.body,
          is_mature: false,
          is_spoiler: false,
          post_type: 'BASIC',
          total_vote_score: Math.floor(Math.random() * 200) + 10,
          upvote_count: Math.floor(Math.random() * 200) + 10,
          total_comment_score: post.commentCount,
          created_at: postTime,
          times_reported: 0,
        },
      });
    }),
  );
}
