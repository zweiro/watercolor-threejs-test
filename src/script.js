import * as THREE from 'three'
import { gsap } from 'gsap'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const paperTexture = textureLoader.load('/textures/paper.jpg')
const watercolorTexture = textureLoader.load('/textures/watercolor.jpg')
const watercolorAlphaTexture = textureLoader.load('/textures/alpha.jpg')

/**
 * Object
 */
const bgGeometry = new THREE.PlaneGeometry(10, 10, 1)
const bgMaterial = new THREE.MeshBasicMaterial({ map: paperTexture })
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial)
scene.add(bgMesh)

const geometry = new THREE.PlaneGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: watercolorTexture })
const mesh = new THREE.Mesh(geometry, material)
material.alphaMap = watercolorAlphaTexture
material.transparent = true
material.opacity = 0.8
mesh.position.z = .1
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Fullscreen
 */
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
gsap.to(mesh.scale, { duration: 3, delay: 0, x: 1.1, repeat: -1, yoyoEase: true })
gsap.to(mesh.scale, { duration: 3, delay: 2, y: 1.1, repeat: -1, yoyoEase: true })
gsap.to(mesh.rotation, { duration: 3, delay: 2, y: 0.05, repeat: -1, yoyoEase: true })

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()