import './App.css'
import { useState } from 'react'
import { IconUaNbu } from '@fex.to/icons-react'

function App() {
  const [active, setActive] = useState(false)
  return (
    <div className="App">
      <div>
        {[24,32,48,64,96,128,256,512].map((i) => <div><IconUaNb size={i} /><>{i}px</><hr /></div>)}
      </div>
      <div>
        <a href="#"><IconUaNb size={48} /></a>
        <a><IconUaNb size={48} /></a>
        <a href="#"><IconUaNb size={48} /></a>
      </div>
      <div style={{color:'#000000'}}>
        <IconUaNb size={48} />
        <IconUaNb size={48} />
        <IconUaNb size={48} />
      </div>
      <div style={{color:'#44ee11'}}>
        <IconUaNb size={48} />
        <IconUaNb size={48} />
        <IconUaNb size={48} />
      </div>
      <div style={{color:'#44ee'}}>
        <IconUaNb size={48} />
        <IconUaNb size={48} />
        <IconUaNb size={48} />
      </div>
      <div style={{color:'#44eeff'}}>
        <IconUaNb size={48} />
        <IconUaNb size={48} />
        <IconUaNb size={48} />
      </div>
      <div style={{color:'#fff'}}>
        <IconUaNb size={48} />
        <IconUaNb size={48} />
        <IconUaNb size={48} />
      </div>
      <div style={{color:'#ff0000'}}>
        <IconUaNb size={48} />
        <IconUaNb size={48} />
        <IconUaNb size={48} />
      </div>
    </div>
  )
}

export default App
