import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import tapeAsset from './assets/Tape_Subpage field.svg'
import swordAsset from './assets/Pixel_sword.svg'
import './Graphic_Design.css'

const projects = [
  {
    number: '01',
    title: 'Title of project',
    date: 'Date of creation',
    description: 'Informational text field',
    credit: 'Company / creator',
    artwork: 'project-artwork--first',
    artworkLabel: 'Graphic design study',
    images: [],
    youtubeUrl: '',
  },
  {
    number: '02',
    title: 'Title of project',
    date: 'Date of creation',
    description: 'Informational text field',
    credit: 'Company / creator',
    artwork: 'project-artwork--second',
    artworkLabel: 'Visual identity study',
    images: [],
    youtubeUrl: '',
  },
]

function getYouTubeEmbedUrl(url) {
  if (!url) return ''

  let parsedUrl
  try {
    parsedUrl = new URL(url, window.location.origin)
  } catch {
    return ''
  }

  const host = parsedUrl.hostname.replace(/^www\./, '')
  if (!['youtu.be', 'youtube.com', 'm.youtube.com'].includes(host)) return ''

  const pathParts = parsedUrl.pathname.split('/').filter(Boolean)
  const videoId = host === 'youtu.be'
    ? pathParts[0]
    : parsedUrl.searchParams.get('v') ||
      (['embed', 'shorts', 'live'].includes(pathParts[0]) ? pathParts[1] : '')

  if (!videoId || !/^[\w-]{11}$/.test(videoId)) return ''
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
}

function getYouTubeThumbnail(url) {
  const embedUrl = getYouTubeEmbedUrl(url)
  const videoId = embedUrl.match(/embed\/([\w-]{11})/)?.[1]
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ''
}

function ArtworkVisual({ project, onOpen }) {
  const youtubeThumbnail = getYouTubeThumbnail(project.youtubeUrl)
  const firstImage = project.images?.[0]

  return (
    <button
      type="button"
      className={`project-artwork ${project.artwork}`}
      onClick={onOpen}
      aria-label={`Open ${project.artworkLabel} preview`}
    >
      {firstImage ? (
        <img
          className="project-thumbnail"
          src={typeof firstImage === 'string' ? firstImage : firstImage.src}
          alt={typeof firstImage === 'string' ? project.artworkLabel : firstImage.alt || project.artworkLabel}
        />
      ) : youtubeThumbnail ? (
        <img className="project-thumbnail" src={youtubeThumbnail} alt={`${project.artworkLabel} video thumbnail`} />
      ) : (
        <>
          <span className="artwork-index">{project.number}</span>
          <span className="artwork-caption">{project.artworkLabel}</span>
        </>
      )}
      {project.youtubeUrl && <span className="video-play-icon" aria-hidden="true">▶</span>}
    </button>
  )
}

function ProjectEntry({ project, reverse = false, onOpen }) {
  return (
    <article
      className={`project-row${reverse ? ' project-row--reverse' : ''}`}
      id={`project-${project.number}`}
    >
      <ArtworkVisual project={project} onOpen={(event) => onOpen(project, event)} />
      <div className="project-copy">
        <p className="project-number">Selected work / {project.number}</p>
        <h2>{project.title}</h2>
        <p className="project-date">{project.date}</p>
        <p className="project-description">{project.description}</p>
        <p className="project-credit">{project.credit}</p>
      </div>
    </article>
  )
}

function PortfolioPage() {
  const [activeProject, setActiveProject] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isViewerClosing, setIsViewerClosing] = useState(false)
  const labelRef = useRef(null)
  const titleRef = useRef(null)
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const viewerTimerRef = useRef(null)
  const touchStartXRef = useRef(null)
  const isViewerClosingRef = useRef(false)

  useLayoutEffect(() => {
    const label = labelRef.current
    const heading = titleRef.current
    const context = document.createElement('canvas').getContext('2d')
    if (!label || !heading || !context || !window.ResizeObserver) return

    const fitTitle = () => {
      const style = window.getComputedStyle(heading)
      context.font = `${style.fontWeight} 100px ${style.fontFamily}`
      const textWidth = context.measureText(heading.textContent || '').width
      if (!textWidth) return

      const width = label.clientWidth
      const fontSize = Math.min(width * 0.12, (width * 0.88 * 100) / textWidth)
      heading.style.fontSize = `${Math.max(24, fontSize)}px`
    }

    const observer = new ResizeObserver(fitTitle)
    observer.observe(label)
    fitTitle()
    document.fonts?.ready.then(fitTitle)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!activeProject) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0)

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        if (isViewerClosingRef.current) return
        isViewerClosingRef.current = true
        setIsViewerClosing(true)
        viewerTimerRef.current = window.setTimeout(() => {
          setActiveProject(null)
          setIsViewerClosing(false)
          isViewerClosingRef.current = false
        }, 180)
      }
      if (event.key === 'ArrowRight' && activeProject.images?.length > 1) {
        setActiveIndex((index) => (index + 1) % activeProject.images.length)
      }
      if (event.key === 'ArrowLeft' && activeProject.images?.length > 1) {
        setActiveIndex((index) => (index - 1 + activeProject.images.length) % activeProject.images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [activeProject])

  useEffect(() => () => window.clearTimeout(viewerTimerRef.current), [])

  function openProject(project, event) {
    window.clearTimeout(viewerTimerRef.current)
    isViewerClosingRef.current = false
    triggerRef.current = event.currentTarget
    setActiveIndex(0)
    setIsViewerClosing(false)
    setActiveProject(project)
  }

  function closeViewer() {
    if (isViewerClosingRef.current) return
    isViewerClosingRef.current = true
    setIsViewerClosing(true)
    viewerTimerRef.current = window.setTimeout(() => {
      setActiveProject(null)
      setIsViewerClosing(false)
      isViewerClosingRef.current = false
    }, 180)
  }

  function showPreviousImage() {
    setActiveIndex((index) => (index - 1 + activeProject.images.length) % activeProject.images.length)
  }

  function showNextImage() {
    setActiveIndex((index) => (index + 1) % activeProject.images.length)
  }

  function handleTouchStart(event) {
    touchStartXRef.current = event.changedTouches[0].clientX
  }

  function handleTouchEnd(event) {
    if (touchStartXRef.current === null || activeProject.images?.length < 2) return

    const delta = event.changedTouches[0].clientX - touchStartXRef.current
    if (Math.abs(delta) > 45) {
      if (delta > 0) showPreviousImage()
      else showNextImage()
    }
    touchStartXRef.current = null
  }

  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'instant' : 'smooth' })
  }

  const activeYoutubeEmbed = activeProject && getYouTubeEmbedUrl(activeProject.youtubeUrl)
  const activeImages = activeProject?.images || []
  const activeImage = activeImages[activeIndex]

  return (
    <main className="portfolio-page">
      <div className="portfolio-backdrop" aria-hidden="true">
        <div className="floppy-disk">
          <div className="floppy-window">
            <span className="floppy-window-slot" />
          </div>
          <span className="floppy-screw floppy-screw--left" />
          <span className="floppy-screw floppy-screw--right" />
          <span className="floppy-lock" />
        </div>
      </div>

      <header className="portfolio-header">
        <a href={import.meta.env.BASE_URL} aria-label="Return to home">
          HOME
        </a>
      </header>

      <section
        className="graphic-design-notice"
        role="status"
        aria-labelledby="graphic-design-notice-title"
      >
        <h1 id="graphic-design-notice-title">
          Uh oh, the digital gnomes are still digging here.
        </h1>
        <p>
          To view a different version of the portfolio,{' '}
          <a
            href={`${import.meta.env.BASE_URL}BeatriseBidere_Portfolio_2026.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            click here
          </a>
          . To go back HOME,{' '}
          <a href={import.meta.env.BASE_URL}>click here</a>.
        </p>
      </section>

      <section className="portfolio-hero" aria-labelledby="portfolio-title">
        <div className="portfolio-label" ref={labelRef}>
          <img className="portfolio-tape" src={tapeAsset} alt="" />
          <h1 id="portfolio-title" ref={titleRef}>
            Graphic Design
          </h1>
        </div>
      </section>

      <section className="project-list" aria-label="Selected projects">
        {projects.map((project, index) => (
          <ProjectEntry
            key={project.number}
            project={project}
            reverse={index % 2 === 1}
            onOpen={openProject}
          />
        ))}
      </section>

      <button className="back-to-top" type="button" onClick={scrollToTop}>
        <img
          className="back-to-top-sword"
          src={swordAsset}
          aria-label="Upward sword"
          alt="Upward sword"
        />
        <span>BACK TO TOP</span>
      </button>

      {activeProject && (
        <div
          className={`media-viewer${isViewerClosing ? ' media-viewer--closing' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeProject.artworkLabel} preview`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeViewer()
          }}
        >
          <button
            ref={closeButtonRef}
            className="media-viewer-close"
            type="button"
            aria-label="Close preview"
            onClick={closeViewer}
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="media-viewer-content" onClick={(event) => event.stopPropagation()}>
            {activeYoutubeEmbed ? (
              <iframe
                className="media-viewer-video"
                src={activeYoutubeEmbed}
                title={`${activeProject.artworkLabel} video`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : activeImage ? (
              <img
                key={activeIndex}
                className="media-viewer-image"
                src={typeof activeImage === 'string' ? activeImage : activeImage.src}
                alt={typeof activeImage === 'string' ? activeProject.artworkLabel : activeImage.alt || activeProject.artworkLabel}
              />
            ) : (
              <div
                className={`project-artwork project-artwork--expanded ${activeProject.artwork}`}
                role="img"
                aria-label={`${activeProject.artworkLabel} enlarged placeholder`}
              >
                <span className="artwork-index">{activeProject.number}</span>
                <span className="artwork-caption">{activeProject.artworkLabel}</span>
              </div>
            )}
            {!activeYoutubeEmbed && activeImages.length > 1 && (
              <>
                <button
                  className="media-viewer-nav media-viewer-nav--previous"
                  type="button"
                  aria-label="Previous image"
                  onClick={showPreviousImage}
                >
                  ‹
                </button>
                <button
                  className="media-viewer-nav media-viewer-nav--next"
                  type="button"
                  aria-label="Next image"
                  onClick={showNextImage}
                >
                  ›
                </button>
                <p className="media-viewer-count" aria-live="polite">
                  {activeIndex + 1} / {activeImages.length}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default PortfolioPage