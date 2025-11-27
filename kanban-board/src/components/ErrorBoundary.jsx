import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Could log to external service
    // console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 24, textAlign: 'center'}}>
          <h2>Something went wrong.</h2>
          <p>{String(this.state.error)}</p>
        </div>
      )
    }
    return this.props.children
  }
}
