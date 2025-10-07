import './App.css'
import { useState } from 'react'
import { IconUanb } from '@fex-to/provider-icons-react'

function App() {
  const [active, setActive] = useState(false)
  return (
    <div className="App">
      <div>
        {[24,32,48,64,96,128,256,512].map((i) => <div><IconUanb size={i} /><>{i}px</><hr /></div>)}
      </div>
      <div>
        <a href="#"><IconUanb size={48} /></a>
        <a><IconUanb size={48} /></a>
        <a href="#"><IconUanb size={48} /></a>
      </div>
      <div style={{color:'#000000'}}>
        <IconUanb size={48} />
        <IconUanb size={48} />
        <IconUanb size={48} />
      </div>
      <div style={{color:'#44ee11'}}>
        <IconUanb size={48} />
        <IconUanb size={48} />
        <IconUanb size={48} />
      </div>
      <div style={{color:'#44ee'}}>
        <IconUanb size={48} />
        <IconUanb size={48} />
        <IconUanb size={48} />
      </div>
      <div style={{color:'#44eeff'}}>
        <IconUanb size={48} />
        <IconUanb size={48} />
        <IconUanb size={48} />
      </div>
      <div style={{color:'#fff'}}>
        <IconUanb size={48} />
        <IconUanb size={48} />
        <IconUanb size={48} />
      </div>
      <div style={{color:'#ff0000'}}>
        <IconUanb size={48} />
        <IconUanb size={48} />
        <IconUanb size={48} />
      </div>
    </div>
  )
}

export default App
