import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { portfolioItems } from '../data/portfolioData'

const slides = portfolioItems.filter(i => i.source === 'Instagram').slice(0,6).map(i => ({ image:i.thumbnail, title:i.title, text:i.description }))
export default function AuthCarousel(){
  const [index,setIndex]=useState(0), [paused,setPaused]=useState(false)
  useEffect(()=>{ if(paused) return; const id=setInterval(()=>setIndex(i=>(i+1)%slides.length),5500); return()=>clearInterval(id)},[paused])
  const slide=slides[index]
  return <div onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} className="relative hidden min-h-screen overflow-hidden bg-black lg:block">
    <AnimatePresence mode="wait"><motion.img key={slide.image} src={slide.image} alt={slide.title} className="absolute inset-0 h-full w-full object-cover" initial={{opacity:0,scale:1.05}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:.7}}/></AnimatePresence>
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />
    <div className="absolute left-10 right-10 top-10 flex items-center justify-between"><span className="badge border-gold/20 bg-black/35 text-gold"><Play size={13}/> Real Mellogang Assets</span><span className="text-sm text-white/55">{String(index+1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</span></div>
    <div className="absolute bottom-12 left-10 right-10"><motion.div key={slide.title} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}><p className="eyebrow">Cinematic Workspace</p><h1 className="mt-4 max-w-xl text-5xl font-semibold tracking-[-.05em] text-white">{slide.title}</h1><p className="mt-4 max-w-xl text-white/65">{slide.text}</p></motion.div><div className="mt-8 flex items-center justify-between"><div className="flex gap-2">{slides.map((_,i)=><button key={i} onClick={()=>setIndex(i)} className={`h-2 rounded-full transition ${i===index?'w-10 bg-gold':'w-2 bg-white/35'}`}/>)}</div><div className="flex gap-2"><button className="rounded-full bg-white/10 p-3" onClick={()=>setIndex((index-1+slides.length)%slides.length)}><ChevronLeft/></button><button className="rounded-full bg-white/10 p-3" onClick={()=>setIndex((index+1)%slides.length)}><ChevronRight/></button></div></div></div>
  </div>
}
