import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import client from "../util/ky";

interface Inputs {
  email: string
  username: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    client.post("users/register", {
      json: {
        email: data.email,
        username: data.username,
        password: data.password
      }
    })
    .json()
    .then(() => navigate("/login"))
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col gap-10 lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register!</h1>
          <p className="py-6">With an account, you can save your pasted documents!</p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">E-Mail</span>
              </label>
              <input {...register("email")} type="text" placeholder="email" className="input input-bordered" required />
            </div>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Confirm password</span>
              </label>
              <input {...register("confirmPassword")} type="password" placeholder="confirm password" className="input input-bordered" required />
            </div>

            <p className="mt-3 text-sm">
              Already have an account?, 
              &nbsp;<Link className="text-accent font-semibold" to="/login">Sign in!</Link>
            </p>

            <div className="form-control mt-3">
              <button className="btn btn-primary">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}