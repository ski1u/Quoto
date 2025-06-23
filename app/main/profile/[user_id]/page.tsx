import { fetchProfileData } from './action'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import QuotoCard from '@/components/ui/quoto-card'
import LoadingScreen from '@/components/ui/loading-screen'

import { format, formatDistanceToNow } from 'date-fns'

const Profile = async ({ params } : {
  params : {
    user_id: string
  }
}) => {
  const { user_id } = await params
  const { user, user_metadata, quotos, isOwnProfile } = await fetchProfileData(user_id)

  // ---

  const { full_name, role, liked_quotos, bookmarked_quotos, description } = user_metadata!
  const { last_sign_in_at, created_at } = user!

  return user_metadata ? (
    <div
      className='h-screen w-screen flex justify-center items-center'
    >
      <Card
        className='max-w-[50%]'
      >
        <CardHeader>
          <CardTitle>{full_name}</CardTitle>
          <CardDescription>
            <div>
              <p className='font-medium'>{role[0].toUpperCase() + role.slice(1, role.length)}</p>
              <div className='flex flex-row items-center space-x-2'>
                <p>Joined {format(created_at as string, "MMM do, yyyy")}</p>
                <div className='rounded-full bg-gray-300 p-[2px]' />
                <p>Last signed in: {formatDistanceToNow(new Date(last_sign_in_at as string), { addSuffix: true })}</p>
              </div>
            </div>

            {/* --- */}

            <div className={(!isOwnProfile && description) || (isOwnProfile && !description) ? "mt-4" : ""}>
              {!isOwnProfile && description ? (
                <div className=''>
                  <p>{description}</p>
                </div>
              ) : isOwnProfile && !description ? (
                <p>You haven't added your description yet... Give it a try!</p>
              ) : null} {/* Add functionality on click? */}
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* show liked quotos, show bookmarked quotos, show their OWN CREATED quotos */}
          {/* show their total likes, total made quotos */}
        </CardContent>
      </Card>
    </div>
  ) : <LoadingScreen/>
}

export default Profile