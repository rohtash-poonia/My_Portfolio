'use client'

import { Component, Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false }
    static getDerivedStateFromError() { return { failed: true } }
    render() { return this.state.failed ? <div role="status" className="w-full h-full flex items-center justify-center text-gray-400 text-sm">3D scene unavailable</div> : this.props.children }
}

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
    scene: string
    className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [visible, setVisible] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)

    const allowHeavy = useMemo(() => {
        if (typeof window === 'undefined') return false
        const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isMobile = window.innerWidth < 1024
        return !reduced && !isMobile
    }, [])

    useEffect(() => {
        if (!allowHeavy) return
        const el = containerRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisible(true)
                }
            },
            { root: null, rootMargin: '200px', threshold: 0.01 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [allowHeavy])

    useEffect(() => {
        if (!allowHeavy) return
        if (!visible) return
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(() => setShouldRender(true), { timeout: 2000 })
            return () => window.cancelIdleCallback(id)
        }
        const timer = setTimeout(() => setShouldRender(true), 1200)
        return () => clearTimeout(timer)
    }, [allowHeavy, visible])

    if (!allowHeavy) {
        return (
            <div
                className={className}
                style={{
                    width: '100%',
                    height: '100%',
                    background:
                        'radial-gradient(1000px circle at 60% 40%, rgba(0,245,160,0.12), transparent 60%), linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 100%)',
                }}
            />
        )
    }

    return (
        <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }}>
            {!shouldRender ? (
                <div className="w-full h-full flex items-center justify-center">
                    <span className="loader"></span>
                </div>
            ) : (
                <Suspense
                    fallback={
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="loader"></span>
                        </div>
                    }
                >
                    <SceneBoundary><Spline scene={scene} className={className} /></SceneBoundary>
                </Suspense>
            )}
        </div>
    )
}
