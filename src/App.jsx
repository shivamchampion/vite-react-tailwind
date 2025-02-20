import { useState } from 'react'
import { Button } from "@/components/ui/button"
import BusinessCard from '@/components/BusinessCard'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background text-foreground p-4">
      {/* Business Card Section */}
      <div className="w-full max-w-md">
        <BusinessCard />
      </div>

      {/* Original Button Demo Section */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold mb-8">Shadcn UI Buttons</h1>
        
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCount(count => count - 1)}
            >
              -
            </Button>
            <span className="text-2xl w-20 text-center">{count}</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCount(count => count + 1)}
            >
              +
            </Button>
          </div>

          <div className="flex flex-col gap-2 items-center mt-8">
            <Button variant="default">Default Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </div>

          <div className="flex gap-4 mt-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
