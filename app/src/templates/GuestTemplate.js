import Layout from '@@/Layout'

function GuestTemplate(props) {
  const alerts = props.alerts || []

  return (
    <Layout alerts={ alerts }>
      { props.children }
    </Layout>
  )
}

export default GuestTemplate