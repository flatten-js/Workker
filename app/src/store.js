import axios from 'axios'

async function fetch(endpoint, options = {}, method = 'get') {
  const { data } = await axios[method](endpoint, options)
  return data
}

export async function signIn(data) {
  return await fetch('/auth/signin', data, 'post')
}

export async function signUp(data) {
  return await fetch('/auth/signup', data, 'post')
}

export async function signOut() {
  return await fetch('/auth/signout', {}, 'post')
}

export async function authenticate() {
  return await fetch('/auth/authenticate')
}

export async function getProjectAll() {
  return await fetch('/api/project/all')
}

export async function getProjectMy(params = {}) {
  return await fetch('/api/project/all/my', { params })
}

export async function getProjectTrying() {
  return await fetch('/api/project/all/trying')
}

export async function getProjectReported() {
  return await fetch('/api/project/all/reported')
}

export async function getProject(project_id) {
  return await fetch('/api/project/get', { params: { project_id } })
}

export async function createProject(data) {
  return await fetch('/api/project/create', data, 'post')
}

export async function deleteProject(project_id) {
  return await fetch('/api/project/delete', { project_id }, 'post')
}

export async function dropProject(project_id) {
  return await fetch('/api/project/drop', { project_id }, 'post')
}

export async function updateProjectPublic(project_id, is_public) {
  return await fetch('/api/project/public', { project_id, is_public }, 'post')
}

export async function getMarkers(project_id) {
  return await fetch('/api/marker/all', { params: { project_id } })
}

export async function createStamp(marker_id, position) {
  return await fetch('/api/stamp/add', { marker_id, position }, 'post')
}

export async function getOwnNFTs() {
  return await fetch('/api/nft/own')
}

export async function reveal(package_id, token_id) {
  return await fetch('/api/nft/reveal', { package_id, token_id }, 'post')
}

export async function getPackages() {
  return await fetch('/api/exchange/packages')
}

export async function exchange(package_id) {
  return await fetch('/api/exchange', { package_id }, 'post')
} 

export async function getUser() {
  return await fetch('/api/user/get')
}

export async function reportProject(project_id) {
  return await fetch('/api/project/report', { project_id }, 'post')
} 

export async function getReported(project_id) {
  return await fetch('/api/project/reported', { params: { project_id } })
}

export async function getShopItems() {
  return await fetch('/api/shop/items')
}

export async function paymentIntent(item_id) {
  return await fetch('/api/payment/intent', { item_id }, 'post')
}