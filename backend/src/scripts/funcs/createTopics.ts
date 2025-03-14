import { PrismaClient } from '@prisma/client/default';

export default async function createTopics(prisma: PrismaClient) {
  console.log('Creating main topics and subtopics...');

  const mainTopics = [
    {
      name: 'Technology',
      subtopics: [
        'Programming',
        'Artificial Intelligence',
        'Cybersecurity',
        'Gaming',
        'Hardware',
        'Software Development',
        'Mobile Tech',
        'Virtual Reality',
        'Blockchain',
        'Cloud Computing',
        'Internet of Things',
        'Tech Support',
        'Web Development',
        'Data Science',
        'Consumer Electronics',
      ],
    },
    {
      name: 'Entertainment',
      subtopics: [
        'Movies',
        'Television',
        'Music',
        'Books',
        'Comics',
        'Anime',
        'Podcasts',
        'Streaming',
        'Celebrity News',
        'Theater',
        'Stand-up Comedy',
        'Web Series',
        'Animation',
        'Film Making',
        'Live Events',
      ],
    },
    {
      name: 'Science',
      subtopics: [
        'Space',
        'Physics',
        'Biology',
        'Chemistry',
        'Psychology',
        'Neuroscience',
        'Environmental Science',
        'Astronomy',
        'Evolution',
        'Genetics',
        'Medicine',
        'Climate Change',
        'Quantum Physics',
        'Marine Biology',
        'Paleontology',
      ],
    },
    {
      name: 'Sports',
      subtopics: [
        'Football',
        'Basketball',
        'Soccer',
        'Baseball',
        'Tennis',
        'Combat Sports',
        'Olympics',
        'Cycling',
        'Swimming',
        'Athletics',
        'Extreme Sports',
        'Fantasy Sports',
        'Golf',
        'Hockey',
        'Rugby',
      ],
    },
    {
      name: 'Art & Design',
      subtopics: [
        'Digital Art',
        'Photography',
        'Graphic Design',
        'Illustration',
        'Fine Art',
        'Architecture',
        'Industrial Design',
        'Fashion Design',
        'Interior Design',
        'Street Art',
        'Sculpture',
        'Animation Art',
        'Typography',
        'Art History',
        'Creative Process',
      ],
    },
    {
      name: 'Food & Cooking',
      subtopics: [
        'Recipes',
        'Baking',
        'Restaurants',
        'Wine & Spirits',
        'Vegan',
        'Vegetarian',
        'International Cuisine',
        'Cooking Techniques',
        'BBQ',
        'Food Science',
        'Healthy Eating',
        'Kitchen Gear',
        'Food Culture',
        'Meal Prep',
        'Food Photography',
      ],
    },
    {
      name: 'Lifestyle',
      subtopics: [
        'Fitness',
        'Mental Health',
        'Relationships',
        'Personal Finance',
        'Travel',
        'Home & Garden',
        'Fashion',
        'Beauty',
        'Parenting',
        'Self Improvement',
        'Minimalism',
        'Work Life Balance',
        'Hobbies',
        'Pet Care',
        'Wellness',
      ],
    },
    {
      name: 'Education',
      subtopics: [
        'Online Learning',
        'Study Tips',
        'College Life',
        'Academic Research',
        'Language Learning',
        'Teaching',
        'Student Life',
        'Career Development',
        'Educational Technology',
        'Scholarships',
        'Graduate School',
        'Adult Education',
        'Learning Resources',
        'Academic Writing',
        'STEM Education',
      ],
    },
    {
      name: 'Business',
      subtopics: [
        'Entrepreneurship',
        'Marketing',
        'Startups',
        'Investing',
        'Cryptocurrency',
        'Small Business',
        'E-commerce',
        'Leadership',
        'Remote Work',
        'Business Strategy',
        'Real Estate',
        'Stock Market',
        'Digital Marketing',
        'Business News',
        'Career Advice',
      ],
    },
    {
      name: 'Politics & Current Events',
      subtopics: [
        'World News',
        'Local Politics',
        'International Relations',
        'Political Discussion',
        'Elections',
        'Policy Debate',
        'Activism',
        'Government',
        'Social Justice',
        'Economics',
        'Environmental Policy',
        'Political Analysis',
        'Democracy',
        'Human Rights',
        'Media Analysis',
      ],
    },
    {
      name: 'Hobbies & Crafts',
      subtopics: [
        'DIY',
        'Woodworking',
        'Gardening',
        'Model Making',
        'Knitting',
        '3D Printing',
        'Collecting',
        'Pottery',
        'Sewing',
        'Paper Crafts',
        'Jewelry Making',
        'Robotics',
        'Cosplay',
        'Home Brewing',
        'Crafting',
      ],
    },
    {
      name: 'Gaming',
      subtopics: [
        'PC Gaming',
        'Console Gaming',
        'Mobile Gaming',
        'Esports',
        'Game Development',
        'Retro Gaming',
        'Gaming News',
        'Game Reviews',
        'Gaming Community',
        'Strategy Games',
        'RPGs',
        'FPS Games',
        'Indie Games',
        'Gaming Deals',
        'Gaming Hardware',
      ],
    },
    {
      name: 'Humor',
      subtopics: [
        'Memes',
        'Jokes',
        'Funny Videos',
        'Satire',
        'Comedy',
        'Funny Stories',
        'Pranks',
        'Web Comics',
        'Parody',
        'Dark Humor',
        'Dad Jokes',
        'Stand-up',
        'Viral Content',
        'Comedy Writing',
        'Humor Analysis',
      ],
    },
    {
      name: 'Nature & Environment',
      subtopics: [
        'Wildlife',
        'Conservation',
        'National Parks',
        'Sustainability',
        'Outdoor Activities',
        'Climate Action',
        'Ecology',
        'Bird Watching',
        'Environmental News',
        'Green Living',
        'Natural Phenomena',
        'Endangered Species',
        'Plant Life',
        'Marine Life',
        'Weather',
      ],
    },
    {
      name: 'Philosophy & Religion',
      subtopics: [
        'Ethics',
        'Metaphysics',
        'World Religions',
        'Spirituality',
        'Philosophy of Science',
        'Religious Studies',
        'Moral Philosophy',
        'Eastern Philosophy',
        'Western Philosophy',
        'Theology',
        'Religious History',
        'Comparative Religion',
        'Logic',
        'Existentialism',
        'Religious Art',
      ],
    },
  ];

  let counter = 1;
  const subtopicIdGetter = (subtopicName: string) => {
    let subtopicId = '';

    if (
      subtopicName === 'Programming' ||
      subtopicName === 'Artificial Intelligence'
    ) {
      subtopicId = counter.toString();
      counter++;
    }

    return subtopicId;
  };

  for (const topic of mainTopics) {
    // Create main topic
    const mainTopic = await prisma.mainTopic.create({
      data: {
        id: topic.name === 'Technology' ? '1' : topic.name,
        name: topic.name,
      },
    });

    // Create subtopics
    for (const subtopicName of topic.subtopics) {
      await prisma.topic.create({
        data: {
          id: subtopicIdGetter(subtopicName) || undefined,
          name: subtopicName,
          main_category_id: mainTopic.id,
        },
      });
    }
  }

  console.log('Successfully created Topics');
}
