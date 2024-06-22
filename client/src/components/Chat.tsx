import { useVoice } from '@humeai/voice-react'
import { useEffect } from 'react'

export default function Chat() {
    const { connect } = useVoice()

    useEffect(() => {
        connect()
    }

}