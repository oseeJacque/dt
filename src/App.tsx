import { Suspense, useState } from 'react'
import logo from '/logo.png'
import './App.css'

import { StrictMode } from 'react'

import { Button } from './components/ui/button'
import { Input } from './components/ui/input'

import Render from './components/Render'
import Processing from './components/Processing'
import ToastProvider from './providers/Toaster'

import { Canvas } from '@react-three/fiber'

function App() {
  const [word, setWord] = useState("")
  const [text, setText] = useState("...")
  const [toggle, setToggle] = useState(false)

  const handleChange = (words: string) => {
    setWord(words)
  }

  const handleClick = (event: any) => {
    event.preventDefault()
    setText(word)
  }

  const handleToggle = (event: any) => {
    event.preventDefault()
    setText("...")
    setWord("")
    setToggle(!toggle)
  }

  return (
    <div className='flex w-full h-full justify-between flex-col items-center'>
      <ToastProvider />
      <div className='w-full flex'>
        <a href="https://deafsync.tensorunit.com" className='w-auto' target="_blank">
          <img src={logo} className="logo" alt="tensorunit logo" />
        </a>
      </div>
      <h1 className='md:text-4xl text-3xl mb-3 font-bold'>
        Deaf Translator : {toggle ? "Render" : "Processing" }
      </h1>
      <p>
      {toggle ? "Render gotten animation from the backend here" : "Process glp file's animation in other to extract meta data : automation or save in DB" }
      </p>
      <div className='my-4'>
        {import.meta.env.MODE === "development" && <Button 
          variant={"default"} 
          onClick={handleToggle}
        >Switch</Button>}
      </div>
      <div className='md:p-4 p-2 flex justify-center items-center flex-col w-full'>
        <form className='flex w-full md:w-[70%] flex-col lg:flex-row'>
          <Input 
            type="text" 
            className='md:mr-3 mb-2' 
            value={word}
            disabled={!toggle}
            onFocus={() => {
              setText('...')
            }} 
            onChange={(e) => handleChange(e.target.value)}  
            placeholder="Enter yours words ..."
          ></Input>
          <Button 
            variant={"default"} 
            onClick={handleClick}
          >{toggle ? "Get animation" : "Save in DB" }</Button>
        </form>
      </div>
      <div>
        {text}
      </div>
      <div className='w-full h-full flex justify-center items-center'>
        <StrictMode>
          <div className='w-[250px] h-[308px] md:p-4 p-2'>
          <Canvas 
            className='rounded-lg flex justify-between b-0 bg-[#abb8c3]' 
          >
            <Suspense fallback={null}>
              {toggle ? <Render 
                words={text}
                /> : <Processing/>
              }
            </Suspense>
          </Canvas>
          </div>
        </StrictMode>
      </div>
      {/* <VideoPlayer /> */}
      <p className="read-the-docs pb-2">
        TensorPlugin-1.0
      </p>
    </div>
  )
}

export default App
