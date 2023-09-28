import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"

import { Stack, Button } from '@mui/material'

import UserTemplate from '@@/templates/UserTemplate'
import { ProjectSection } from '@@/components'
import { getProjectAll, getProjectAllCount } from '@@/store'
import useAlerts from '@@/hooks/useAlerts'


function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(1)
  const [page, setPage] = useState(1)

  const [alerts, { setCreateAlert }] = useAlerts()

  async function fetch() {
    try {
      setLoading(true)
      const projects = await getProjectAll(page)
      const count = await getProjectAllCount()
      setProjects(projects) 
      setCount(count)
    } catch (e) {
      setCreateAlert('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    fetch()
  }, [page])

  return (
    <>
      <UserTemplate alerts={ alerts }>
        <ProjectSection 
          title="New arrival" 
          message="There are currently no publicly available projects"
          projects={ projects }
          count={ count }
          page={ page }
          onChangePage={ (_, value) => setPage(value) }
          loading={ loading }
        />
      </UserTemplate>
    </>
  )
}

export default Home