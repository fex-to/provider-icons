import './App.css'
import { useState } from 'react'
import { IconUaNbu } from '@fex.to/icons-react'

function App() {
  const [active, setActive] = useState(false)
  return (
    <div className="App">
      <div>
        {[24,32,48,64,96,128,256,512].map((i) => <div><IconUaNbu size={i} /><>{i}px</><hr /></div>)}
      </div>
      <div>
        <a href="#"><IconUaNbu size={48} /></a>
        <a><IconUaNbu size={48} /></a>
        <a href="#"><IconUaNbu size={48} /></a>
      </div>
      <div style={{color:'#000000'}}>
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
      </div>
      <div style={{color:'#44ee11'}}>
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
      </div>
      <div style={{color:'#44ee'}}>
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
      </div>
      <div style={{color:'#44eeff'}}>
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
      </div>
      <div style={{color:'#fff'}}>
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
      </div>
      <div style={{color:'#ff0000'}}>
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
        <IconUaNbu size={48} />
      </div>
    </div>
  )
}

export default App
