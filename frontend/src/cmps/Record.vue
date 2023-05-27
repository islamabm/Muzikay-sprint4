<template>
  <div>
    <span
      :class="`mic`"
      @click.stop="ToggleMic"
      v-html="getSvg('record')"
    ></span>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import svgService from '../services/SVG.service.js'
const transcript = ref('')
const isRecording = ref(false)

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
const sr = new Recognition()

const emit = defineEmits(['update-name'])

const emitTranscript = (text) => {
  emit('update-name', text)
}

onMounted(() => {
  sr.continuous = true
  sr.interimResults = true

  sr.onstart = () => {
    isRecording.value = true
  }

  sr.onend = () => {
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
    emitTranscript(transcript.value)
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
const getSvg = (iconName) => {
  return svgService.getSpotifySvg(iconName)
}
</script>
