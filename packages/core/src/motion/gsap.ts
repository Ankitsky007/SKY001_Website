// Register GSAP plugins once for the whole app. All plugins (ScrollTrigger, SplitText, ...)
// ship free in the public `gsap` package since 3.13.
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

gsap.defaults({ ease: 'expo.out', duration: 1 })

export { gsap, ScrollTrigger, SplitText, useGSAP }
