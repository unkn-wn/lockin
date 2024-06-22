import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { connect } from './lib/hume.ts'
import './index.css'
import { VoiceProvider } from '@humeai/voice-react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
