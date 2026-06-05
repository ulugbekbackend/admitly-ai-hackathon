import { Component } from 'react'
import { Button } from '@/components/ui/button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Kutilmagan xatolik yuz berdi</h1>
            <p className="text-sm text-gray-500 mb-6">
              {this.state.error?.message || 'Ilova to\'g\'ri yuklanmadi.'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Sahifani yangilash
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
