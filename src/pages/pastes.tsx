import { Link } from "react-router-dom";
import client from "../util/ky";
import useSWR from 'swr'
import { Tag } from "./tags";
import Nav from "../components/Nav";

export interface Paste {
  id: number
  content: string
  tags: Tag[]
}

export default function PastesPage() {
  const { data, mutate } = useSWR('pastes', () => client.get('paste/own').json<Paste[]>())

  function onDelete(id: number) {
    client.delete(`paste/all/${id}`)
    .json()
    .then(() => mutate())
  }

function onExport() {
  client.get(`paste/all/export`).then(response => {
    return response.blob()
  }).then(blob => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pastes_export.json'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(url)
  }).catch(error => {
    console.error('Export failed:', error)
  })
}

  return (
    <div className="bg-base-200 min-h-screen">
      <Nav />
      <div className="container w-1/2 mx-auto">
        <ul className="flex flex-col gap-4 pt-20">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Your pastes</h2>
            <button onClick={onExport} className="btn btn-primary">Export all</button>              
          </div>
          {data?.map((paste) => (
            <li key={paste.id} className="card card-compact bg-base-100 shadow-xl">
              <div className="card-body flex-row justify-between">
                <h3 className="card-title font-medium truncate">
                  <Link to={`/paste/${paste.id}`}>
                    (#{paste.id}) {paste.content}
                  </Link>
                </h3>
                <button 
                  onClick={() => onDelete(paste.id)}
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