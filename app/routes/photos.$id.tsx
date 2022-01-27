import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  MetaFunction,
  useActionData,
  useLoaderData,
} from 'remix'

import { unsplash } from '~/lib/api'
import { db } from '~/utils/db.server'

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const formData = await request.formData()
    const email = formData.get('email')

    if (!email) {
      return {
        errors: 'email is required',
      }
    }

    try {
      const isNotUnique = await db.subscription.findUnique({
        where: { email: email.toString() },
      })

      if (isNotUnique) {
        return json({ errors: 'You are already subscribed' }, 500)
      }

      await db.subscription.create({
        data: {
          email: email.toString(),
        },
      })
      return json({ ok: true }, 200)
    } catch (error: any) {
      console.error(error.message)
      return json({ errors: 'something went wrong' }, 500)
    }
  }

  return console.error('test')
}

export const meta: MetaFunction = ({ data }) => {
  const { image } = data

  return {
    title: `A photo by ${image.user.name}`,
    description: '',
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.id) {
    return json({}, 404)
  }

  const image = await unsplash.photos.get({ photoId: params.id })

  return {
    image: image.response,
  }
}

export default function PhotoPage() {
  const { image } = useLoaderData()
  return (
    <>
      <div className="container my-32 mx-auto space-y-4 text-center">
        <Link className="font-bold uppercase" to="/">
          Back to the gallery
        </Link>
        <img
          className="mx-auto w-full max-w-3xl rounded-xl shadow-xl"
          src={image.urls.regular}
          alt={image.alt_description}
        />
        <div className="py-8">
          <h2 className="text-lg">{image.user.name}</h2>
          <p className="text-sm">{image.user.bio}</p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl">
        <Subscribe />
      </div>
    </>
  )
}

function Subscribe() {
  const actionData = useActionData()

  return (
    <div className="p-5 bg-gray-900 rounded-lg shadow-xl lg:flex lg:items-center lg:p-10">
      {actionData?.ok ? (
        <h1 className="text-3xl font-bold text-center text-white md:text-4xl lg:text-left">
          Thank you for subbing
        </h1>
      ) : (
        <Form method="post">
          <h1 className="text-3xl font-bold text-center text-white md:text-4xl lg:text-left">
            Sign up for our newsletter
          </h1>
          <p className="text-white">Don't miss out.</p>
          <div className="mt-5 sm:flex sm:mx-auto sm:max-w-lg lg:mx-0">
            <input
              name="email"
              className="block py-3 px-5 w-full text-gray-300 bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 rounded border border-gray-700 focus:border-white outline-none focus:ring-1 focus:ring-white shadow-sm"
              type="email"
              placeholder="Your e-mail"
            />
            <button
              type="submit"
              className="py-3 px-5 mt-2.5 w-full font-medium text-white bg-purple-500 rounded focus:outline-none shadow-sm sm:shrink-0 sm:mt-0 sm:ml-5 sm:w-auto"
            >
              Subscribe
            </button>
          </div>
          {actionData?.errors && (
            <div className="py-2 text-red-300">{actionData?.errors}</div>
          )}
        </Form>
      )}
    </div>
  )
}
