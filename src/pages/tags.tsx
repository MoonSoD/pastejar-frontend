import { useForm, SubmitHandler } from "react-hook-form"
import client from "../util/ky"
import useSWR from "swr"
import { Link } from "react-router-dom"
import Nav from "../components/Nav"

interface Inputs {
  title: string
}

export interface Tag {
  id: number
  label: string
}

export default function TagsPage() {
  const { register, watch, handleSubmit } = useForm<Inputs>()

  const { data, isLoading, mutate } = useSWR("tags", () => client.get("pasteTags").json<Tag[]>())

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    client.post("pasteTags", {
      json: {
        label: data.title
      }
    })
    .json()
    .then(() => mutate())
  }

  function onDelete(id: number) {
    client.delete(`pasteTags/${id}`)
    .json()
    .then(() => mutate())
  }

  return (
    <div className="bg-base-200 min-h-screen">
      <Nav />
      <div className="container w-1/2 mx-auto">
        <ul className="flex flex-col gap-4 pt-20">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Your tags</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
              <input {...register("title")} type="text" placeholder="New tag" className="input input-bordered w-full max-w-xs" />
              <input type="submit" className="btn btn-primary" value="Create" />
            </form>
          </div>
          {data?.map((tag) => (
            <li key={tag.id} className="card card-compact bg-base-100 shadow-xl">
              <div className="card-body flex-row justify-between">
                <h3 className="card-title font-medium truncate">
                  (#{tag.id}) {tag.label}
                </h3>
                <button 
                  onClick={() => onDelete(tag.id)} 
                  className="btn btn-error"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

