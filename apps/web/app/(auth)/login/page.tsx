'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { useSignin } from '~/hooks/api/auth'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import '~/components/auth/auth.css'

export default function LoginPage() {
  const router = useRouter()
  const { signInWithEmailAndPasswordAsync } = useSignin()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showPassword, setShowPassword] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })

    if (formRef.current) {
      gsap.from(formRef.current.children, {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      })
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}
    if (!formData.email.includes('@')) newErrors.email = 'Please enter a valid email address.'
    if (formData.password.length < 1) newErrors.password = 'Password is required.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await signInWithEmailAndPasswordAsync({
        email: formData.email,
        password: formData.password,
      })

      gsap.to(cardRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          // Redirect to dashboard or home after successful login
          router.push('/dashboard')
        }
      })
    } catch (err: any) {
      setErrors({ form: err?.message || 'Invalid email or password.' })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-stars" aria-hidden="true" />
      <div className="auth-noise" aria-hidden="true" />

      <nav className="auth-topbar">
        <div className="auth-topbar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>Kotonoha</span>
        </div>
        <div className="auth-topbar-right">
          <span className="auth-topbar-hint">Don't have an account?</span>
          <Link href="/sign-up" className="auth-topbar-btn">Sign up</Link>
        </div>
      </nav>

      <main className="auth-main">
        <div className="auth-content-wrapper">
          <div className="auth-card" ref={cardRef}>
            <div className="card-header">
              <h1 className="card-heading">Welcome back</h1>
              <p className="card-subtext">Log in to your account to continue.</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label className="field-label" htmlFor="email">Email address</label>
                <div className="field-input-wrap">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`field-input ${errors.email ? 'error' : ''}`}
                  />
                </div>
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="password">Password</label>
                <div className="field-input-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`field-input ${errors.password ? 'error' : ''}`}
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="field-error">{errors.password}</p>}
              </div>

              <div className="forgot-link-row">
                <Link href="/forgot-password" className="forgot-link">Forgot your password?</Link>
              </div>

              {errors.form && <p className="field-error" style={{ marginBottom: '10px' }}>{errors.form}</p>}

              <button
                type="submit"
                className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                <span className="btn-text">Log in</span>
              </button>

              <div className="card-footer">
                Don't have an account? <Link href="/sign-up">Create one</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
