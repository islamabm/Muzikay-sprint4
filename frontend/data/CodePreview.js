updateBodyBackgroundColor(color) {
  const darkShade = this.getShade(color, 0.07)
  const headerShade = this.getShade(color, 0.4)

  const gradient = `linear-gradient(to bottom, ${color.rgba}, ${headerShade.rgba})`
  const darkGradient = `linear-gradient(to bottom, ${darkShade.rgba} 0%, rgba(0, 0, 0, 1) 30%)`

  document.body.style.backgroundImage = gradient
  this.$refs.stationDetailsHeader.style.backgroundImage = gradient
  this.$refs.bottomHalf.style.backgroundImage = darkGradient
},
getShade(color, shadeLevel) {
 return {
    ...color,
    rgba: `rgba(${Math.round(color.value[0] * shadeLevel)}, ${Math.round(
      color.value[1] * shadeLevel
    )}, ${Math.round(color.value[2] * shadeLevel)}, 0.7)`,
  }
}