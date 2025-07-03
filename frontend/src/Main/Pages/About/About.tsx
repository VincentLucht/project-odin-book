import Separator from '@/components/Separator';

export default function About() {
  return (
    <div className="p-4 center-main">
      <div className="w-full max-w-[1072px] rounded-lg p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="mb-4 bg-clip-text text-4xl font-bold text-blue-400">
            About reddnir
          </h1>

          <p className="text-lg leading-relaxed text-gray-300">
            Reddnir is a full-featured Reddit-like community based social media platform
            I built as my final project for The Odin Project.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="mb-6 border-b border-gray-700 pb-2 text-2xl font-semibold text-gray-200">
            Features
          </h2>

          <div className="space-y-8">
            {/* COMMUNITIES */}
            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-900/20 p-6">
              <h3 className="mb-3 text-xl font-semibold text-blue-300">Communities</h3>

              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  Create and join communities, customize settings
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  Community styling (custom profile pictures and banners)
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  Community flair system (enables post flairs and user flairs)
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  Moderation tools like report viewing, mod mail, member management
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  View all reports and take action (remove/approve posts)
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  Different functionality based on community visibility (private,
                  restricted, public)
                </li>
              </ul>
            </div>

            <Separator className="!bg-gray-700" />

            {/* POSTS */}
            <div className="rounded-lg border-l-4 border-green-500 bg-green-900/20 p-6">
              <h3 className="mb-3 text-xl font-semibold text-green-300">Posts</h3>

              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 text-green-400">•</span>
                  Create, edit, and delete posts
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-green-400">•</span>
                  Upvote/downvote posts
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-green-400">•</span>
                  Post flair, NSFW, and spoiler tags
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-green-400">•</span>
                  Save posts functionality
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-green-400">•</span>
                  Report posts functionality
                </li>
              </ul>
            </div>

            <Separator className="!bg-gray-700" />

            {/* COMMENTS */}
            <div className="rounded-lg border-l-4 border-purple-500 bg-purple-900/20 p-6">
              <h3 className="mb-3 text-xl font-semibold text-purple-300">Comments</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-400">•</span>
                  Create, edit, and delete comments
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-purple-400">•</span>
                  Upvote/downvote comments
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-purple-400">•</span>
                  Nested comment threads with replies
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-purple-400">•</span>
                  Save and report functionality
                </li>
              </ul>
            </div>

            <Separator className="!bg-gray-700" />

            {/* FEED */}
            <div className="rounded-lg border-l-4 border-orange-500 bg-orange-900/20 p-6">
              <h3 className="mb-3 text-xl font-semibold text-orange-300">
                Feed System
              </h3>

              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 text-orange-400">•</span>
                  Personalized home feed with posts from joined communities
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-orange-400">•</span>
                  Popular page showing trending posts from all public communities
                </li>
              </ul>
            </div>

            <Separator className="!bg-gray-700" />

            {/* USERS */}
            <div className="rounded-lg border-l-4 border-teal-500 bg-teal-900/20 p-6">
              <h3 className="mb-3 text-xl font-semibold text-teal-300">Users</h3>

              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 text-teal-400">•</span>
                  User profiles with post and comment history
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-teal-400">•</span>
                  View post and comment karma
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-teal-400">•</span>
                  View saved posts and comments
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-teal-400">•</span>
                  Customizable user settings
                </li>
              </ul>
            </div>

            <Separator className="!bg-gray-700" />

            {/* USER AUTHENTICATION */}
            <div className="rounded-lg border-l-4 border-indigo-500 bg-indigo-900/20 p-6">
              <h3 className="mb-3 text-xl font-semibold text-indigo-300">
                User Authentication
              </h3>

              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">•</span>
                  Secure JWT-based authentication
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">•</span>
                  Registration and login system
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">•</span>
                  Backend token verification
                </li>
              </ul>
            </div>

            <Separator className="!bg-gray-700" />

            {/* CHATS */}
            <div className="rounded-lg border-l-4 border-pink-500 bg-pink-900/20 p-6">
              <h3 className="mb-3 text-xl font-semibold text-pink-300">Chats</h3>

              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 text-pink-400">•</span>
                  Private messaging system between users
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-pink-400">•</span>
                  Start conversations by searching users by username
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-pink-400">•</span>
                  Message history and conversation management
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-pink-400">•</span>
                  Chat notifications and notification management
                </li>
              </ul>
            </div>

            <Separator className="!bg-gray-700" />

            {/* NOTIFICATIONS */}
            <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-900/20 p-6">
              <h3 className="mb-3 text-xl font-semibold text-yellow-300">
                Notifications
              </h3>

              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-400">•</span>
                  Notifications for comment replies and post interactions
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-yellow-400">•</span>
                  Moderation notifications (report actions, mod mail responses)
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-yellow-400">•</span>
                  Notification history and management
                </li>
              </ul>
            </div>

            <Separator className="!bg-gray-700" />

            {/* TECHNICAL HIGHLIGHTS */}
            <div className="rounded-lg border-l-4 border-red-600 bg-red-800/20 p-6">
              <h3 className="mb-3 text-xl font-semibold text-red-400">
                Technical Highlights
              </h3>

              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 text-red-300">•</span>
                  Full REST API backend with Prisma ORM
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-red-300">•</span>
                  Pagination and virtualization for performance
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-red-300">•</span>
                  Lazy loading with skeleton UI states
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-red-300">•</span>
                  Fully responsive design (works down to 360px)
                </li>

                <li className="flex items-start">
                  <span className="mr-2 text-red-300">•</span>
                  <span className="font-semibold">
                    Substantial full-stack application with 40,000+ lines of code
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
