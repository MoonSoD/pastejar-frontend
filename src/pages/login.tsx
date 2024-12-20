import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form"
import client from "../util/ky";

interface Inputs {
  username: string
  password: string
}

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>();
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const header = `${data.username}:${data.password}`
    const encodedHeader = btoa(header)

    const response = await client.get("users/me", {
      headers: {
        Authorization: `Basic ${encodedHeader}`,
      }
    })

    if (!response.ok) {
      alert("Bad credentials")
      return 
    }

    const body = await response.json()

    localStorage.setItem("username", body?.username)
    localStorage.setItem("auth", encodedHeader)

    console.log("Navigating...")

    navigate("/pastes")
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col gap-10 lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login!</h1>
          <p className="py-6">With an account, you can save your pasted documents!</p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Username</span>
              </label>
              <input {...register("username")} type="text" placeholder="username" className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input {...register("password")} type="password" placeholder="password" className="input input-bordered" required />
            </div>

            <p className="mt-3 text-sm">
              Don't have an account?, 
              &nbsp;<Link className="text-accent font-semibold" to="/register">Sign up!</Link>
            </p>

            <div className="form-control mt-3">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}