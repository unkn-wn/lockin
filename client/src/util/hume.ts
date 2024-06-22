import { HumeClient } from 'hume'

const hume = new HumeClient({
    apiKey: import.meta.env.VITE_APP_HUME_API_KEY
})

const socket = hume.expressionMeasurement.stream.connect({
    config: {
        language: {},
    },
})

for (const sample of samples) {
    const result = await socket.sendText({ text: sample });
    console.log(result);
}