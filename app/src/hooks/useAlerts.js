import { useState, useEffect } from 'react'

function useAlerts(timeout) {
  timeout = timeout || 5000

  const [alerts, setAlerts] = useState([])

  function createAlert(message, severity = 'error') {
    return { id: Date.now(), message, severity }
  }
  
  function setCreateAlert(message, severity) {
    const newAlert = createAlert(message, severity)
    if (!alerts.some(alert => alert.message == newAlert.message)) {
      setAlerts([...alerts, newAlert])
    }
  }

  async function setCreateErrorAlert(e) {
    if (e.name == 'AxiosError') {
      setCreateAlert(e.response?.data || e.message)
    } else {
      setCreateAlert(e.message)
    }
  }

  function alerted(id) {
    setAlerts(alerts.filter(alert => alert.id != id))
  }

  useEffect(() => {
    if (alerts.length) {
      const timer = setTimeout(() => alerted(alerts[0].id), timeout)
      return () => clearTimeout(timer)
    }
  }, [alerts])

  return [alerts, { setCreateAlert, setCreateErrorAlert }]
}

export default useAlerts