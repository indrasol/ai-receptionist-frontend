import { useCallback, useEffect, useRef, useState } from "react";

import { API_ENDPOINTS } from "@/config/apiEndpoints";
import { receptionistService } from "@/services/receptionistService";

interface TaskRow { id: string; status: string }

export function useScrapeTask(receptionistId?: string) {
  const [task, setTask] = useState<TaskRow | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  const openWs = (id: string) => {
    const wsUrl = API_ENDPOINTS.SCRAPE.WS(id)
    console.log('Opening WebSocket connection to:', wsUrl)
    
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws
    
    ws.onopen = () => {
      console.log('WebSocket connected successfully')
    }
    
    ws.onmessage = (e) => {
      console.log('WebSocket message received:', e.data)
      setLogs((prev) => [...prev, e.data as string])
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      console.error('WebSocket URL was:', wsUrl)
      console.error('WebSocket readyState:', ws.readyState)
      console.error('Error details:', {
        type: error.type,
        target: error.target,
        currentTarget: error.currentTarget
      })
    }
    
    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason)
      if (event.code !== 1000) { // Not a normal closure
        console.log('WebSocket closed unexpectedly, attempting to reconnect...')
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (wsRef.current === ws) { // Only reconnect if this is still the current connection
            openWs(id)
          }
        }, 3000)
      }
    }
    
    wsRef.current = ws
  }

  const closeWs = () => {
    if (wsRef.current) {
      console.log('Closing WebSocket connection')
      wsRef.current.close(1000, 'Normal closure')
      wsRef.current = null
    }
  }

  const poll = async (id: string) => {
    try {
      const data = await receptionistService.makeRequest(API_ENDPOINTS.SCRAPE.TASK(id))
      setTask(data)
      
      if (data.status === "completed" || data.status === "failed") {
        closeWs()
        localStorage.removeItem("SCRAPE_TASK_ID")
      } else {
        setTimeout(() => poll(id), 5000)
      }
    } catch (error) {
      console.error('Error polling task:', error)
    }
  }

  const startScrape = useCallback(async (url: string) => {
    if (!receptionistId) return
    
    try {
      const body = { url, receptionist_id: receptionistId }
      const data = await receptionistService.makeRequest(API_ENDPOINTS.SCRAPE.START, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      
      if (!data?.task_id) {
        console.error('No task_id in response:', data)
        return
      }
      
      const id = data.task_id as string
      localStorage.setItem("SCRAPE_TASK_ID", id)
      setTask({ id, status: "queued" })
      setLogs([])
      openWs(id)
      poll(id)
    } catch (error) {
      console.error('Error starting scrape:', error)
    }
  }, [receptionistId])

  useEffect(() => {
    const existing = localStorage.getItem("SCRAPE_TASK_ID")
    
    if (existing) {
      openWs(existing)
      poll(existing)
      return () => closeWs()
    }
    
    // check active
    receptionistService.makeRequest(API_ENDPOINTS.SCRAPE.ACTIVE)
      .then((data) => {
        if (data?.id) {
          setTask(data)
          localStorage.setItem("SCRAPE_TASK_ID", data.id)
          openWs(data.id)
          poll(data.id)
        }
      })
      .catch(error => {
        console.error('Failed to check active tasks:', error)
      })
      
    return () => closeWs()
  }, [])

  const clearTask = useCallback(async () => {
    console.log('Clearing task and closing WebSocket')
    
    // Get task ID before clearing localStorage
    const existingTaskId = localStorage.getItem("SCRAPE_TASK_ID")
    
    // Close WebSocket and clear local state
    closeWs()
    localStorage.removeItem("SCRAPE_TASK_ID")
    setTask(null)
    setLogs([])
    
    // If we have a task ID, try to delete it from the backend
    if (existingTaskId) {
      try {
        await receptionistService.makeRequest(API_ENDPOINTS.SCRAPE.DELETE(existingTaskId), {
          method: "DELETE"
        })
        console.log('Successfully deleted task from backend')
      } catch (error) {
        console.warn('Failed to delete task from backend:', error)
      }
    }
  }, [])

  return { task, logs, startScrape, clearTask }
}
