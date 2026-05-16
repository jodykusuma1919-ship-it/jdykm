'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Shield, User, Lock, Eye, EyeOff, LogIn, UserPlus, Loader2 } from 'lucide-react'

export function LoginPage() {
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      let result
      if (isRegister) {
        result = await register(username, password, displayName)
      } else {
        result = await login(username, password)
      }

      if (!result.success) {
        setError(result.error || 'An error occurred')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = () => {
    setIsRegister(!isRegister)
    setError('')
    setUsername('')
    setPassword('')
    setDisplayName('')
  }

  return (
    <div className="relative z-[1] flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 ring-2 ring-primary/40">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wide text-foreground">
            Prosgard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Guild Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-sm">
          <h2 className="mb-6 text-center font-serif text-xl font-semibold text-foreground">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Display Name Field (Register only) */}
            {isRegister && (
              <div className="space-y-2">
                <label htmlFor="displayName" className="block text-sm font-medium text-foreground">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How others will see you"
                    className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pl-10 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground transition-all hover:bg-primary-light disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isRegister ? (
                <>
                  <UserPlus className="h-5 w-5" />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={switchMode}
                  className="font-medium text-primary hover:text-primary-light"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                New member?{' '}
                <button
                  onClick={switchMode}
                  className="font-medium text-primary hover:text-primary-light"
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg border border-border/50 bg-secondary/30 p-3">
            <p className="mb-2 text-center text-xs font-medium text-muted-foreground">
              Demo Credentials
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-foreground">
              <span>Username: <code className="rounded bg-primary/20 px-1.5 py-0.5 text-primary">admin</code></span>
              <span>Password: <code className="rounded bg-primary/20 px-1.5 py-0.5 text-primary">admin123</code></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Secure guild management for your gaming community
        </p>
      </div>
    </div>
  )
}
