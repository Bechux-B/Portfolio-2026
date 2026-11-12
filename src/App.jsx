import { useState } from 'react'
import Spline from '@splinetool/react-spline'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const sceneUrl =
    import.meta.env.VITE_SPLINE_SCENE_URL ||
    'https://prod.spline.design/EPA0OIWaRnjG85k6/scene.splinecode'

  function handleSceneLoad(application) {
    const camera = application?._camera?.perspCamera
    if (camera) {
      camera.fov = 40
      camera.updateProjectionMatrix()
      application.requestRender()
    }
    setIsLoading(false)
  }

  return (
    <main className="scene-page">
      {isLoading && (
        <div className="scene-loader" role="status" aria-label="Loading 3D scene">
          <span className="loader-ring" />
        </div>
      )}
      <Spline
        className="scene-canvas"
        scene={sceneUrl}
        onLoad={handleSceneLoad}
      />
      <section
        className="orientation-notice"
        role="status"
        aria-labelledby="orientation-title"
      >
        <span className="orientation-icon" aria-hidden="true">
          <span className="orientation-phone" />
        </span>
        <h1 id="orientation-title">Rotate your phone</h1>
        <p>Turn your phone sideways to view the portfolio.</p>
      </section>
      <a className="graphic-design-link" href={`${import.meta.env.BASE_URL}portfolio`}>
        Graphic design
      </a>
    </main>
  )
}

export default App
