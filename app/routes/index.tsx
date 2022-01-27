import { Link, LoaderFunction, useLoaderData } from 'remix'

import { unsplash } from '~/lib/api'

export const loader: LoaderFunction = async () => {
  const images = await unsplash.photos.getRandom({ count: 9 })

  return {
    images: images.response,
  }
}

export default function IndexPage() {
  const { images } = useLoaderData()

  return (
    <div className="flex flex-col space-y-8 text-center">
      <h1 className="mx-auto max-w-sm text-6xl font-black text-center text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600">
        frrrip throwing remix into the mix
      </h1>
      <h2 className="text-3xl font-bold text-black">A brownbag about remix</h2>
      <div className="mx-auto space-y-8 max-w-sm">
        {images.map((image: any) => (
          <Link
            to={`/photos/${image.id}`}
            key={image.id}
            className="block w-full rounded-xl shadow-xl transition-transform hover:scale-110"
          >
            <img src={image.urls.regular} alt={image.alt_description} />
          </Link>
        ))}
      </div>
    </div>
  )
}
