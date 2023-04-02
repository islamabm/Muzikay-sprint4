updateBodyBackgroundColor(color) {
    const darkShade = {
      ...color,
      rgba: `rgba(${Math.round(color.value[0] * 0.07)}, ${Math.round(
        color.value[1] * 0.07
      )}, ${Math.round(color.value[2] * 0.07)}, 0.7)`,
    }
    const headerShade = {
      ...color,
      rgba: `rgba(${Math.round(color.value[0] * 0.4)}, ${Math.round(
        color.value[1] * 0.4
      )}, ${Math.round(color.value[2] * 0.4)}, 0.7)`,
    }
    const gradient = `linear-gradient(to bottom, ${color.rgba}, ${headerShade.rgba})`
    const darkGradient = `linear-gradient(to bottom, ${darkShade.rgba} 0%, rgba(0, 0, 0, 1) 30%)`
    document.body.style.backgroundImage = gradient
    this.$refs.stationDetailsHeader.style.backgroundImage = gradient
    this.$refs.bottomHalf.style.backgroundImage = darkGradient
  }