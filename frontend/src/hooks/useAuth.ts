import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import {
  type Body_login_login_access_token as AccessToken,
  type ApiError,
  LoginService,
  type UserRegister,
  UsersService,
} from "../client"
import { handleError } from "../utils"
import { useAuthStore } from "../stores/authStore"

export const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null
}

const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, login: setAuth, logout: clearAuth, isAuthenticated } = useAuthStore()

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegister) =>
      UsersService.registerUser({ requestBody: data }),

    onSuccess: () => {
      navigate({ to: "/login" })
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const login = async (data: AccessToken) => {
    const response = await LoginService.loginAccessToken({
      formData: data,
    })
    // Get user data after login
    const userData = await UsersService.readUserMe()
    setAuth(userData, response.access_token)
    return response
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: "/dashboard" })
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
  })

  const logout = () => {
    clearAuth()
    queryClient.clear()
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    isAuthenticated,
    error,
    resetError: () => setError(null),
  }
}

export default useAuth
