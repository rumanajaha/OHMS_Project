import bg from "../assets/bg.jpg.webp"

export default function Login() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      <div className="hidden md:block h-full overflow-hidden">
        <img src={bg} className="h-full w-full object-cover" />
      </div>

      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <form className="space-y-6 py-10">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-semibold text-gray-900">
                Welcome back
              </h1>
              <p className="text-gray-500 text-sm">
                Sign in to manage your organizational hierarchy and team structure.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                type="email"
                placeholder="Enter your email address"
              />

              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex justify-end">
              <a className="text-sm text-purple-600 hover:text-purple-700 cursor-pointer">
                Forgot password?
              </a>
            </div>

            <button
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium hover:opacity-90 transition"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}