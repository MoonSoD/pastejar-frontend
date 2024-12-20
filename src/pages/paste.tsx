import CodeEditor from '@uiw/react-textarea-code-editor';
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import client from '../util/ky';
import { Paste } from './pastes';
import useSWR from 'swr';
import { useEffect, useMemo } from 'react';
import Select, { ActionMeta, OnChangeValue } from 'react-select';
import { Tag } from './tags';
import Nav from '../components/Nav';

interface Inputs {
  title: string
  language: string
  content: string
  tag: number
}

interface Option { 
  value: number; 
  label: string 
}

export default function PastePage() {
  const params = useParams()
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()

  const { data, isLoading, mutate, error } = useSWR(`paste/all/${params.id}`, () => client.get(`paste/all/${params.id}?code=${searchParams.get("code")}`).json<Paste>())

  //const { data: tags } = useSWR("tags", () => client.get("pasteTags").json<Tag[]>())

  const tags: Tag[] = []

  const { register, watch, handleSubmit, setValue, getValues } = useForm<Inputs>({
    defaultValues: {
      title: "",
      language: "java",
      content: "class Meta {}",
    }
  })

  useEffect(() => {
    if (params.id !== "new") {
      return
    }

    client.post("pastes", {
      json: {
        content: ""
      }
    })
    .json<Paste>()
    .then((newPasteData) => {
      navigate(`/paste/${newPasteData.id}`, {
          replace: true
        }
      )
    })
  }, [params.id])

  useEffect(() => {
    setValue("content", data?.content || "")
  }, [data])


  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
  }

  function onDelete(id: number, code: string) {
    client.delete(`paste/all/${id}/${code}`)
    .json()
    .then(() => navigate("/pastes"))
  }

  function onCreateCode(id: number) {
    client.post<{code: string}>(`paste/all/${id}/code`)
    .json()
    .then((data) => {
      const link = `http://localhost:5173/paste/${id}?code=${data.code}`
      navigator.clipboard.writeText(link)
    })
    //.then(() => navigate(`/paste/${id}?code=true`))
  }

  function onSave() {
    client.put(`paste/all/${data?.id}`, {
      json: {
        //tags: data?.tags?.map((tag) => tag.id),
        content: getValues("content")
      } 
    }).then(() => mutate())
  }

  function onFlag(id: number) {
    client.post(`paste/all/${id}/flag`)
    .json()
  }

  return (
    <div className="bg-base-200 min-h-screen">
      <Nav />
      <form onSubmit={handleSubmit(onSubmit)} className="container w-1/2 mx-auto">
        <ul className="flex flex-col gap-4 pt-2">
          <div className="flex justify-between items-center mt-20">
            <div className="flex w-full items-center gap-2">
              <select
                className="select select-bordered w-full max-w-xs"
                {...register("language")}
              >
                <option disabled selected>Select language</option>
                <option value="js">Javascript</option>
                <option value="java">Java</option>
              </select>
              <button 
                className="btn btn-primary"
                onClick={onSave}
              >
                Save
              </button>
              <button 
                className="btn btn-neutral"
                onClick={() => data?.id && onCreateCode(data.id)}  
              >
                Code
              </button>
              {searchParams.get("review") !== "true" && (
                <button 
                  className="btn btn-error"
                  onClick={() => data?.id && onFlag(data.id)}  
                >
                  Flag
                </button>
              )}

              {searchParams.get("review") === "true" && (
                <button 
                  className="btn btn-error"
                  onClick={() => data?.id && onDelete(data.id, searchParams.get("code") ?? '')}  
                >
                  Reviewer Delete
                </button>
              )}

            </div>
          </div>
          <li className="bg-base-100 shadow-xl">
            <div className="card-body p-0 flex-row justify-between">
              <CodeEditor 
                placeholder="Paste your code here"
                language={watch("language")}
                {...register("content")}
                value={watch("content")}
                className="font-mono w-full rounded-xl text-base h-96"
                rows={20}
                padding={16}
                style={{
                  fontSize: 16
                }}
              />
            </div>
          </li>
        </ul>
      </form>

    </div>
  )
}