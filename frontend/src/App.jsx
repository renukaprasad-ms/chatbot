import './App.css'
import ChatSection from './components/ChatSection'
import HistorySidebar from './components/HistorySideBar'

function App() {

  return (
    <div className='w-full h-screen flex'>
      <HistorySidebar/>
      <ChatSection/>
      
    </div>
  )
}

export default App
