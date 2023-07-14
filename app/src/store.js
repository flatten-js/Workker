import axios from 'axios'

async function fetch(endpoint, options = {}, method = 'get') {
  const { data } = await axios[method](endpoint, options)
  return data
}

export async function getProjectAll() {
  return await fetch('/api/project/all')
}

export async function getProject(project_id) {
  return await fetch('/api/project/get', { params: { project_id } })
}

export async function getMarkers(project_id) {
  return await fetch('/api/marker/all', { params: { project_id } })
}

export async function createStamp(marker_id, user_id) {
  return await fetch('/api/stamp/add', { marker_id, user_id }, 'post')
}