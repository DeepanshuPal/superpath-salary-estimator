"use client"

import { useState } from "react"

type LlmRequestType = "insights" | "normalize-title" | "negotiation-script"

interface UseLlmOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  fallbackData?: any
}

export function useLlm(options: UseLlmOptions = {}) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [source, setSource] = useState<"llm" | "cache" | "fallback" | null>(null)

  const request = async (type: LlmRequestType, requestData: any) => {
    setIsLoading(true)
    setError(null)

    try {
      // Check browser storage cache first
      const cacheKey = `llm:${type}:${JSON.stringify(requestData)}`
      const cachedData = localStorage.getItem(cacheKey)

      if (cachedData) {
        const parsed = JSON.parse(cachedData)
        setData(parsed)
        setSource("cache")
        setIsLoading(false)
        options.onSuccess?.(parsed)
        return parsed
      }

      // Make API request
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          data: requestData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Use fallback if provided by the API
        if (errorData.fallback) {
          setData(errorData.fallback)
          setSource("fallback")
          setIsLoading(false)
          options.onSuccess?.(errorData.fallback)
          return errorData.fallback
        }

        // Otherwise use client-side fallback or throw error
        if (options.fallbackData) {
          setData(options.fallbackData)
          setSource("fallback")
          setIsLoading(false)
          options.onSuccess?.(options.fallbackData)
          return options.fallbackData
        }

        throw new Error(errorData.error || "Failed to process request")
      }

      const result = await response.json()
      setData(result.result)
      setSource(result.source)

      // Cache in browser storage
      localStorage.setItem(cacheKey, JSON.stringify(result.result))

      options.onSuccess?.(result.result)
      return result.result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      setError(error)
      options.onError?.(error)

      // Use fallback if available
      if (options.fallbackData) {
        setData(options.fallbackData)
        setSource("fallback")
        return options.fallbackData
      }

      return null
    } finally {
      setIsLoading(false)
    }
  }

  const regenerate = async (type: LlmRequestType, requestData: any) => {
    // Clear cache before regenerating
    const cacheKey = `llm:${type}:${JSON.stringify(requestData)}`
    localStorage.removeItem(cacheKey)

    // Make a fresh request
    return request(type, requestData)
  }

  return {
    data,
    isLoading,
    error,
    source,
    request,
    regenerate,
  }
}
