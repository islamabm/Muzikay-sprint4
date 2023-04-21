<template>
  <div>
    <button :class="`mic`" @click.stop="ToggleMic">r</button>
    <div v-text="transcript"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const transcript = ref('')
const isRecording = ref(false)

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
const sr = new Recognition()

const emitTranscript = (text) => {
  const event = new CustomEvent('transcript', { detail: text })
  window.dispatchEvent(event)
}
// In the ToggleMic function, after the sr.stop() call

onMounted(() => {
  sr.continuous = true
  sr.interimResults = true

  sr.onstart = () => {
    console.log('SR Started')
    isRecording.value = true
  }

  sr.onend = () => {
    console.log('SR Stopped')
    isRecording.value = false
  }

  sr.onresult = (evt) => {
    for (let i = 0; i < evt.results.length; i++) {
      const result = evt.results[i]

      if (result.isFinal) CheckForCommand(result)
    }

    const t = Array.from(evt.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('')

    transcript.value = t
  }
})

const CheckForCommand = (result) => {
  const t = result[0].transcript
  if (t.includes('stop recording')) {
    sr.stop()
  } else if (t.includes('what is the time') || t.includes("what's the time")) {
    sr.stop()
    alert(new Date().toLocaleTimeString())
    setTimeout(() => sr.start(), 100)
  }
}

const ToggleMic = () => {
  if (isRecording.value) {
    sr.stop()
    emitTranscript(transcript.value)
  } else {
    sr.start()
  }
}
</script>
