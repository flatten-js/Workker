import { useEffect } from 'react'
import { Alert } from '@mui/material'

function createAlert(message, severity = 'error') {
  return { id: Date.now(), message, severity }
}

function setCreateAlert([alerts, setAlerts], message, severity) {
  const newAlert = createAlert(message, severity)
  if (!alerts.some(alert => alert.message == newAlert.message)) {
    setAlerts([...alerts, newAlert])
  }
}

function Alerts(props) {
  const alerts = props.alerts || []
  const timeout = props.timeout || 5000
  const onAlerted = props.onAlerted || (() => {})

  useEffect(() => {
    if (alerts.length) {
      const timer = setTimeout(() => onAlerted(alerts[0].id), timeout)
      return () => clearTimeout(timer)
    }
  }, [alerts])

  return alerts.map(alert => {
    return <Alert key={ alert.id } severity={ alert.severity }>{ alert.message }</Alert>
  })
}

export default Alerts
export { createAlert, setCreateAlert }